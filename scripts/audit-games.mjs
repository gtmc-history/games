import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = path.join(ROOT, 'games.manifest.json');
const PUBLIC_ORIGIN = 'https://gtmc-history.github.io';
const STATUSES = new Set(['draft', 'design-locked', 'implemented', 'tested', 'published', 'archived']);
const SAVE_LEVELS = new Set(['required', 'optional', 'none']);
const DASH_LEVELS = new Set(['A', 'B', 'C']);
const FOLDER_REQUIRED = new Set(['implemented', 'tested', 'published']);
const NON_GAME_DIRECTORIES = new Set([
  '.claude', '.codex', '.git', '.github', 'autobiography', 'dashboard', 'docs',
  'meta', 'node_modules', 'scripts', 'supabase', 'tasks', 'vault',
]);
const REQUIRED_OPERATIONS_FILES = [
  'AGENTS.md',
  'docs/index.md',
  'docs/GAME_CONTRACT.md',
  'docs/DESIGN_PRINCIPLES.md',
  'docs/DATA_CONTRACT.md',
  'docs/RELEASE_CHECKLIST.md',
  'docs/SECURITY.md',
  'docs/TECH_DEBT.md',
  'supabase/AGENTS.md',
  'games.manifest.json',
  'package.json',
  '.github/workflows/game-audit.yml',
];

class AuditReport {
  constructor() {
    this.items = [];
    this.counts = { manifest: 0, filesystem: 0, published: 0, A: 0, B: 0, C: 0, aliases: 0 };
  }

  add(status, label, detail = '') {
    this.items.push({ status, label, detail });
  }

  pass(label, detail = '') { this.add('PASS', label, detail); }
  warn(label, detail = '') { this.add('WARN', label, detail); }
  skip(label, detail = '') { this.add('SKIP', label, detail); }
  error(label, detail = '') { this.add('ERROR', label, detail); }

  exactError(kind, slug, expected, actual) {
    this.error(kind, `slug=${slug} expected=${expected} actual=${actual}`);
  }

  errorCount() { return this.items.filter(item => item.status === 'ERROR').length; }

  print() {
    const warnings = this.items.filter(item => item.status === 'WARN').length;
    const errors = this.errorCount();
    const skips = this.items.filter(item => item.status === 'SKIP').length;
    console.log('Game Integration Audit');
    console.log('');
    console.log(`Manifest: ${this.counts.manifest}`);
    console.log(`Filesystem: ${this.counts.filesystem}`);
    console.log(`Published: ${this.counts.published}`);
    console.log(`DASH: A=${this.counts.A} B=${this.counts.B} C=${this.counts.C}`);
    console.log(`Aliases: ${this.counts.aliases}`);
    console.log('');
    for (const item of this.items) {
      console.log(`${item.status.padEnd(5)} ${item.label}${item.detail ? ` — ${item.detail}` : ''}`);
    }
    console.log('');
    console.log(`Warnings: ${warnings}`);
    console.log(`Errors: ${errors}`);
    console.log(`Skips: ${skips}`);
  }
}

function usage() {
  console.log(`Usage: npm run audit:games -- [options]\n\nOptions:\n  --hub-repo <path>  Check the sibling hub/dashboard repository\n  --production       Read-only checks for Pages, resources, and production game_meta coverage\n  --help             Show this help`);
}

function parseArgs(argv) {
  const options = { hubRepo: '', production: false, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--production') options.production = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--hub-repo') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new Error('--hub-repo requires a path');
      options.hubRepo = value;
      index += 1;
    } else if (arg.startsWith('--hub-repo=')) {
      options.hubRepo = arg.slice('--hub-repo='.length);
      if (!options.hubRepo) throw new Error('--hub-repo requires a path');
    } else {
      throw new Error(`unknown option: ${arg}`);
    }
  }
  return options;
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadManifest(report) {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, 'utf8');
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch (error) {
    report.error('manifest JSON', `${MANIFEST_PATH}: ${error.message}`);
    return null;
  }
}

