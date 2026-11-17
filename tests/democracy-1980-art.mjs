// democracy-1980 — v1.4 art layer checks: illustrations are decorative, local, light,
// labelled as non-sources, and the inline SVG stays as fallback.
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

const dir = new URL('../democracy-1980/', import.meta.url);
const html = readFileSync(new URL('index.html', dir), 'utf8');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];

const map = JSON.parse(code.match(/const HERO_ART=(\{[^}]*\});/)[1].replace(/'/g, '"'));
assert.deepEqual(Object.keys(map).sort(), ['1', '2', '3', '4:1', '4:2', '5'], 'one illustration per scene / C stage');
for (const [key, src] of Object.entries(map)) {
  assert.match(src, /^art\/[0-9a-z_]+\.webp$/, key + ' must be a local relative WebP');
  const file = new URL(src, dir);
  const bytes = readFileSync(file);
  assert.equal(bytes.subarray(0, 4).toString(), 'RIFF', src + ' RIFF header');
  assert.equal(bytes.subarray(8, 12).toString(), 'WEBP', src + ' WEBP header');
  assert.ok(statSync(file).size <= 80 * 1024, src + ' must stay ≤ 80KB');
}
assert.ok(/<img id="heroArt" class="hero-art" alt="" aria-hidden="true"/.test(html), 'illustration is decorative for screen readers');
assert.ok(html.includes('창작 일러스트 · 실제 사료 아님'), 'non-source label present');
assert.ok(html.includes('<svg class="hero-illustration"'), 'inline SVG fallback kept');
assert.ok(code.includes('img.onerror=') && code.includes("hero.classList.remove('has-art')"), 'load failure falls back to SVG');
assert.ok(!/https?:\/\/[^'"]*\.(webp|png|jpe?g)/i.test(html), 'no external image hosts');
assert.ok(html.includes('@media(prefers-reduced-motion:reduce){.hero-art{transition:none!important}}'), 'no crossfade under reduced motion');

console.log('1980 art layer checks: PASS (6 local WebP ≤80KB, decorative, labelled, SVG fallback)');

// Jiwoo portrait: local file, decorative, SVG face kept as fallback
const photos = JSON.parse(code.match(/const FRIEND_PHOTOS=(\{[^}]*\});/)[1].replace(/'/g, '"').replace(/([{,])(\w+):/g, '$1"$2":'));
assert.deepEqual(Object.keys(photos).sort(), ['curious', 'neutral', 'smile']);
for (const src of new Set(Object.values(photos))) {
  assert.match(src, /^art\/[0-9a-z_]+\.webp$/);
  const b = readFileSync(new URL(src, dir));
  assert.equal(b.subarray(8, 12).toString(), 'WEBP', src);
  assert.ok(b.length <= 80 * 1024, src + ' ≤ 80KB');
}
assert.ok(code.includes('alt="" aria-hidden="true" width="56" height="56" onerror="this.remove()"'), 'portrait is decorative and falls back');
assert.ok(html.includes('.friend-face .friend-photo+svg{display:none}'), 'SVG face shows only when the photo is gone');
console.log('1980 Jiwoo portrait checks: PASS');
