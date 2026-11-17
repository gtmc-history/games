// democracy-1980 — DESIGN_LOCK v1.3 contract & regression checks (no browser needed).
// Runs the real inline script inside a Node vm with a minimal DOM stub, then drives the
// game through its own functions: S1 → A → B(+counterexample) → C-1 → C-2 → S5 → save.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../democracy-1980/index.html', import.meta.url), 'utf8');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];

const V12_ORDER_QUESTION = '계엄군의 발포와 시민군의 조직적인 무장 가운데, 어느 일이 먼저였을까요?';
const V12_ORDER_OPTIONS = [['fire_first','계엄군의 발포가 먼저'],['armed_first','시민군의 조직적인 무장이 먼저'],['unsure','아직 모르겠다']];
const AXIS_NAMES = ['시민 자치','봉쇄·피해','협상·항전·진압'];

// ---------- sandbox ----------
function makeEl(id) {
  return { id, textContent: '', innerHTML: '', className: '', value: '', onclick: null, oninput: null,
    dataset: {}, style: {}, offsetWidth: 1,
    classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } },
    querySelectorAll: () => [], appendChild(){}, remove(){}, click(){}, select(){} };
}
function makeGame({ search = '?class=1-1', storage = {}, fetchImpl, online = true } = {}) {
  const els = new Map();
  const store = new Map(Object.entries(storage));
  const posts = [];
  const ctx = {
    console, URLSearchParams, JSON, Math, Date, Promise, Object, Array, Number, String, Boolean, Set, Map, Error,
    location: { search },
    crypto: { randomUUID: () => 'aaaaaaaa-bbbb-4ccc-8ddd-' + String(Math.random()).slice(2, 14).padEnd(12, '0') },
    performance: { now: () => 0 },
    navigator: { onLine: online },
    localStorage: { getItem: k => store.has(k) ? store.get(k) : null, setItem: (k, v) => store.set(k, String(v)) },
    document: {
      hidden: false,
      getElementById: id => { if (!els.has(id)) els.set(id, makeEl(id)); return els.get(id); },
      querySelectorAll: () => [], addEventListener(){}, createElement: () => makeEl('tmp'),
      body: { appendChild(){} }, execCommand(){}
    },
    window: { addEventListener(){}, scrollTo(){} },
    Blob: class {}, URL: { createObjectURL: () => 'blob:x', revokeObjectURL(){} },
    setTimeout: () => 0,
    fetch: async (url, opts) => { posts.push({ url, opts }); return fetchImpl ? fetchImpl(posts.length, opts) : resp(201, ''); }
  };
  vm.createContext(ctx);
  vm.runInContext(code, ctx, { filename: 'democracy-1980-inline.js' });
  // Plain objects/arrays are copied into this realm so deepStrictEqual compares values, not prototypes.
  const run = src => { const v = vm.runInContext(src, ctx); return v && typeof v === 'object' && typeof v.then !== 'function' ? JSON.parse(JSON.stringify(v)) : v; };
  return { ctx, run, els, store, posts };
}
function resp(status, body) {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  return { ok: status >= 200 && status < 300, status, text: async () => text };
}

