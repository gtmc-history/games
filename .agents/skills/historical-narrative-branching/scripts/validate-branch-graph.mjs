#!/usr/bin/env node
import fs from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node validate-branch-graph.mjs <game.json|index.html>\nExit: 0 PASS, 1 FAIL, 2 input error, 3 CONDITIONAL PASS');
  process.exit(2);
}

const problems = [];
const warnings = [];
let manualRequired = false;

let data;
try {
  let raw = fs.readFileSync(file, 'utf8');
  if (/\.html?$/i.test(file)) {
    const blocks = [...raw.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
    const block = blocks.find(m => /\bid\s*=\s*["']branch-data["']/i.test(m[1]));
    if (!block) {
      console.error('No <script type="application/json" id="branch-data"> block found in HTML.');
      process.exit(2);
    }
    if (!/\btype\s*=\s*["']application\/json["']/i.test(block[1])) {
      console.error('branch-data script must declare type="application/json".');
      process.exit(2);
    }
    raw = block[2];
  }
  data = JSON.parse(raw);
} catch (err) {
  console.error(`JSON read/parse failed: ${err.message}`);
  process.exit(2);
}

if (!data || typeof data !== 'object' || Array.isArray(data)) {
  console.error('Top-level branch data must be a JSON object.');
  process.exit(2);
}

const isNonEmptyString = v => typeof v === 'string' && v.trim().length > 0;
const uniq = arr => [...new Set(arr)];

function evidenceArray(obj, key, where) {
  if (!(key in (obj ?? {}))) return [];
  const v = obj[key];
  if (!Array.isArray(v)) {
    problems.push(`${where}.${key} must be an array of non-empty strings`);
    return [];
  }
  const out = [];
  const seen = new Set();
  for (let i = 0; i < v.length; i++) {
    const item = v[i];
    if (!isNonEmptyString(item)) {
      problems.push(`${where}.${key}[${i}] must be a non-empty string`);
      continue;
    }
    if (seen.has(item)) problems.push(`Duplicate evidence id in ${where}.${key}: ${item}`);
    seen.add(item);
    out.push(item);
  }
  return out;
}

const CONDITION_KEYS = new Set(['condition', 'conditions', 'requiresFlag', 'requiresFlags']);
// Choice keys the validator fully understands. Any other key on a choice MAY gate or alter flow
// (showIf, locked, visibleWhen, ...), so it downgrades the verdict to CONDITIONAL PASS.
const KNOWN_CHOICE_KEYS = new Set(['id', 'label', 'text', 'targetId', 'effects', 'requiresEvidence',
  'feedback', 'note', 'teacherNote', 'hint', 'tags', 'description', 'icon', 'style', 'condition', 'conditions',
  'requiresFlag', 'requiresFlags']);
const KNOWN_EFFECT_KEYS = new Set(['addEvidence', 'removeEvidence']);
const KNOWN_EVIDENCE_KEYS = new Set(['requiresEvidence', 'grantEvidence', 'addEvidence', 'removeEvidence']);
function validateEvidenceKeys(obj, allowed, where) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return;
  for (const k of Object.keys(obj)) {
    if (KNOWN_EVIDENCE_KEYS.has(k) && !allowed.has(k)) {
      problems.push(`Evidence key "${k}" is not supported at ${where}`);
      continue;
    }
    if (CONDITION_KEYS.has(k)) continue; // handled as CONDITIONAL, not FAIL
    if (!KNOWN_EVIDENCE_KEYS.has(k) && /evid|require|grant|gate/i.test(k)) {
      // Permit ordinary evidence metadata only where explicitly part of the schema.
      if (where === 'root' && k === 'evidence') continue;
      problems.push(`Unsupported evidence-like key "${k}" at ${where} (typo or unsupported schema key)`);
    }
  }
}

if (!Array.isArray(data.nodes)) problems.push('Top-level nodes must be an array');
if (!Array.isArray(data.endings)) problems.push('Top-level endings must be an array');
if (!isNonEmptyString(data.startNodeId)) problems.push('startNodeId must be a non-empty string');
validateEvidenceKeys(data, new Set(), 'root');

const nodes = Array.isArray(data.nodes) ? data.nodes : [];
const endings = Array.isArray(data.endings) ? data.endings : [];
const start = data.startNodeId;
const all = new Map();
const nodeMap = new Map();
const endingMap = new Map();
const choiceIds = new Map();

for (const node of nodes) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    problems.push('Node entry must be an object');
    continue;
  }
  if (!isNonEmptyString(node.id)) {
    problems.push('Node without valid string id');
    continue;
  }
  if (all.has(node.id)) problems.push(`Duplicate node/ending id: ${node.id}`);
  all.set(node.id, node);
  nodeMap.set(node.id, node);
}
for (const ending of endings) {
  if (!ending || typeof ending !== 'object' || Array.isArray(ending)) {
    problems.push('Ending entry must be an object');
    continue;
  }
  if (!isNonEmptyString(ending.id)) {
    problems.push('Ending without valid string id');
    continue;
  }
  if (all.has(ending.id)) problems.push(`Duplicate node/ending id: ${ending.id}`);
  all.set(ending.id, ending);
  endingMap.set(ending.id, ending);
}

if (!start || !nodeMap.has(start)) problems.push(`Invalid startNodeId: ${String(start)}`);

// Optional evidence catalog: strings or {id}. Duplicate/invalid ids are errors.
const declaredEvidence = new Set();
if ('evidence' in data) {
  if (!Array.isArray(data.evidence)) {
    problems.push('root.evidence must be an array when provided');
  } else {
    data.evidence.forEach((e, i) => {
      const id = typeof e === 'string' ? e : e?.id;
      if (!isNonEmptyString(id)) {
        problems.push(`root.evidence[${i}] must be a non-empty string or object with non-empty id`);
        return;
      }
      if (declaredEvidence.has(id)) problems.push(`Duplicate declared evidence id: ${id}`);
      declaredEvidence.add(id);
    });
  }
}
const referencedEvidence = new Set();

const graph = new Map();
for (const node of nodes) {
  if (!isNonEmptyString(node?.id)) continue;
  validateEvidenceKeys(node, new Set(['grantEvidence']), `node ${node.id}`);
  const nodeGrant = evidenceArray(node, 'grantEvidence', `node ${node.id}`);
  nodeGrant.forEach(ev => referencedEvidence.add(ev));

  if (!Array.isArray(node.choices)) {
    problems.push(`node ${node.id}.choices must be an array`);
  }
  const choices = Array.isArray(node.choices) ? node.choices : [];
  graph.set(node.id, []);

  if (choices.length === 0) problems.push(`Non-ending node has no choices: ${node.id}`);
  if (choices.length > 4) warnings.push(`Node has >4 choices: ${node.id}`);

  for (const c of choices) {
    if (!c || typeof c !== 'object' || Array.isArray(c)) {
      problems.push(`Choice entry in node ${node.id} must be an object`);
      continue;
    }
    validateEvidenceKeys(c, new Set(['requiresEvidence']), `choice ${node.id}/${c.id ?? '?'}`);
    const req = evidenceArray(c, 'requiresEvidence', `choice ${node.id}/${c.id ?? '?'}`);
    req.forEach(ev => referencedEvidence.add(ev));
    const unknownChoiceKeys = Object.keys(c).filter(k => !KNOWN_CHOICE_KEYS.has(k) && !/evid|require|grant|gate/i.test(k));
    if (unknownChoiceKeys.length) {
      manualRequired = true;
      warnings.push(`Unrecognized choice key(s) on ${node.id}/${c.id ?? '?'}: ${unknownChoiceKeys.join(', ')}; may gate flow, manual path test required`);
    }
    if (c.effects && typeof c.effects === 'object' && !Array.isArray(c.effects)) {
      const unknownEffects = Object.keys(c.effects).filter(k => !KNOWN_EFFECT_KEYS.has(k) && !/evid|require|grant|gate/i.test(k));
      if (unknownEffects.length) {
        manualRequired = true;
        warnings.push(`Unrecognized effect(s) on ${node.id}/${c.id ?? '?'}: ${unknownEffects.join(', ')}; state not modeled, manual path test required`);
      }
    }

    if (!isNonEmptyString(c.id)) {
      problems.push(`Choice without valid string id in node: ${node.id}`);
    } else if (choiceIds.has(c.id)) {
      problems.push(`Duplicate choice id: ${c.id} (${choiceIds.get(c.id)} and ${node.id})`);
    } else {
      choiceIds.set(c.id, node.id);
    }

    if (!isNonEmptyString(c.targetId) || !all.has(c.targetId)) {
      problems.push(`Broken target from ${node.id}/${c?.id ?? '?'} -> ${String(c?.targetId)}`);
    } else {
      graph.get(node.id).push(c.targetId);
    }

    if ('effects' in c && (!c.effects || typeof c.effects !== 'object' || Array.isArray(c.effects))) {
      problems.push(`choice ${node.id}/${c.id ?? '?'}.effects must be an object when provided`);
    }
    const effects = c?.effects && typeof c.effects === 'object' && !Array.isArray(c.effects) ? c.effects : {};
    validateEvidenceKeys(effects, new Set(['addEvidence', 'removeEvidence']), `choice ${node.id}/${c.id ?? '?'}.effects`);
    evidenceArray(effects, 'addEvidence', `choice ${node.id}/${c.id ?? '?'}.effects`).forEach(ev => referencedEvidence.add(ev));
    evidenceArray(effects, 'removeEvidence', `choice ${node.id}/${c.id ?? '?'}.effects`).forEach(ev => referencedEvidence.add(ev));

    if (c.condition || c.conditions || c.requiresFlag || c.requiresFlags) {
      warnings.push(`Unsupported custom condition on ${node.id}/${c?.id ?? '?'}; manual path test required`);
      manualRequired = true;
    }
  }
}
for (const ending of endings) {
  if (!isNonEmptyString(ending?.id)) continue;
  validateEvidenceKeys(ending, new Set(['requiresEvidence']), `ending ${ending.id}`);
  evidenceArray(ending, 'requiresEvidence', `ending ${ending.id}`).forEach(ev => referencedEvidence.add(ev));
  if (ending.condition || ending.conditions || ending.requiresFlag || ending.requiresFlags) {
    warnings.push(`Unsupported custom condition on ending ${ending.id}; manual path test required`);
    manualRequired = true;
  }
}

if (declaredEvidence.size) {
  for (const ev of referencedEvidence) {
    if (!declaredEvidence.has(ev)) problems.push(`Referenced evidence is not declared: ${ev}`);
  }
  for (const ev of declaredEvidence) {
    if (!referencedEvidence.has(ev)) warnings.push(`Declared evidence is never granted or required: ${ev}`);
  }
}

// Static reachability ignoring conditions.
const reachable = new Set();
if (start && nodeMap.has(start)) {
  const queue = [start];
  while (queue.length) {
    const id = queue.shift();
    if (reachable.has(id)) continue;
    reachable.add(id);
    for (const target of graph.get(id) ?? []) if (!reachable.has(target)) queue.push(target);
  }
}
for (const id of all.keys()) if (!reachable.has(id)) warnings.push(`Unreachable: ${id}`);

// Reverse reachability: every reachable node should have some graph route to an ending.
const reverse = new Map();
for (const id of all.keys()) reverse.set(id, []);
for (const [from, targets] of graph.entries()) {
  for (const to of targets) reverse.get(to)?.push(from);
}
const canReachEnding = new Set(endings.map(e => e.id));
const rq = [...canReachEnding];
while (rq.length) {
  const id = rq.shift();
  for (const prev of reverse.get(id) ?? []) {
    if (!canReachEnding.has(prev)) {
      canReachEnding.add(prev);
      rq.push(prev);
    }
  }
}
for (const node of nodes) {
  if (reachable.has(node.id) && !canReachEnding.has(node.id)) {
    problems.push(`Reachable node cannot reach any ending (dead end or infinite loop): ${node.id}`);
  }
}

// Evidence-aware state exploration for the supported schema.
const MAX_STATES = 20000;
const seenStates = new Set();
const reachableEndingsWithEvidence = new Set();
const possibleEvidence = new Set();
const stateKey = (id, evidence) => `${id}|${[...evidence].sort().join(',')}`;
const hasAll = (set, req) => req.every(x => set.has(x));

if (start && nodeMap.has(start)) {
  const q = [{ id: start, evidence: new Set(), path: [start] }];
  const fmt = (st, ev) => `${st.path.join(' -> ')} [evidence: ${[...ev].sort().join(', ') || 'none'}]`;
  let overflow = false;

  while (q.length) {
    if (seenStates.size >= MAX_STATES) {
      overflow = true;
      warnings.push(`State exploration stopped at ${MAX_STATES} states; manual test required`);
      manualRequired = true;
      break;
    }

    const current = q.shift();
    const item = all.get(current.id);
    if (!item) continue;

    const evidence = new Set(current.evidence);
    if (nodeMap.has(current.id)) {
      for (const ev of evidenceArray(item, 'grantEvidence', `node ${current.id}`)) {
        evidence.add(ev);
        possibleEvidence.add(ev);
      }
    }

    const key = stateKey(current.id, evidence);
    if (seenStates.has(key)) continue;
    seenStates.add(key);

    if (endingMap.has(current.id)) {
      const req = evidenceArray(item, 'requiresEvidence', `ending ${current.id}`);
      if (hasAll(evidence, req)) {
        reachableEndingsWithEvidence.add(current.id);
      } else {
        const missing = req.filter(x => !evidence.has(x));
        problems.push(`Ending entered without required evidence (${missing.join(', ')}): ${fmt(current, evidence)}`);
      }
      continue;
    }

    const choices = Array.isArray(item.choices) ? item.choices : [];
    const enabled = choices.filter(c => {
      if (!c || typeof c !== 'object' || Array.isArray(c)) return false;
      const req = evidenceArray(c, 'requiresEvidence', `choice ${current.id}/${c.id ?? '?'}`);
      return hasAll(evidence, req) && isNonEmptyString(c.targetId) && all.has(c.targetId);
    });
    if (choices.length && enabled.length === 0) {
      problems.push(`Soft lock (student stuck, every choice locked): ${fmt(current, evidence)}`);
    }
    for (const c of enabled) {
      const nextEvidence = new Set(evidence);
      const effects = c?.effects && typeof c.effects === 'object' && !Array.isArray(c.effects) ? c.effects : {};
      for (const ev of evidenceArray(effects, 'addEvidence', `choice ${current.id}/${c.id ?? '?'}.effects`)) {
        nextEvidence.add(ev);
        possibleEvidence.add(ev);
      }
      for (const ev of evidenceArray(effects, 'removeEvidence', `choice ${current.id}/${c.id ?? '?'}.effects`)) nextEvidence.delete(ev);
      q.push({ id: c.targetId, evidence: nextEvidence, path: [...current.path, `${c.id}:${c.targetId}`] });
    }
  }

  if (!overflow) {
    for (const ending of endings) {
      if (reachable.has(ending.id) && !reachableEndingsWithEvidence.has(ending.id)) {
        const req = evidenceArray(ending, 'requiresEvidence', `ending ${ending.id}`);
        const suffix = req.length ? `; requires evidence: ${req.join(', ')}` : '';
        problems.push(`Ending is graph-reachable but impossible under supported evidence conditions: ${ending.id}${suffix}`);
      }
    }
  }
}

for (const ending of endings) {
  for (const ev of evidenceArray(ending, 'requiresEvidence', `ending ${ending.id}`)) {
    if (!possibleEvidence.has(ev)) problems.push(`Required evidence for ending ${ending.id} is never obtainable: ${ev}`);
  }
}

const reachableEndings = endings.filter(e => reachable.has(e.id)).length;
if (endings.length && reachableEndings === 0) problems.push('No ending is reachable from startNodeId');
if (!endings.length) warnings.push('No endings declared');

console.log(`File: ${file}`);
console.log(`Nodes: ${nodes.length}, endings: ${endings.length}, graph-reachable: ${reachable.size}, evidence-states: ${seenStates.size}`);

if (warnings.length) {
  console.log('\nWARNINGS');
  for (const w of uniq(warnings)) console.log(`- ${w}`);
}
if (problems.length) {
  console.log('\nFAIL');
  for (const p of uniq(problems)) console.log(`- ${p}`);
  process.exit(1);
}

if (manualRequired) {
  console.log('\nCONDITIONAL PASS: supported schema checks passed, but manual path tests are required for unsupported conditions/state space.');
  process.exit(3); // distinct from PASS(0) so agents/CI cannot read it as a clean pass
} else {
  console.log('\nPASS: branch graph is structurally valid for the supported schema.');
}
