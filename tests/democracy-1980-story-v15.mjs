// democracy-1980 — DESIGN_LOCK v1.5 story checks (dialogue V1~V10, story objects,
// V5 → counterexample gating incl. Esc path, unchanged save payload).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../democracy-1980/index.html', import.meta.url), 'utf8');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function makeGame() {
  const els = new Map(), store = new Map(), listeners = {}, scrolls = [];
  const el = id => ({ id, textContent: '', innerHTML: '', className: '', value: '', dataset: {}, style: {}, offsetWidth: 1, hidden: false,
    classList: { add(){}, remove(){}, toggle(){}, contains: () => false },
    getBoundingClientRect: () => ({ top: 400, width: 100 }), querySelectorAll: () => [], appendChild(){}, remove(){}, click(){} });
  const ctx = {
    URLSearchParams, JSON, Math, Date, Promise, Object, Array, Set, String, Number, Boolean, Error,
    location: { search: '?class=1-1' }, crypto: { randomUUID: () => 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee' },
    performance: { now: () => 0 }, navigator: { onLine: true },
    localStorage: { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)) },
    document: { hidden: false, getElementById: id => { if (!els.has(id)) els.set(id, el(id)); return els.get(id); },
      querySelectorAll: () => [], addEventListener: (t, f) => { (listeners[t] ||= []).push(f); }, createElement: () => el('x'), body: { appendChild(){} } },
    window: { addEventListener(){}, scrollTo: o => scrolls.push(o), scrollY: 0, matchMedia: () => ({ matches: false }) },
    Blob: class {}, URL: { createObjectURL: () => '', revokeObjectURL(){} }, setTimeout: () => 0,
    fetch: async () => ({ ok: true, status: 201, text: async () => '' })
  };
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  const run = s => { const v = vm.runInContext(s, ctx); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
  return { run, els, listeners, scrolls };
}
const toB = g => {
  g.run(`state.pre='unsure';setScene(3)`);
  g.run(`state.b.answers=[{answer_id:'military_fired',source_id:'B-S2'},{answer_id:'citizen_self_defense_armed',source_id:'B-S3'},{answer_id:'censorship_0517',source_id:'B-S1'}]`);
};

// ---- 1. exact wording (DESIGN_LOCK v1.5 §6)
const g = makeGame();
const beats = g.run('FRIEND_BEATS');
const expected = {
  V1: ['여기 전학 와서 처음 맡은 일이 5월 기록 전시야.', '금요일 개막이라 신문 스크랩을 보고 초안을 썼어.'],
  V2: ['이대로 붙여도 될까? 그 전에 하나만 먼저 물어볼게.'],
  V3: ['선생님 메모가 붙어 있어. 스크랩은 5월 18일부터만 있는데…', '그 전엔 무슨 일이 있었던 거야?'],
  V4: ['‘충돌’이라고 쓰면 공평한 거 아냐?', '양쪽 다 싸운 거잖아.'],
  V5: ['잠깐, 내가 참고한 건 검열이 있던 시기의 신문이잖아.', '그럼 여기에 없는 사실은 다른 기록에서 찾아야겠어.'],
  V7: ['시간이 없어. 계엄사 발표에 ‘약탈’이라고 적혀 있거든.', '공식 발표니까 그대로 인용하면 안전하지 않을까?'],
  V8: ['그럼 내 스크랩이 아예 안 쓴 건 뭐였을까?', '그 주에 광주는 실제로 어떤 모습이었는데?'],
  V10: ['‘충돌’만 쓰면 계엄군의 폭력적 진압이 가려져.', '우리가 고친 문장 옆에 확인한 출처도 표시했어.']
};
assert.deepEqual(Object.keys(beats), Object.keys(expected), '8 speech bubbles, V6/V9 are not bubbles');
for (const [id, lines] of Object.entries(expected)) {
  assert.deepEqual(beats[id].lines, lines, id + ' wording');
  for (const l of lines) assert.ok(l.length <= 40, id + ' line ≤ 40');
}
assert.deepEqual(g.run('CX_QUESTION_LINES'), ['근데 19일에도 총을 빼앗은 사람이 있었다던데?', '그럼 무장이 먼저 아냐?']);
assert.deepEqual(g.run('STORY_TEXT'), {
  draftLabel: '학습용 재구성 · 실제 1980년 신문 지면/원문 아님',
  memoA: '‘갑자기’? 그 전엔 무슨 일이 있었지?', memoS5: '전시에 붙일 설명에는 근거와 출처도 함께 남겨 줘.', memoBy: '동아리 지도교사(가상)',
  visitorLabel: '관람자 질문(가상)', visitorQuestion: '‘충돌’이라고만 쓰지 않은 이유는 무엇인가요?',
  exhibitCard: '5월 기록 전시 · 전시 제작: 지우와 기록 조사자'
});
assert.equal(beats.V4.tag, '흔한 오해');
assert.equal(beats.V7.tag, '당시 표현의 진실성 미확정');
assert.deepEqual(g.run('FRIEND_STAGES'), { s1: ['V1', 'V2'], a: ['V3'], b: ['V4'], 'b-reveal': ['V5'], c1: ['V7'], c2: ['V8'], s5: ['V10'] });
// §1 history scope: the reveal must not date censorship's start or assert a deletion
assert.ok(!beats.V5.lines.join('').includes('5월 17일') && !/삭제/.test(beats.V5.lines.join('')), 'V5 stays within source scope');
for (const [id, b] of Object.entries(beats)) { const s = b.lines.join(' '); assert.ok(!(s.includes('전학') && s.includes('광주')), id + ': no Gwangju tie in the transfer line'); }