// Drive one full attempt through the game's own functions.
async function playThrough(g, { x1Detour = true, cxDenyFirst = true, cDecoy = true, text = '시민들은 봉쇄 속에서도 나눔과 질서를 지켰고 계엄군은 5·27 다시 진압했다.' } = {}) {
  const r = g.run;
  r(`state.pre='unsure';state.started_at=new Date().toISOString();setScene(2)`);
  r(`state.a.order=['A-E1','A-E2','A-E3'];state.a.excluded=['A-D1','A-D2'];state.a.links={0:'A-S1',1:'A-S2'};checkA()`);
  assert.equal(r('state.a.done'), true, 'A completes with 3 events, 2 exclusions, 2 evidence links');
  r(`setScene(3)`);
  r(`state.b.answers[0]={answer_id:'military_fired',source_id:'B-S2'};state.b.answers[1]={answer_id:'citizen_self_defense_armed',source_id:'B-S3'};state.b.answers[2].answer_id='censorship_0517'`);
  if (x1Detour) {
    r(`bActive=2;state.b.answers[2].source_id='B-X1';recordDecoy(state.b,'B-X1','B-B3')`);
    r(`checkB()`);
    assert.equal(r('state.b.textDone'), false, 'B-X1 on ③ must not complete B');
    assert.equal(r('renderMessage'), '이 자료도 검열 흔적을 보여 주지만 5·18 이후의 6월 자료예요. 5월 17일 방침을 찾아보세요.');
    r(`state.b.answers[2].source_id='B-S1';markDecoyCorrected(state.b,'B-B3')`);
  } else {
    r(`state.b.answers[2].source_id='B-S1'`);
  }
  r(`checkB()`);
  assert.equal(r('state.b.textDone'), true);
  assert.equal(r('state.b.done'), false, 'B is not final until the counterexample is answered');
  if (cxDenyFirst) {
    assert.equal(r(`renderB().includes('data-cx=')`), false, 'counterexample panel waits for V5');
    r(`dismissBeats(['V5'])`);
    r(`answerCounterexample('cx_deny')`);
    assert.equal(r('state.b.done'), false, 'cx_deny must require re-check');
    assert.match(r('renderMessage'), /^산발적인 탈취 사례는 있었지만 시민들의 본격적인 무장은 5월 21일 집단 발포 뒤에 이어졌어요\./);
  }
  r(`dismissBeats(['V5'])`);
  r(`answerCounterexample('cx_distinguish')`);
  assert.equal(r('state.b.done'), true);
  r(`setScene(4)`);
  // C-1: one wrong stamp first, then the four correct stamps.
  r(`cSource='C-G1a';stampC1('citizen_side')`);
  assert.equal(r(`state.c.stamps['C-G1a']`), undefined, 'wrong stamp is not fixed');
  for (const [id, st] of [['C-S1','power_claim'],['C-S2','citizen_side'],['C-S3','citizen_side'],['C-G1a','later_verified']]) {
    r(`cSource='${id}';stampC1('${st}')`);
  }
  r(`checkC1()`);
  assert.equal(r('state.cStage'), 2);
  if (cDecoy) {
    r(`cBoardSource='C-S2';linkAxis('citizen_self_government')`);
    assert.equal(r(`state.c.links.citizen_self_government`), undefined, 'C-S2 alone cannot prove an axis');
  }
  for (const [axis, sid] of [['citizen_self_government','C-G1a'],['military_blockade','C-G1b'],['negotiation_resistance_suppression','C-G1c']]) {
    r(`cBoardSource='${sid}';linkAxis('${axis}')`);
  }
  r(`state.c.lead_axis='citizen_self_government'`);
  g.run(`$('finalText')`);
  g.els.get('finalText').value = text;
  r(`checkC2()`);
  assert.equal(r('state.c.done'), true);
  r(`setScene(5)`);
  assert.equal(g.posts.length, 0, 'no POST before S5 completion');
  r(`state.post='fire_first';finish()`);
  await r('savingPromise||Promise.resolve()');
  await new Promise(res => setImmediate(res)); // let attemptSave's finally (persist/render) run
}

// ---------- 1. static contract ----------
const g0 = makeGame();
assert.equal(g0.run('CHOICES_VERSION'), '1.3.0');
assert.equal(g0.run('EVIDENCE_VERSION'), '1980-evidence-v1.3');
assert.equal(g0.run('LOCAL_VERSION'), 2);
assert.equal(g0.run('STORAGE_KEY'), 'democracy-1980-v1-draft');
assert.equal(g0.run('ORDER_QUESTION'), V12_ORDER_QUESTION, 'ORDER-01 wording unchanged');
assert.deepEqual(g0.run('ORDER_OPTIONS.map(o=>[o.id,o.label])'), V12_ORDER_OPTIONS, 'ORDER-01 options & order unchanged');
assert.ok(html.includes('>기록 복원 시작</button>'), 'S1 CTA unchanged');
assert.equal(g0.run('B_THIRD_SENTENCE'), '5월 17일 계엄 확대와 함께 내려진 보도 통제 방침을 보여 주는 문서는 [③]이다.');
assert.deepEqual(g0.run(`B_BLANKS[1].options.map(o=>[o.id,o.label])`),
  [['citizen_self_defense_armed','자위적 무장'],['premeditated_uprising','사전 계획된 무장 봉기'],['armed_from_0518','5·18 첫날부터 시작된 무장']]);
assert.ok(!html.includes('complete_disbandment') && !html.includes('전원 자진 해산'), 'old B-② distractor removed');
assert.deepEqual(g0.run('B_BLANKS.map(b=>[b.correct,b.source])'),
  [['military_fired','B-S2'],['citizen_self_defense_armed','B-S3'],['censorship_0517','B-S1']], 'B answers & evidence unchanged');
