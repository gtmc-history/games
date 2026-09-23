// EXPLORE S4 Hub 자동 점검: node dokdo-1905-file/explore/s4-hub/qa-hub.mjs (저장소 루트, 8766 포트 정적 서버 필요)
import { chromium } from 'playwright';
const URL = 'http://127.0.0.1:8766/dokdo-1905-file/explore/s4-hub/';
const S4_BUDGET_S = 360; // 제안서 §6: S4 6분
const vps = [[390, 844], [768, 1024], [1280, 900]];
const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
let fail = 0;
const ok = (c, m) => { if (!c) { fail++; console.log('  FAIL', m); } };
for (const [w, h] of vps) {
  for (const mode of ['walk', 'list']) {
    const p = await browser.newPage({ viewport: { width: w, height: h } });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(URL);
    if (mode === 'list') await p.click('#modeBtn');
    const zone = async z => mode === 'walk' ? p.click(`.zone[data-z="${z}"] .zn`) : p.click(`[data-lz="${z}"]`);
    ok(await p.isDisabled('#endBtn'), 'end locked at start');
    if (mode === 'walk') {
      // 경로 A: 일본 해군 기록 2건 → 책상 → 분해·관계·카드 붙이기 → 근거로 닫기
      await zone(4); await p.waitForSelector('[data-take="niitaka1904"]');
      await p.click('[data-take="niitaka1904"]'); await p.click('[data-take="tsushima1904"]');
      await p.click('[data-take="nakai1904"]'); ok(await p.locator('.fb.warn').count() === 1, 'tray cap 2');
      await p.click('#toDesk'); await p.waitForSelector('[data-doc="niitaka1904"]');
      for (const part of ['누가 기록했나', '정보는 어디서 왔나', '어떤 명칭인가']) await p.click(`.npart[data-p="${part}"]`);
      await p.click('[data-att="niitaka1904|q1"]');
      await p.click('[data-att="tsushima1904|q2"]');
      ok(await p.isDisabled('[data-close="q2|evidence"]'), 'q2 evidence needs relation memo');
      await p.click('.ctx[data-v="배경 맥락으로 연결한다"]');
      await p.click('[data-close="q1|evidence"]'); await p.click('[data-close="q2|evidence"]');
      await zone(2); await p.waitForSelector('.wall');
      ok((await p.textContent('.wall')).includes('니타카'), 'wall shows read doc');
      ok(!(await p.textContent('.wall')).includes('현대의 지명 연구'), 'unread doc not on wall');
    } else {
      // 경로 B: 현대 코너 1건만 읽고 둘 다 보류로 닫기 (이동 OFF)
      await zone(5); await p.click('[data-take="toponymStudy"]'); await p.click('#toDesk');
      await p.waitForSelector('[data-doc="toponymStudy"]');
      await p.click('[data-att="toponymStudy|q1"]');
      ok((await p.textContent('#panel')).includes('오늘날 만든 해설'), 'modern-layer feedback');
      await p.click('[data-close="q1|held"]'); await p.click('[data-close="q2|held"]');
    }
    ok(!(await p.isDisabled('#endBtn')), 'end unlocked after both cards closed');
    await p.click('#endBtn');
    const r = await p.evaluate(() => window.__HUB_RESULT);
    const hscroll = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    ok(!hscroll, 'no page horizontal scroll');
    ok(errs.length === 0, 'no page errors ' + errs.join('|'));
    const proj = (r.move_s / S4_BUDGET_S * 100).toFixed(1);
    console.log(`${w}x${h} ${mode}: trips=${r.trips} move=${r.move_s}s → S4 6분 대비 ${proj}% | cards=${JSON.stringify(r.cards)} ctx=${r.ctx || '-'}`);
    if (mode === 'walk') ok(+proj <= 8, 'projected move share ≤ 8%');
    await p.screenshot({ path: `/tmp/claude-0/-home-user-games/afbdbb3f-0e67-599e-901f-e7ce6fb879cb/scratchpad/hub-${w}-${mode}.png`, fullPage: false });
    await p.close();
  }
}
await browser.close();
console.log(fail ? `FAIL ${fail}` : 'ALL PASS');
process.exit(fail ? 1 : 0);
