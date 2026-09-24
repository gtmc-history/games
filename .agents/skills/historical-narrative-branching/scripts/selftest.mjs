#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const validator = path.join(here, 'validate-branch-graph.mjs');
const fixtures = [
  ['valid.json', 0],
  ['trap-cycle.json', 1],
  ['trap-duplicate-choice.json', 1],
  ['trap-unreachable-evidence.json', 1],
  ['trap-softlock-hidden.json', 1],
  ['trap-schema-typo.json', 1],
  ['trap-ungated-ending.json', 1],
  ['valid-single.html', 0],
  ['trap-wrong-type-evidence.json', 1],
  ['trap-wrong-location-node.json', 1],
  ['trap-wrong-location-choice.json', 1],
  ['trap-wrong-location-effects.json', 1],
  ['trap-duplicate-evidence-catalog.json', 1],
  ['trap-html-wrong-script-type.html', 2],
  ['cond-unknown-choice-key.json', 3],
  ['cond-requires-flag.json', 3],
  ['cond-unknown-effect.json', 3],
];

let failed = false;
for (const [name, expected] of fixtures) {
  const p = path.join(here, 'fixtures', name);
  const r = spawnSync(process.execPath, [validator, p], { encoding: 'utf8' });
  const actual = r.status ?? 2;
  const ok = actual === expected;
  console.log(`${ok ? 'PASS' : 'FAIL'} selftest ${name}: expected ${expected}, got ${actual}`);
  if (!ok) {
    failed = true;
    process.stdout.write(r.stdout || '');
    process.stderr.write(r.stderr || '');
  }
}
process.exit(failed ? 1 : 0);