assert.deepEqual(g0.run('C1_SOURCE_IDS'), ['C-S1','C-S2','C-S3','C-G1a']);
assert.deepEqual(g0.run('C1_STAMPS.map(s=>s.id)'), ['power_claim','citizen_side','later_verified']);
assert.deepEqual(g0.run('C_AXES.map(a=>a.label)'), AXIS_NAMES, 'axis ③ keeps 진압');
assert.ok(g0.run(`SOURCES['B-X1'].title`).includes('1980.6.4.') && g0.run(`SOURCES['B-X1'].meta`).includes('2017.5.16.'));
assert.ok(g0.run(`SOURCES['B-X1'].url`).includes('AKR20170516162200054'));
assert.match(g0.run(`SOURCES['B-S2'].detail`), /19~20일.*산발적.*5월 21일 집단 발포 뒤/s, 'B-S2 distinguishes sporadic seizures from organized arming (H4)');
assert.equal(g0.run('PANEL_TEXT.actor_sequence'), '5월 18일부터 계엄군의 폭력적 진압이 있었고, 19일부터 계엄군이 발포했다. 시민들의 본격적 자위 무장은 21일 집단 발포 뒤였고, 이 과정은 보도 통제로 가려졌다.');
assert.equal(g0.run(`SOURCES['C-G1a'].meta`), '국가기록원 · 5·18 주제 해설 페이지');
assert.ok(g0.run(`SOURCES['C-S3'].meta`).startsWith('전남민주민족통일을 위한 국민연합 외'));
assert.ok(g0.run(`SOURCES['C-S3'].detail`).includes('전남민주청년 연합회') && g0.run(`SOURCES['C-S3'].detail`).includes('전남민주구국학생 총연맹'));

// ---------- 2. sensitive-content & spoiler checks ----------
assert.ok(!html.includes('hm_151_0010'), 'C-S2 full-text URL must not reach student screen');
assert.ok(!('url' in g0.run(`SOURCES['C-S2']`)), 'C-S2 has no student link');
for (const w of ['북한','간첩','외부 세력','폭동','폭도','위협사격']) assert.ok(!html.includes(w), 'forbidden term: ' + w);
assert.ok(!/\d+\s*시\s*\d+\s*분/.test(html), 'no minute-level timestamps on student screen');
const beats = g0.run('FRIEND_BEATS');
const stages = g0.run('FRIEND_STAGES');
assert.ok(Object.keys(beats).length <= 8, 'friend beats ≤ 8');
for (const [id, b] of Object.entries(beats)) {
  assert.ok(b.lines.length >= 1 && b.lines.length <= 2, id + ' ≤ 2 lines');
  for (const l of b.lines) assert.ok(l.length <= 40, id + ' line too long');
}
for (const id of ['V4','V7']) assert.ok(beats[id].tag && beats[id].check, id + ' misconception has a tag and same-cut correction');
assert.ok(g0.run('CX_CHECK').length > 0, 'V6 counterexample panel keeps its same-cut check');
assert.equal(Object.values(stages).flat().length, Object.keys(beats).length, 'each beat placed exactly once');
assert.equal(beats.V1.lines.join(' '), '여기 전학 와서 처음 맡은 일이 5월 기록 전시야. 금요일 개막이라 신문 스크랩을 보고 초안을 썼어.');
assert.equal(beats.V4.tag, '흔한 오해');

// A: identical label on all five cards, no 'distortion' badge before checking
g0.run(`setScene(2)`);
const aHtml = g0.run('renderA()');
assert.equal((aHtml.match(/학습용 재구성<\/small>/g) || []).length, 5, 'all 5 A cards carry the same label');
assert.ok(!aHtml.includes('왜곡'), 'no distortion badge/label before A is checked');
// C-1 cards: no answer labels before stamping
g0.run(`state.scene=4;state.cStage=1`);
const c1 = g0.run('c1Cards()');
for (const w of ['주장','입장','요구','후대']) assert.ok(!c1.includes(w), 'C-1 card markup leaks label word: ' + w);
g0.run(`state.c.opened.push(...C1_SOURCE_IDS)`);
const c1Open = g0.run('c1Cards()');
for (const w of ['주장','입장','요구','후대']) assert.ok(!c1Open.includes(w), 'C-1 opened detail leaks label word: ' + w);
// C-2 card titles never repeat axis names
for (const id of ['C-G1a','C-G1b','C-G1c']) for (const ax of AXIS_NAMES) assert.ok(!g0.run(`SOURCES['${id}'].title`).includes(ax), id + ' title reveals axis ' + ax);
assert.ok(!html.includes('visitor_question') && !html.includes('source_manifest_version') && !html.includes('claim_comparison'));