// ---- 2. story objects render on their scenes
assert.ok(g.run('renderStart()').includes('학습용 재구성 · 실제 1980년 신문 지면/원문 아님'));
g.run('setScene(2)');
assert.ok(g.run('renderA()').includes('data-memo="A"'), 'A memo shown');
g.run(`state.scene=5;state.archive={background:'a',actor_sequence:'b',citizen_context:'c'}`);
const fin = g.run('renderFinal()');
for (const s of ['5월 기록 전시 · 전시 제작: 지우와 기록 조사자', 'data-visitor="V9"', '관람자 질문(가상)', 'data-memo="S5"'])
  assert.ok(fin.includes(s), 'S5 shows ' + s);
assert.deepEqual(g.run('pendingBeats()'), ['V10']);

// ---- 3. V5 gating — button path
const gb = makeGame(); toB(gb);
assert.deepEqual(gb.run('pendingBeats()'), ['V4']);
assert.ok(!gb.run('renderB()').includes('cxWait') && !gb.run('renderB()').includes('data-cx='), 'nothing before restoring the text');
gb.run('checkB()');
assert.equal(gb.run('state.b.textDone'), true);
assert.deepEqual(gb.run('pendingBeats()'), ['V5'], 'only V5 after restoring');
assert.ok(gb.run('renderB()').includes('위 지우의 말을 확인하면 반례 점검이 열립니다.'), 'waiting note in the panel spot');
assert.ok(!gb.run('renderB()').includes('data-cx='), 'counterexample hidden until V5 is closed');
assert.ok(gb.scrolls.length >= 1 && gb.scrolls.at(-1).behavior === 'smooth', 'checkB success scrolls up to the dialogue');
gb.run(`answerCounterexample('cx_distinguish')`);
assert.equal(gb.run('state.b.cx.first'), null, 'answers ignored while V5 is open');
gb.els.get('friendNext').onclick();
assert.ok(gb.els.get('app').innerHTML.includes('data-cx="cx_distinguish"'), 'button close re-renders and opens the panel');
assert.ok(gb.els.get('app').innerHTML.includes('근데 19일에도 총을 빼앗은 사람이 있었다던데? 그럼 무장이 먼저 아냐?'), 'V6 wording in panel');
gb.run(`answerCounterexample('cx_deny')`);
gb.run(`answerCounterexample('cx_distinguish')`);
assert.deepEqual(gb.run('state.b.cx'), { first: 'cx_deny', final: 'cx_distinguish' });
assert.equal(gb.run('state.b.done'), true, 'counterexample still required and recorded');

// ---- 4. V5 gating — Esc path (the registered keydown listener)
const ge = makeGame(); toB(ge); ge.run('checkB()');
assert.ok(!ge.els.get('app').innerHTML.includes('data-cx='));
let prevented = false;
for (const f of ge.listeners.keydown) f({ key: 'Escape', preventDefault: () => { prevented = true; } });
assert.ok(prevented, 'Esc handled');
assert.ok(ge.els.get('app').innerHTML.includes('data-cx='), 'Esc close re-renders and opens the panel immediately');
assert.deepEqual(ge.run('pendingBeats()'), []);

// ---- 5. resumed drafts: finished B shows its panel even if V5 was never closed
const gr = makeGame(); toB(gr);
gr.run(`state.b.textDone=true;state.b.done=true;state.b.cx={first:'cx_distinguish',final:'cx_distinguish'}`);
assert.ok(gr.run('renderB()').includes('data-cx='), 'completed B keeps its counterexample panel');

// ---- 6. save payload unchanged (dialogue state never leaves the device)
gb.run(`state.completed_at=state.started_at=new Date().toISOString()`);
const payload = gb.run('buildPayload()');
assert.deepEqual(Object.keys(payload).sort(), ['choices', 'class', 'comment', 'game', 'timestamp']);
assert.equal(payload.choices.version, '1.3.0');
assert.equal(gb.run('LOCAL_VERSION'), 2);
const s = JSON.stringify(payload);
assert.ok(!s.includes('dismissed') && !s.includes('"V5"') && !s.includes('vn'), 'no dialogue state in payload');

console.log('1980 DESIGN_LOCK v1.5 story checks: PASS (wording, story objects, V5→counterexample via button & Esc, payload unchanged)');