async function auditOperationsStructure(report) {
  const missing = [];
  for (const relative of REQUIRED_OPERATIONS_FILES) {
    if (!(await exists(path.join(ROOT, ...relative.split('/'))))) missing.push(relative);
  }
  if (missing.length) report.error('operations structure', `expected=required files actual=missing:${missing.join(',')}`);
  else report.pass('operations knowledge structure', `${REQUIRED_OPERATIONS_FILES.length} required files`);
}

function validateManifest(manifest, report) {
  const before = report.errorCount();
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    report.error('manifest schema', 'expected=object actual=invalid');
    return [];
  }
  if (manifest.schemaVersion !== 1) {
    report.error('manifest schemaVersion', `expected=1 actual=${String(manifest.schemaVersion)}`);
  }
  if (!Array.isArray(manifest.games)) {
    report.error('manifest games', 'expected=array actual=missing-or-invalid');
    return [];
  }

  const games = manifest.games;
  const canonical = new Map();
  const aliasOwners = new Map();
  games.forEach((game, index) => {
    const ref = game?.slug || `index:${index}`;
    if (!game || typeof game !== 'object' || Array.isArray(game)) {
      report.exactError('manifest entry', ref, 'object', typeof game);
      return;
    }
    if (typeof game.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(game.slug)) {
      report.exactError('manifest slug', ref, 'lowercase-kebab-slug', JSON.stringify(game.slug));
    } else if (canonical.has(game.slug)) {
      report.exactError('duplicate slug', game.slug, 'unique', `also index:${canonical.get(game.slug)}`);
    } else {
      canonical.set(game.slug, index);
    }
    if (typeof game.title !== 'string' || !game.title.trim()) {
      report.exactError('manifest title', ref, 'non-empty string', JSON.stringify(game.title));
    }
    if (typeof game.era !== 'string' || !game.era.trim()) {
      report.exactError('manifest era', ref, 'non-empty string', JSON.stringify(game.era));
    }
    if (!STATUSES.has(game.status)) {
      report.exactError('manifest status', ref, [...STATUSES].join('|'), String(game.status));
    }
    if (!SAVE_LEVELS.has(game.save)) {
      report.exactError('manifest SAVE', ref, [...SAVE_LEVELS].join('|'), String(game.save));
    }
    if (!DASH_LEVELS.has(game.dashboard)) {
      report.exactError('manifest DASH', ref, [...DASH_LEVELS].join('|'), String(game.dashboard));
    }
    if ((game.dashboard === 'A' || game.dashboard === 'B') && game.save === 'none') {
      report.exactError('SAVE/DASH contract', ref, 'A/B requires saved results', 'save=none');
    }
    if (game.dashboard === 'C' && game.renderer !== null && game.renderer !== 'generic') {
      report.exactError('renderer contract', ref, 'C renderer null|generic', String(game.renderer));
    }
    if ((game.dashboard === 'A' || game.dashboard === 'B') &&
        (typeof game.renderer !== 'string' || !game.renderer.trim())) {
      report.exactError('renderer contract', ref, 'non-empty renderer for A/B', String(game.renderer));
    }
    if (!Array.isArray(game.aliases)) {
      report.exactError('manifest aliases', ref, 'array', typeof game.aliases);
    } else {
      for (const alias of game.aliases) {
        if (typeof alias !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(alias)) {
          report.exactError('manifest alias', ref, 'lowercase-kebab-slug', JSON.stringify(alias));
          continue;
        }
        if (aliasOwners.has(alias)) {
          report.exactError('duplicate alias', alias, 'unique', `${aliasOwners.get(alias)} and ${ref}`);
        } else {
          aliasOwners.set(alias, ref);
        }
      }
    }
  });

  for (const [alias, owner] of aliasOwners) {
    if (canonical.has(alias)) {
      report.exactError('alias collision', alias, 'not a canonical slug', `canonical index:${canonical.get(alias)} owner=${owner}`);
    }
  }

  report.counts.manifest = games.length;
  report.counts.published = games.filter(game => game.status === 'published').length;
  report.counts.A = games.filter(game => game.dashboard === 'A').length;
  report.counts.B = games.filter(game => game.dashboard === 'B').length;
  report.counts.C = games.filter(game => game.dashboard === 'C').length;
  report.counts.aliases = [...aliasOwners].length;
  if (report.errorCount() === before) report.pass('manifest schema and enums');
  return games;
}

