#!/usr/bin/env python3
"""Nonblocking BUILD probe for official source metadata.

This script does not treat guessed frame/page numbers as facts. It only records what
official endpoints expose to the CI runner so the BUILD asset blockers can be narrowed.
"""
from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path
from urllib.parse import urlparse

OUT = Path('dokdo-1905-file/qa-artifacts/asset-probe')
OUT.mkdir(parents=True, exist_ok=True)
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36'

URLS = {
    'naj-item-json': 'https://www.digital.archives.go.jp/item/3018187.json',
    'naj-item-html': 'https://www.digital.archives.go.jp/item/en/3018187',
    'naj-viewer-html': 'https://www.digital.archives.go.jp/img/3018187',
    'jacar-1877': 'https://www.jacar.archives.go.jp/das/meta/A07060000300',
    'jacar-tsushima': 'https://www.jacar.archives.go.jp/das/meta/C09050402800',
}


def curl(url: str, dest: Path) -> tuple[bool, str]:
    cmd = [
        'curl', '-fsSL', '--retry', '1', '--max-time', '30',
        '-A', UA, '-H', 'Accept-Language: ja,en;q=0.8', url, '-o', str(dest)
    ]
    p = subprocess.run(cmd, text=True, capture_output=True)
    return p.returncode == 0, (p.stderr or '').strip()


report: dict[str, object] = {'fetches': {}, 'discovered': {}}
for name, url in URLS.items():
    ext = '.json' if name.endswith('json') else '.html'
    dest = OUT / f'{name}{ext}'
    ok, err = curl(url, dest)
    size = dest.stat().st_size if dest.exists() else 0
    report['fetches'][name] = {'url': url, 'ok': ok, 'bytes': size, 'error': err}


def walk_json(obj, path=''):
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield from walk_json(v, f'{path}/{k}')
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from walk_json(v, f'{path}/{i}')
    elif isinstance(obj, str):
        yield path, obj


item_path = OUT / 'naj-item-json.json'
manifest_urls: list[str] = []
if item_path.exists() and item_path.stat().st_size:
    try:
        data = json.loads(item_path.read_text(encoding='utf-8'))
        hits = []
        for p, s in walk_json(data):
            low = s.lower()
            if any(k in low for k in ('iiif', 'manifest', 'thumbnail', '/img/', 'license')):
                hits.append({'path': p, 'value': s})
            if 'api/iiif/' in low and 'manifest.json' in low and s.startswith('http'):
                manifest_urls.append(s)
        report['discovered']['naj_item_hits'] = hits[:200]
    except Exception as e:
        report['discovered']['naj_item_parse_error'] = repr(e)

# Some APIs embed URLs inside escaped JSON strings or HTML. Scan all successful text responses too.
url_re = re.compile(r'https?://[^\s"\'<>\\]+')
for p in sorted(OUT.glob('*')):
    if p.suffix not in {'.json', '.html', '.txt'} or not p.is_file():
        continue
    try:
        text = p.read_text(encoding='utf-8', errors='replace')
    except Exception:
        continue
    urls = []
    for u in url_re.findall(text):
        low = u.lower()
        if any(k in low for k in ('iiif', 'manifest', 'image', 'viewer', 'thumbnail', '/img/')):
            urls.append(u)
        if 'api/iiif/' in low and 'manifest.json' in low:
            manifest_urls.append(u)
    if urls:
        report['discovered'][f'urls:{p.name}'] = list(dict.fromkeys(urls))[:200]

manifest_urls = list(dict.fromkeys(manifest_urls))
report['discovered']['manifest_candidates'] = manifest_urls

# Fetch only manifest URLs explicitly exposed by official metadata; never invent an identifier.
for i, url in enumerate(manifest_urls[:5]):
    dest = OUT / f'naj-manifest-{i}.json'
    ok, err = curl(url, dest)
    report['fetches'][f'naj-manifest-{i}'] = {
        'url': url,
        'ok': ok,
        'bytes': dest.stat().st_size if dest.exists() else 0,
        'error': err,
    }
    if ok:
        try:
            data = json.loads(dest.read_text(encoding='utf-8'))
            hits = []
            for pth, s in walk_json(data):
                low = s.lower()
                if any(k in low for k in ('canvas', 'image', 'service', '.jpg', '.jpeg', '.png', '.webp')):
                    hits.append({'path': pth, 'value': s})
            report['discovered'][f'manifest_hits_{i}'] = hits[:400]
        except Exception as e:
            report['discovered'][f'manifest_parse_error_{i}'] = repr(e)

# Extract useful JACAR page strings without claiming they are frame identifiers.
for name in ('jacar-1877.html', 'jacar-tsushima.html'):
    p = OUT / name
    if not p.exists() or not p.stat().st_size:
        continue
    text = p.read_text(encoding='utf-8', errors='replace')
    snippets = []
    for pattern in ('image', 'frame', 'page', 'viewer', 'jpeg', 'jpg', 'png', 'djvu', 'コマ', '画像'):
        for m in re.finditer(pattern, text, flags=re.I):
            a = max(0, m.start() - 160)
            b = min(len(text), m.end() + 240)
            snippets.append(re.sub(r'\s+', ' ', text[a:b]))
            if len(snippets) >= 80:
                break
        if len(snippets) >= 80:
            break
    report['discovered'][f'snippets:{name}'] = snippets

(OUT / 'probe-summary.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report, ensure_ascii=False, indent=2))