// ---------- 3. full playthrough + payload ----------
const g1 = makeGame();
await playThrough(g1);
assert.equal(g1.posts.length, 1, 'exactly one final POST');
const sent = JSON.parse(g1.posts[0].opts.body);
assert.equal(g1.posts[0].opts.headers.Prefer, 'return=minimal');
assert.deepEqual(Object.keys(sent).sort(), ['choices','class','comment','game','timestamp']);
assert.equal(sent.game, 'democracy-1980');
assert.equal(sent.class, '1-1');
assert.equal(sent.comment, '');
assert.equal(sent.choices.version, '1.3.0');
assert.equal(sent.choices.evidence_version, '1980-evidence-v1.3');
assert.deepEqual(sent.choices.pre_post, { before: 'unsure', after: 'fire_first' });
const [mA, mB, mC] = sent.choices.missions;
assert.deepEqual(mB.mechanic_output.counterexample_response, { first: 'cx_deny', final: 'cx_distinguish' });
assert.deepEqual(mB.mechanic_output.decoy_links, [{ source_id: 'B-X1', target_id: 'B-B3', corrected: true }]);
assert.equal(mB.wrong_attempts, 1, 'B-X1 check counted once');
assert.deepEqual(mC.mechanic_output.c1_stamps, { 'C-S1': 'power_claim', 'C-S2': 'citizen_side', 'C-S3': 'citizen_side', 'C-G1a': 'later_verified' });
assert.deepEqual(mC.mechanic_output.decoy_links, [{ source_id: 'C-S2', target_id: 'citizen_self_government', corrected: true }]);
assert.equal(mC.wrong_attempts, 2, 'one wrong stamp + one C-S2 misuse');
assert.equal(mC.accuracy_flags.source_stamps_correct, true);
assert.equal(mC.accuracy_flags.three_axes_supported, true);
assert.ok(!('claim_comparison' in mC.mechanic_output));
assert.equal(mA.accuracy_flags.evidence_supported, true);
assert.equal(g1.run('state.submissionStatus'), 'saved');
assert.equal(g1.run(`state.archive.actor_sequence`), g1.run('PANEL_TEXT.actor_sequence'));
const savedLocal = JSON.parse(g1.store.get('democracy-1980-v1-draft'));
assert.deepEqual(Object.keys(savedLocal).sort(), ['game','localVersion','resultId','savedAt','submissionStatus']);
assert.equal(savedLocal.localVersion, 2);

// decoy cap and 16KB CHECK, worst case
const g2 = makeGame();
g2.run(`for(let i=0;i<40;i++){recordDecoy(state.b,'B-X1','B-B'+(1+i%3));recordDecoy(state.c,'C-S2','military_blockade')}`);
assert.equal(g2.run('state.b.decoys.length'), 20);
assert.equal(g2.run('state.c.decoys.length'), 20);
g2.run(`state.a.wrong=state.b.wrong=state.c.wrong=999;state.a.opened=['A-S1','A-S2','A-S3'];state.b.opened=[...B_SOURCE_IDS];state.c.opened=['C-S1','C-S2','C-S3','C-G1a','C-G1b','C-G1c'];state.c.finalText='가'.repeat(500);state.duration={A:99999,B:99999,C:99999};state.started_at=state.completed_at=new Date().toISOString()`);
const worst = JSON.parse(g2.run('JSON.stringify(buildPayload())'));
assert.equal(worst.choices.final_reconstruction_text.length, 120);
const bytes = Buffer.byteLength(JSON.stringify(worst.choices), 'utf8');
assert.ok(bytes < 16 * 1024, 'choices JSON must stay below 16KB, got ' + bytes);