async function discoverFilesystemGames() {
  const entries = await fs.readdir(ROOT, { withFileTypes: true });
  const slugs = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || NON_GAME_DIRECTORIES.has(entry.name)) continue;
    if (await exists(path.join(ROOT, entry.name, 'index.html'))) slugs.push(entry.name);
  }
  return slugs.sort((a, b) => a.localeCompare(b, 'en'));
}

function extractGameIds(source) {
  const patterns = [
    /\bgame_id\s*:\s*['"]([^'"]+)['"]/g,
    /\bgame\s*:\s*['"]([^'"]+)['"]/g,
    /['"]game['"]\s*:\s*['"]([^'"]+)['"]/g,
    /\bGAME_ID\s*=\s*['"]([^'"]+)['"]/g,
    /\bgameId\s*=\s*['"]([^'"]+)['"]/g,
  ];
  const ids = new Set();
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) ids.add(match[1]);
  }
  return ids;
}

function extractLiteralAssetRefs(source) {
  const refs = new Set();
  const pattern = /['"`]((?:\.{0,2}\/)?(?:assets|shared)\/[^'"`\s<>]+\.(?:css|js|mjs|png|jpe?g|gif|webp|svg|woff2?)(?:\?[^'"`]*)?)['"`]/gi;
  for (const match of source.matchAll(pattern)) refs.add(match[1]);
  return refs;
}

