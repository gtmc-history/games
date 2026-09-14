import fs from 'node:fs/promises';
import path from 'node:path';

const DEBUG = 'http://127.0.0.1:9222';
const GAME_URL = 'http://127.0.0.1:8765/dokdo-1905-file/?class=qa-browser';
const OUT = path.resolve('dokdo-1905-file/qa-artifacts');
await fs.mkdir(OUT, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function waitHttp(url, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {}
    await sleep(150);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function newTarget() {
  await waitHttp(`${DEBUG}/json/version`);
  const r = await fetch(`${DEBUG}/json/new?about:blank`, { method: 'PUT' });
  if (!r.ok) throw new Error(`Could not create CDP target: ${r.status}`);
  return r.json();
}

async function connect(target) {
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let nextId = 1;
  const pending = new Map();
  ws.onmessage = event => {
    const msg = JSON.parse(event.data);
    if (!msg.id) return;
    const slot = pending.get(msg.id);
    if (!slot) return;
    pending.delete(msg.id);
    if (msg.error) slot.reject(new Error(JSON.stringify(msg.error)));
    else slot.resolve(msg.result);
  };

  function send(method, params = {}) {
    const id = nextId++;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evalValue(expression) {
    const r = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true
    });
    if (r.exceptionDetails) {
      throw new Error(`Runtime exception: ${r.exceptionDetails.text || JSON.stringify(r.exceptionDetails)}`);
    }
    return r.result?.value;
  }

  async function waitFor(expression, timeout = 8000) {
    const started = Date.now();
    let last;
    while (Date.now() - started < timeout) {
      try {
        last = await evalValue(expression);
        if (last) return last;
      } catch (e) {
        last = String(e);
      }
      await sleep(80);
    }
    throw new Error(`waitFor timeout: ${expression}\nlast=${last}`);
  }

  async function click(selector, index = 0) {
    const sel = JSON.stringify(selector);
    const ok = await evalValue(`(()=>{const a=[...document.querySelectorAll(${sel})]; const el=a[${index}]; if(!el) return false; el.click(); return true;})()`);
    if (!ok) throw new Error(`Missing click target ${selector}[${index}]`);
    await sleep(30);
  }

  async function screenshot(name) {
    await send('Page.bringToFront');
    const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    await fs.writeFile(path.join(OUT, name), Buffer.from(r.data, 'base64'));
  }

  async function assertNoHorizontalOverflow(label) {
    const info = await evalValue(`(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bw:document.body.scrollWidth}))()`);
    if (info.sw > info.cw + 2 || info.bw > info.cw + 2) {
      throw new Error(`${label}: horizontal overflow ${JSON.stringify(info)}`);
    }
  }

  return { ws, send, evalValue, waitFor, click, screenshot, assertNoHorizontalOverflow };
}

const fetchIntercept = `
(() => {
  window.__qaPosts = [];
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = String(input);
    if (url.includes('/rest/v1/game_results')) {
      window.__qaPosts.push({ url, method: init.method || 'GET', body: init.body || '' });
      return new Response('', { status: 201, headers: { 'content-type': 'application/json' } });
    }
    return originalFetch(input, init);
  };
})();`;

async function setInput(cdp, selector, value) {
  const s = JSON.stringify(selector), v = JSON.stringify(value);
  const ok = await cdp.evalValue(`(()=>{const el=document.querySelector(${s});if(!el)return false;el.value=${v};el.dispatchEvent(new Event('input',{bubbles:true}));return true;})()`);
  if (!ok) throw new Error(`Missing input ${selector}`);
}

async function runViewport(width, height, label) {
  const target = await newTarget();
  const cdp = await connect(target);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 480
  });
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: fetchIntercept });
  await cdp.send('Page.navigate', { url: GAME_URL });
  await cdp.waitFor(`document.readyState==='complete' && !!document.querySelector('#startBtn')`);
  await cdp.assertNoHorizontalOverflow(`${label}/start`);
  await cdp.screenshot(`${label}-01-start.png`);

  // VN OFF so the smoke focuses on core gameplay and does not depend on dialogue.
  await cdp.click('#vnToggle');
  await cdp.click('#startBtn');
  await cdp.waitFor(`document.querySelector('#sceneIndex')?.textContent.includes('SCENE 0')`);

  // S0
  await cdp.click('.phrase', 0);
  await cdp.click('.why', 0);
  await cdp.waitFor(`!document.querySelector('#sceneNext').disabled`);
  await cdp.click('#sceneNext');

  // S1
  await cdp.waitFor(`document.querySelector('#sceneIndex')?.textContent.includes('SCENE 1')`);
  await cdp.click('.cab[data-role="basis"]', 0);
  await cdp.click('.cab[data-role="decision"]', 0);
  await cdp.waitFor(`!document.querySelector('#sceneNext').disabled`);
  await cdp.click('#sceneNext');

  // S2 — choose the cautious/hold interpretation path.
  await cdp.waitFor(`document.querySelector('#sceneIndex')?.textContent.includes('SCENE 2')`);
  await cdp.assertNoHorizontalOverflow(`${label}/s2`);
  await cdp.screenshot(`${label}-02-s2.png`);
  await cdp.click('#direct1877');
  await cdp.click('[data-map]', 0);
  await cdp.click('[data-map]', 1);
  await cdp.click('#hold1877');
  await cdp.waitFor(`!document.querySelector('#sceneNext').disabled`);
  await cdp.click('#sceneNext');

  // S3
  await cdp.waitFor(`document.querySelector('#sceneIndex')?.textContent.includes('SCENE 3')`);
  await cdp.click('.ord[data-id="ord-admin"]');
  await cdp.click('.ord[data-id="ord-area"]');
  await cdp.waitFor(`!document.querySelector('#sceneNext').disabled`);
  await cdp.click('#sceneNext');

  // S4 — exercise optional-source dialog and source decomposition.
  await cdp.waitFor(`document.querySelector('#sceneIndex')?.textContent.includes('SCENE 4')`);
  await cdp.click('[data-open="niitaka1904"]');
  await cdp.waitFor(`document.querySelector('#sourceDialog')?.open===true`);
  await cdp.screenshot(`${label}-03-source-dialog.png`);
  await cdp.evalValue(`document.querySelector('#sourceDialog').close(); true`);
  await cdp.click('.npart', 0);
  await cdp.click('.npart', 1);
  await cdp.click('.npart', 2);
  await cdp.click('.ctx', 1);
  await cdp.waitFor(`!document.querySelector('#sceneNext').disabled`);
  await cdp.click('#sceneNext');

  // S5
  await cdp.waitFor(`document.querySelector('#sceneIndex')?.textContent.includes('SCENE 5')`);
  await cdp.click('.s1906[data-id="affiliation"]');
  await cdp.click('.s1906[data-id="notice"]');
  await cdp.click('.s1906[data-id="reject"]');
  await cdp.waitFor(`!document.querySelector('.rev').disabled`);
  await cdp.click('.rev', 0);
  await cdp.waitFor(`!document.querySelector('#sceneNext').disabled`);
  await cdp.assertNoHorizontalOverflow(`${label}/s5`);
  await cdp.screenshot(`${label}-04-s5-revision.png`);
  await cdp.click('#sceneNext');

  // S6
  await cdp.waitFor(`document.querySelector('#sceneIndex')?.textContent.includes('SCENE 6')`);
  const boardSetup = await cdp.evalValue(`(()=>{
    const checks=[...document.querySelectorAll('.exsrc')];
    if(checks.length<3)return {ok:false,n:checks.length};
    checks.slice(0,3).forEach(x=>x.click());
    const vals=checks.slice(0,3).map(x=>x.value);
    const a=document.querySelector('#relA'),b=document.querySelector('#relB'),l=document.querySelector('#relLabel'),add=document.querySelector('#addRel');
    a.value=vals[0];b.value=vals[1];l.value='보강한다';add.click();
    a.value=vals[1];b.value=vals[2];l.value='후속 대응이다';add.click();
    return {ok:true,n:checks.length};
  })()`);
  if (!boardSetup?.ok) throw new Error(`S6 board setup failed: ${JSON.stringify(boardSetup)}`);
  await cdp.waitFor(`!document.querySelector('#sceneNext').disabled`);
  await cdp.screenshot(`${label}-05-board.png`);
  await cdp.click('#sceneNext');

  // S7
  await cdp.waitFor(`document.querySelector('#sceneIndex')?.textContent.includes('SCENE 7')`);
  await cdp.click('.block', 0);
  await cdp.click('.block', 1);
  await setInput(cdp, '#panelTitle', '1905 파일: 기록을 연결해 다시 쓴 전시문');
  await setInput(cdp, '#panelCaution', '각 문서의 직접 문구와 후대의 지명 식별·해석을 구분해 읽는다.');
  await cdp.waitFor(`!document.querySelector('#sceneNext').disabled`);
  await cdp.assertNoHorizontalOverflow(`${label}/s7`);
  await cdp.screenshot(`${label}-06-editor.png`);
  await cdp.click('#sceneNext');

  // Result + intercepted save payload.
  await cdp.waitFor(`document.querySelector('#resultView')?.hidden===false`);
  await cdp.waitFor(`window.__qaPosts?.length>=1`);
  await cdp.assertNoHorizontalOverflow(`${label}/result`);
  await cdp.screenshot(`${label}-07-result.png`);

  const captured = await cdp.evalValue(`(()=>({posts:window.__qaPosts,state:JSON.parse(sessionStorage.getItem('dokdo1905_build_v1')||'{}')}))()`);
  const post = captured.posts[0];
  const payload = JSON.parse(post.body);
  const choices = payload.choices || {};
  if (post.method !== 'POST') throw new Error(`${label}: save method was ${post.method}`);
  if (payload.game !== 'dokdo-1905-file') throw new Error(`${label}: wrong game id`);
  if (!String(choices.outside_one_status || '').includes('보류')) throw new Error(`${label}: S2 hold path was not preserved`);
  if (!(choices.revision_count >= 1)) throw new Error(`${label}: revision_count was not incremented`);
  if (!Array.isArray(choices.board_links) || choices.board_links.length < 2) throw new Error(`${label}: board links missing`);
  if (!Array.isArray(choices.selected_exhibit_sources) || choices.selected_exhibit_sources.length < 2) throw new Error(`${label}: exhibit sources missing`);
  if ('finalPanel' in choices || 'final_panel' in choices) throw new Error(`${label}: free-text final panel leaked into save choices`);
  if (payload.comment !== '') throw new Error(`${label}: comment should remain empty`);

  const buttonAudit = await cdp.evalValue(`(()=>[...document.querySelectorAll('button')].filter(b=>!b.hidden).map(b=>({text:(b.textContent||'').trim(),aria:b.getAttribute('aria-label')})).filter(x=>!x.text&&!x.aria))()`);
  if (buttonAudit.length) throw new Error(`${label}: visible buttons without accessible name: ${JSON.stringify(buttonAudit)}`);

  cdp.ws.close();
  return {
    viewport: `${width}x${height}`,
    saveCaptured: true,
    evidenceSeen: choices.evidence_seen?.length || 0,
    boardLinks: choices.board_links.length,
    selectedExhibitSources: choices.selected_exhibit_sources.length,
    revisionCount: choices.revision_count,
    outsideOneStatus: choices.outside_one_status
  };
}

const results = [];
for (const [width, height, label] of [
  [390, 844, '390'],
  [768, 1024, '768'],
  [1280, 900, '1280']
]) {
  results.push(await runViewport(width, height, label));
}

await fs.writeFile(path.join(OUT, 'summary.json'), JSON.stringify({ ok: true, results }, null, 2));
console.log(JSON.stringify({ ok: true, results }, null, 2));