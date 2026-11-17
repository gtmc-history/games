import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../democracy-1980/index.html', import.meta.url), 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'Student HTML must contain one embedded application script');
const code = scriptMatch[1];
new vm.Script(code, { filename: 'democracy-1980-inline.js' });

function section(start, end) {
  const a = code.indexOf(start);
  const b = code.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, 'Unable to inspect ' + start);
  return code.slice(a, b);
}

const ctx = { URLSearchParams, location: { search: '' } };
const classFns = vm.runInNewContext(
  section('function isAllowedClassName(', 'const classInfo=getClassParam();') +
    ';({isAllowedClassName,getClassParam})', ctx
);
for (const [url, expected, corrected] of [
  ['?class=1-3','1-3',false],['?Class=2-11','2-11',true],
  ['?class=3-9','3-9',false],['?Class1-1','미입력',false],
  ['?class=%3Cscript%3E','미입력',false],
  ['?class=%ED%99%8D%EA%B8%B8%EB%8F%99','미입력',false],
  ['?class=1-999','미입력',false],['?class=1-01','미입력',false],
  ['?class=1-3&Class=1-4','미입력',false],
  ['?class=1-3&class=1-4','미입력',false]
]) {
  ctx.location.search = url;
  const actual = classFns.getClassParam();
  assert.equal(actual.value, expected, 'class validation: ' + url);
  assert.equal(actual.corrected, corrected, 'class correction: ' + url);
}

const clean = vm.runInNewContext(
  section('function cleanStudentText(', 'function uuid(){') + ';cleanStudentText'
);
assert.equal(clean('a'.repeat(500), 120).length, 120);
assert.equal(clean('  가나다  ', 120, true), '가나다');
assert.equal(clean('a\u0000b\u202Ec', 120), 'abc');
assert.equal(clean('<img src=x onerror=alert(1)>', 120), '<img src=x onerror=alert(1)>');

assert.ok(html.includes('maxlength="120"'), 'textarea maxlength must be set');
assert.ok(code.includes('studentText.textContent='), 'student free text must be assigned via textContent');
assert.ok(code.includes('savedClassEl.textContent='), 'saved class must be assigned via textContent');
assert.ok(code.includes('text.value=cleanStudentText(state.c.finalText,120)'), 'textarea value must use DOM property');
assert.ok(!code.includes('escapeHTML(state.c.finalText)'), 'student text must not be inserted into HTML templates');
assert.ok(code.includes('final_reconstruction_text:cleanStudentText(state.c.finalText,120,true)'), 'payload must enforce length');
assert.ok(code.includes("comment:''"), 'no unsanitized free-form comment input is allowed');

function inspectPersist(submissionStatus) {
  const values = new Map();
  const badge = { textContent: '' };
  const saveCtx = {
    state: { game: 'democracy-1980', localVersion: 1, resultId: 'rid-1',
             submissionStatus, c: { finalText: 'PRIVATE-STUDENT-TEXT' },
             snapshotPayload: { sensitive: true } },
    GAME_SLUG: 'democracy-1980', STORAGE_KEY: 'democracy-1980-v1-draft',
    localStorage: { setItem: (k,v) => values.set(k,v) },
    $: () => badge, Date
  };
  vm.runInNewContext(
    section('function persist(){', 'function mission(){') + ';persist()', saveCtx
  );
  return JSON.parse(values.get('democracy-1980-v1-draft'));
}
const saved = inspectPersist('saved');
assert.equal(saved.resultId, 'rid-1');
assert.equal(saved.submissionStatus, 'saved');
assert.ok(!JSON.stringify(saved).includes('PRIVATE-STUDENT-TEXT'));
assert.equal(saved.snapshotPayload, undefined);
assert.equal(saved.c, undefined);
const unsaved = inspectPersist('failed');
assert.equal(unsaved.c.finalText, 'PRIVATE-STUDENT-TEXT', 'failed saves must retain retry backup');
assert.ok(code.includes("clearScreen.onclick=()=>startNew()"), 'explicit shared-device reset must be connected');
assert.ok(code.includes("game: 'democracy-1980'"), 'game slug contract must remain literal');
assert.ok(html.includes("democracy-1980-v1-draft"), '1980 storage must stay separate from 1979');

console.log('1980 BUILD1 security checks: PASS (syntax, URL, text, output, local persistence)');