async function auditFilesystem(games, report) {
  const before = report.errorCount();
  const filesystem = await discoverFilesystemGames();
  report.counts.filesystem = filesystem.length;
  const manifestBySlug = new Map(games.map(game => [game.slug, game]));
  const filesystemSet = new Set(filesystem);

  for (const slug of filesystem) {
    if (!manifestBySlug.has(slug)) report.exactError('manifest missing game', slug, 'manifest entry', 'missing');
  }
  for (const game of games) {
    const hasFolder = filesystemSet.has(game.slug);
    if (FOLDER_REQUIRED.has(game.status) && !hasFolder) {
      report.exactError('game folder', game.slug, `${game.status} index.html`, 'missing');
    }
    if (game.status === 'published' && !hasFolder) {
      report.exactError('published folder', game.slug, 'index.html', 'missing');
    }
    if (!hasFolder) continue;

    const source = await fs.readFile(path.join(ROOT, game.slug, 'index.html'), 'utf8');
    const ids = extractGameIds(source);
    if (!ids.has(game.slug)) {
      report.exactError('canonical identity', game.slug, `declared game=${game.slug}`, ids.size ? [...ids].join(',') : 'not-detected');
    }
    if (/service[_-]?role/i.test(source)) {
      report.exactError('client credential', game.slug, 'no service-role marker', 'marker-detected');
    }

    for (const assetRef of extractLiteralAssetRefs(source)) {
      const relative = decodeURIComponent(assetRef.split(/[?#]/, 1)[0]);
      const target = path.resolve(ROOT, game.slug, relative);
      const insideRoot = target === ROOT || target.startsWith(`${ROOT}${path.sep}`);
      if (!insideRoot || !(await exists(target))) {
        report.exactError('local asset', game.slug, `existing:${assetRef}`, insideRoot ? 'missing' : 'outside-repository');
      }
    }

    const saveMarkers = {
      table: /game_results/i.test(source),
      post: /method\s*:\s*['"]POST['"]/i.test(source),
      choices: /\bchoices\b/i.test(source),
      classParam: /URLSearchParams|searchParams/i.test(source) && /['"]class['"]/i.test(source),
      timestamp: /timestamp|created_at|toISOString/i.test(source),
    };
    const missing = Object.entries(saveMarkers).filter(([, present]) => !present).map(([name]) => name);
    if (game.save === 'required' && missing.length) {
      report.exactError('SAVE contract', game.slug, 'game_results POST with choices/class/timestamp', `missing:${missing.join(',')}`);
    } else if (game.save === 'optional' && missing.length === Object.keys(saveMarkers).length) {
      report.warn('optional SAVE not detected', `slug=${game.slug}`);
    }
  }

  if (report.errorCount() === before) report.pass('filesystem ↔ manifest');
  if (report.errorCount() === before) report.pass('canonical identities and SAVE contracts');
  return filesystem;
}

function parseAttributes(tag) {
  const attributes = new Map();
  const pattern = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  for (const match of tag.matchAll(pattern)) {
    attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attributes;
}

function extractConstObject(source, constName) {
  const declaration = new RegExp(`\\bconst\\s+${constName}(?:\\s*:[^=]+)?\\s*=\\s*\\{`).exec(source);
  if (!declaration) return '';
  const start = source.indexOf('{', declaration.index);
  let depth = 0;
  let quote = '';
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (char === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === '*' && next === '/') { blockComment = false; index += 1; }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '/' && next === '/') { lineComment = true; index += 1; continue; }
    if (char === '/' && next === '*') { blockComment = true; index += 1; continue; }
    if (char === '"' || char === "'" || char === '`') { quote = char; continue; }
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  return '';
}

function topLevelKeys(objectSource) {
  const keys = new Set();
  const pattern = /^  (?:'([^']+)'|"([^"]+)"|([A-Za-z0-9_-]+))\s*:/gm;
  for (const match of objectSource.matchAll(pattern)) keys.add(match[1] || match[2] || match[3]);
  return keys;
}

function stringMap(objectSource) {
  const pairs = new Map();
  const pattern = /^  (?:'([^']+)'|"([^"]+)"|([A-Za-z0-9_-]+))\s*:\s*['"]([^'"]+)['"]\s*,?$/gm;
  for (const match of objectSource.matchAll(pattern)) pairs.set(match[1] || match[2] || match[3], match[4]);
  return pairs;
}

async function auditHubRepo(games, hubRepoArg, report) {
  if (!hubRepoArg) {
    report.skip('cross-repo audit', 'provide --hub-repo <path> to check hub/dashboard');
    return;
  }
  const hubRepo = path.resolve(process.cwd(), hubRepoArg);
  const hubIndex = path.join(hubRepo, 'index.html');
  const hubDataPath = path.join(hubRepo, 'data', 'games.json');
  const dashboardIndex = path.join(hubRepo, 'dashboard', 'index.html');
  const edgeIndex = path.join(hubRepo, 'supabase', 'functions', 'dashboard-data', 'index.ts');
  const missingFiles = [];
  for (const file of [hubIndex, hubDataPath, dashboardIndex, edgeIndex]) if (!(await exists(file))) missingFiles.push(file);
  if (missingFiles.length) {
    report.error('cross-repo files', `expected=hub/dashboard sources actual=missing:${missingFiles.join(',')}`);
    return;
  }

  const beforeHub = report.errorCount();
  const [hubDataSource, dashboardSource, edgeSource] = await Promise.all([
    fs.readFile(hubDataPath, 'utf8'),
    fs.readFile(dashboardIndex, 'utf8'),
    fs.readFile(edgeIndex, 'utf8'),
  ]);
  let hubData;
  try {
    hubData = JSON.parse(hubDataSource.replace(/^\uFEFF/, ''));
  } catch (error) {
    report.error('hub data JSON', `${hubDataPath}: ${error.message}`);
    return;
  }
  if (!Array.isArray(hubData.games)) {
    report.error('hub data schema', 'expected=games array actual=missing-or-invalid');
    return;
  }

  const published = games.filter(game => game.status === 'published');
  const manifestBySlug = new Map(games.map(game => [game.slug, game]));
  const hubPublished = hubData.games.filter(game => game?.status === 'published');
  const hubSlugs = hubPublished.map(game => game.slug);
  const hubPaths = hubPublished.map(game => game.path);
  const duplicateSlugs = [...new Set(hubSlugs.filter((slug, index) => hubSlugs.indexOf(slug) !== index))];
  const duplicatePaths = [...new Set(hubPaths.filter((gamePath, index) => hubPaths.indexOf(gamePath) !== index))];
  if (duplicateSlugs.length) {
    report.error('hub data duplicate slugs', `expected=unique actual=${duplicateSlugs.join(',')}`);
  }
  if (duplicatePaths.length) {
    report.error('hub data duplicate paths', `expected=unique actual=${duplicatePaths.join(',')}`);
  }

  const canonicalIdentities = new Set(published.map(game => `${game.slug}\t/games/${game.slug}/`));
  const hubIdentities = new Set(hubPublished.map(game => `${game.slug}\t${game.path}`));
  const missingIdentities = [...canonicalIdentities].filter(identity => !hubIdentities.has(identity));
  const extraIdentities = [...hubIdentities].filter(identity => !canonicalIdentities.has(identity));
  const formatIdentity = identity => identity.replace('\t', ' path=');
  if (missingIdentities.length || extraIdentities.length) {
    report.error(
      'published hub data set',
      `missing=${missingIdentities.map(formatIdentity).join(',') || 'none'} extra=${extraIdentities.map(formatIdentity).join(',') || 'none'}`,
    );
  } else {
    report.pass('published hub data set', `canonical=${published.length} hub=${hubPublished.length} missing=0 extra=0`);
  }

  const hubPublishedBySlug = new Map(hubPublished.map(game => [game.slug, game]));
  const titleMismatches = published.filter(game => (
    hubPublishedBySlug.has(game.slug) && hubPublishedBySlug.get(game.slug).title !== game.title
  ));
  for (const game of titleMismatches) {
    report.exactError('hub data title', game.slug, game.title, hubPublishedBySlug.get(game.slug).title);
  }
  if (!titleMismatches.length) report.pass('canonical hub titles', `${published.length} matched`);
  if (report.errorCount() === beforeHub) report.pass('published hub data contract', `${hubPublished.length} games`);

  const beforeDashboard = report.errorCount();
  const canonicalLabels = stringMap(extractConstObject(dashboardSource, 'CANONICAL_GAME_LABELS'));
  const labelKeys = new Set(canonicalLabels.keys());
  const rendererKeys = topLevelKeys(extractConstObject(dashboardSource, 'CUSTOM_RENDERERS'));
  const clientAliases = stringMap(extractConstObject(dashboardSource, 'GAME_ID_ALIASES'));
  const edgeAliases = stringMap(extractConstObject(edgeSource, 'GAME_ID_ALIASES'));

  for (const game of published.filter(game => game.dashboard === 'A' || game.dashboard === 'B')) {
    if (!labelKeys.has(game.slug)) report.exactError('dashboard mapping', game.slug, 'canonical label', 'missing');
    else if (canonicalLabels.get(game.slug) !== game.title) {
      report.exactError('dashboard title', game.slug, game.title, canonicalLabels.get(game.slug));
    }
    if (game.renderer !== 'generic' && !rendererKeys.has(game.slug)) {
      report.exactError('dashboard renderer', game.slug, game.renderer, 'missing');
    }
    if (game.renderer === 'generic' && rendererKeys.has(game.slug)) {
      report.exactError('dashboard renderer', game.slug, 'manifest custom renderer', 'dashboard-only custom renderer');
    }
  }
  for (const slug of labelKeys) {
    if (!manifestBySlug.has(slug)) report.exactError('dashboard ghost mapping', slug, 'manifest game', 'missing');
  }
  for (const slug of rendererKeys) {
    if (!manifestBySlug.has(slug)) report.exactError('dashboard ghost renderer', slug, 'manifest game', 'missing');
  }

  const expectedAliases = new Map();
  for (const game of games) {
    for (const alias of game.aliases || []) {
      expectedAliases.set(alias, game.slug);
      if (clientAliases.get(alias) !== game.slug) {
        report.exactError('client legacy alias', alias, game.slug, clientAliases.get(alias) || 'missing');
      }
      if (edgeAliases.get(alias) !== game.slug) {
        report.exactError('edge legacy alias', alias, game.slug, edgeAliases.get(alias) || 'missing');
      }
    }
  }
  for (const [alias, target] of clientAliases) {
    if (expectedAliases.get(alias) !== target) {
      report.exactError('client unregistered alias', alias, expectedAliases.get(alias) || 'not registered', target);
    }
  }
  for (const [alias, target] of edgeAliases) {
    if (expectedAliases.get(alias) !== target) {
      report.exactError('edge unregistered alias', alias, expectedAliases.get(alias) || 'not registered', target);
    }
  }
  if (report.errorCount() === beforeDashboard) {
    report.pass('dashboard canonical mapping');
    report.pass('custom renderer mapping');
    report.pass('legacy aliases');
  }
}

function extractSameOriginResources(pageUrl, html) {
  const rawRefs = [];
  const tagPatterns = [
    [/<script\b[^>]*>/gi, 'src'],
    [/<link\b[^>]*>/gi, 'href'],
    [/<img\b[^>]*>/gi, 'src'],
    [/<source\b[^>]*>/gi, 'src'],
    [/<video\b[^>]*>/gi, 'poster'],
  ];
  for (const [pattern, attribute] of tagPatterns) {
    for (const match of html.matchAll(pattern)) {
      const value = parseAttributes(match[0]).get(attribute);
      if (value) rawRefs.push(value);
    }
  }
  const cssSource = html.replace(/url\(\s*(['"])data:[\s\S]*?\1\s*\)/gi, 'url(data:)');
  for (const match of cssSource.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/gi)) rawRefs.push(match[1]);
  for (const ref of extractLiteralAssetRefs(html)) rawRefs.push(ref);

  const urls = new Set();
  for (const ref of rawRefs) {
    const normalizedRef = ref.replace(/^\\+/, '');
    if (!normalizedRef || /^(?:#|data:|javascript:|mailto:|tel:)/i.test(normalizedRef) || /[${}]/.test(normalizedRef)) continue;
    try {
      const url = new URL(normalizedRef, pageUrl);
      if (url.origin === PUBLIC_ORIGIN) {
        url.hash = '';
        urls.add(url.href);
      }
    } catch {
      // Invalid optional refs are covered by browser testing; do not create a false positive here.
    }
  }
  return urls;
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      cache: 'no-store',
      headers: { 'User-Agent': 'gtmc-history-game-audit/1.0', Accept: 'text/html,*/*' },
      signal: controller.signal,
    });
    const text = await response.text();
    return { ok: response.ok, status: response.status, finalUrl: response.url, text };
  } catch (error) {
    return { ok: false, status: 0, finalUrl: url, text: '', error: error.message };
  } finally {
    clearTimeout(timeout);
  }
}

function extractSupabasePublicConfig(source) {
  const url = source.match(/https:\/\/[a-z0-9]+\.supabase\.co/i)?.[0] || '';
  const key = source.match(/\bsb_publishable_[A-Za-z0-9_-]+\b/)?.[0]
    || source.match(/\beyJ[A-Za-z0-9._-]+\b/)?.[0]
    || '';
  return { url, key };
}

async function fetchJson(url, headers = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      cache: 'no-store',
      headers: { 'User-Agent': 'gtmc-history-game-audit/1.0', Accept: 'application/json', ...headers },
      signal: controller.signal,
    });
    const text = await response.text();
    let data = null;
    try { data = JSON.parse(text); } catch { /* Report the HTTP/body shape below. */ }
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    return { ok: false, status: 0, data: null, error: error.message };
  } finally {
    clearTimeout(timeout);
  }
}

async function mapLimit(values, limit, worker) {
  const results = new Array(values.length);
  let next = 0;
  async function run() {
    while (next < values.length) {
      const index = next;
      next += 1;
      results[index] = await worker(values[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, () => run()));
  return results;
}

async function auditProduction(games, report) {
  const published = games.filter(game => game.status === 'published');
  const beforePages = report.errorCount();
  const pageResults = await mapLimit(published, 6, async game => {
    const url = `${PUBLIC_ORIGIN}/games/${encodeURIComponent(game.slug)}/`;
    return { game, url, result: await fetchText(url) };
  });
  const resources = new Set();
  for (const { game, url, result } of pageResults) {
    if (!result.ok || result.status !== 200) {
      report.exactError('production page', game.slug, 'HTTP 200', result.error || `HTTP ${result.status}`);
      continue;
    }
    for (const resource of extractSameOriginResources(url, result.text)) resources.add(resource);
  }
  if (report.errorCount() === beforePages) report.pass('production Pages HTTP', `${published.length}/${published.length}`);

  const beforeResources = report.errorCount();
  const resourceResults = await mapLimit([...resources], 8, async url => ({ url, result: await fetchText(url) }));
  for (const { url, result } of resourceResults) {
    if (!result.ok) report.error('production resource', `expected=HTTP 2xx actual=${result.error || `HTTP ${result.status}`} url=${url}`);
  }
  if (report.errorCount() === beforeResources) report.pass('production same-origin resources', `${resources.size} checked`);

  const beforeMetadata = report.errorCount();
  const configs = pageResults
    .filter(({ result }) => result.ok)
    .map(({ result }) => extractSupabasePublicConfig(result.text))
    .filter(config => config.url && config.key);
  const config = configs[0];
  if (!config) {
    report.error('production game_meta coverage', 'expected=public Supabase config actual=not detected');
    return;
  }

  const metaResult = await fetchJson(
    `${config.url}/rest/v1/game_meta?select=game_id,label,era&order=game_id.asc`,
    { apikey: config.key },
  );
  if (!metaResult.ok || !Array.isArray(metaResult.data)) {
    report.error(
      'production game_meta coverage',
      `expected=HTTP 200 JSON array actual=${metaResult.error || `HTTP ${metaResult.status}`}`,
    );
    return;
  }

  const targetGames = published.filter(game => game.dashboard === 'A' || game.dashboard === 'B');
  const targetById = new Map(targetGames.map(game => [game.slug, game]));
  const aliasIds = new Set(games.flatMap(game => game.aliases || []));
  const metaIds = metaResult.data.map(row => row?.game_id).filter(Boolean);
  const metaIdSet = new Set(metaIds);
  const duplicates = [...new Set(metaIds.filter((id, index) => metaIds.indexOf(id) !== index))];
  const missing = [...targetById.keys()].filter(id => !metaIdSet.has(id));
  const orphan = [...metaIdSet].filter(id => !targetById.has(id) && !aliasIds.has(id));
  const legacyAliases = [...metaIdSet].filter(id => aliasIds.has(id));

  if (duplicates.length) report.error('production game_meta duplicate IDs', `expected=unique actual=${duplicates.join(',')}`);
  if (missing.length || orphan.length) {
    report.error(
      'production game_meta set',
      `missing=${missing.join(',') || 'none'} orphan=${orphan.join(',') || 'none'}`,
    );
  }
  if (report.errorCount() === beforeMetadata) {
    report.pass(
      'production game_meta coverage',
      `dashboard=${targetGames.length} canonical=${targetGames.length - missing.length} rows=${metaIds.length} missing=0 orphan=0 legacy-aliases=${legacyAliases.length}`,
    );
  }
}

async function main() {
  const report = new AuditReport();
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    usage();
    process.exitCode = 1;
    return;
  }
  if (options.help) {
    usage();
    return;
  }

  await auditOperationsStructure(report);
  const manifest = await loadManifest(report);
  const games = validateManifest(manifest, report);
  if (manifest) await auditFilesystem(games, report);
  await auditHubRepo(games, options.hubRepo, report);
  if (options.production) await auditProduction(games, report);
  else report.skip('production HTTP', 'enable with --production; CI intentionally uses deterministic local checks');

  report.print();
  if (report.errorCount()) process.exitCode = 1;
}

main().catch(error => {
  console.error(`ERROR audit crashed — ${error.stack || error.message}`);
  process.exitCode = 1;
});