// ---------- 4. save response branches ----------
async function saveWith(fetchImpl, opts = {}) {
  const g = makeGame({ fetchImpl, ...opts });
  await playThrough(g, { x1Detour: false, cxDenyFirst: false, cDecoy: false });
  return g;
}
const rid = g => g.run('state.resultId');
let g = await saveWith(() => resp(201, ''));
assert.equal(g.run('state.submissionStatus'), 'saved');
g = await saveWith((n, o) => resp(409, { code: '23505', message: 'duplicate key value violates unique constraint', details: `Key ((choices ->> 'result_id'::text))=(${JSON.parse(o.body).choices.result_id}) already exists.` }));
assert.equal(g.run('state.submissionStatus'), 'saved', '409+23505 for the same result_id counts as saved');
assert.equal(g.run('state.savedByDuplicate'), true);
g = await saveWith(() => resp(409, { code: '23505', details: 'Key (id)=(other) already exists.' }));
assert.equal(g.run('state.submissionStatus'), 'unknown', '23505 without our result_id is unconfirmed');
g = await saveWith(() => resp(409, { code: '23503' }));
assert.equal(g.run('state.submissionStatus'), 'unknown', 'other 409 is unconfirmed');
g = await saveWith(() => resp(409, 'not json'));
assert.equal(g.run('state.submissionStatus'), 'unknown');
g = await saveWith(() => resp(400, { code: '23514', message: 'violates check constraint' }));
assert.equal(g.run('state.submissionStatus'), 'rejected', '400+23514 → TXT first, no retry loop');
g.run('void attemptSave()');
assert.equal(g.posts.length, 1, 'rejected record is not re-posted');
assert.ok(!g.run('renderRemote()').includes('retryButton'));
g = await saveWith(() => resp(400, { code: 'PGRST204' }));
assert.equal(g.run('state.submissionStatus'), 'unknown');
for (const s of [401, 403]) {
  g = await saveWith(() => resp(s, { message: 'permission denied' }));
  assert.equal(g.run('state.submissionStatus'), 'forbidden', s + ' → permission error');
  assert.ok(g.run('renderRemote()').includes('선생님께'), s + ' asks for teacher');
}
g = await saveWith(() => { throw new Error('abort'); });
assert.equal(g.run('state.submissionStatus'), 'unknown');
g = await saveWith(() => resp(201, ''), { online: false });
assert.equal(g.run('state.submissionStatus'), 'failed');
assert.equal(g.posts.length, 0, 'offline never posts');
// retry: 500 then 201, byte-identical body & same result_id
g = await saveWith(n => n === 1 ? resp(500, {}) : resp(201, ''));
assert.equal(g.run('state.submissionStatus'), 'unknown');
assert.ok(!g.run('renderRemote()').includes('서버 저장 완료'), 'no success text before 2xx');
assert.ok(!g.store.get('democracy-1980-v1-draft').includes('"submissionStatus":"saved"'));
await g.run('attemptSave()');
await new Promise(res => setImmediate(res));
assert.equal(g.posts.length, 2);
assert.equal(g.posts[0].opts.body, g.posts[1].opts.body, 'retry re-sends the identical payload');
assert.ok(g.posts[1].opts.body.includes(rid(g)));
assert.equal(g.run('state.submissionStatus'), 'saved');

// ---------- 5. local draft migration v1 → v2 ----------
const v1Draft = JSON.stringify({ game: 'democracy-1980', localVersion: 1, className: '1-1', resultId: 'democracy-1980-old', submissionStatus: 'idle', pre: 'unsure', archive: { background: 'x' }, a: {}, b: {}, c: { finalText: 'OLD-TEXT' }, duration: {} });
let gm = makeGame({ storage: { 'democracy-1980-v1-draft': v1Draft } });
assert.equal(gm.run('stored.kind'), 'legacy', 'unsaved v1 draft is not resumed');
assert.ok(gm.els.get('app').innerHTML.includes('이전 버전 기록'), 'legacy notice shown');
assert.ok(gm.els.get('app').innerHTML.includes('legacyBackupButton'), 'TXT backup offered for same class');
assert.ok(!gm.els.get('app').innerHTML.includes('resumeButton'));
assert.ok(gm.run('legacyBackupText(stored.data)').includes('OLD-TEXT'));
assert.equal(gm.posts.length, 0);
gm = makeGame({ search: '?class=2-3', storage: { 'democracy-1980-v1-draft': v1Draft } });
assert.ok(!gm.els.get('app').innerHTML.includes('legacyBackupButton'), 'no backup of another class draft on shared device');
gm = makeGame({ storage: { 'democracy-1980-v1-draft': JSON.stringify({ game: 'democracy-1980', localVersion: 1, resultId: 'r', submissionStatus: 'saved' }) } });
assert.equal(gm.run('stored'), null, 'saved v1 record is never re-sent or resumed');
assert.equal(gm.posts.length, 0);
const gv2 = makeGame();
gv2.run(`state.pre='fire_first';persist()`);
const v2Draft = gv2.store.get('democracy-1980-v1-draft');
gm = makeGame({ storage: { 'democracy-1980-v1-draft': v2Draft } });
assert.equal(gm.run('stored.kind'), 'resume');
assert.ok(gm.els.get('app').innerHTML.includes('resumeButton'));
assert.equal(gm.run('localStorage.getItem("history-1979-v07-draft")'), null, '1979 key untouched');

console.log('1980 DESIGN_LOCK v1.3 contract checks: PASS (static, sensitive, playthrough, payload ≤16KB, save branches, v1→v2 drafts)');
