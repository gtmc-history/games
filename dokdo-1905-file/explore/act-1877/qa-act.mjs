// EXPLORE 1877 장면 v2 자동 점검: 저장소 루트에서 `python3 -m http.server 8766 --bind 127.0.0.1` 실행 후 node로 실행 (playwright 필요)
import { chromium } from 'playwright';
const SHOT=process.env.SHOT_DIR;
const b=await chromium.launch();let fail=0;
for (const [w,h] of [[390,844],[768,1024],[1280,900]]){
 for (const path of ['small','big']){
  const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8766/dokdo-1905-file/explore/act-1877/');await p.waitForTimeout(400);
  await p.click('#origText .t[data-i="1"]');await p.click('#origText .t[data-i="2"]');await p.click('#vnNext');
  await p.click('[data-tag="t77"]');await p.click('[data-hot="big"]');await p.click('[data-tag="o77"]');await p.click('[data-hot="small"]');
  await p.click('#reveal');await p.click('#vnNext');
  await p.click('#arm05');await p.click(`[data-hot="${path}"]`);await p.waitForTimeout(500);
  if(SHOT&&path==='small')await p.screenshot({path:`${SHOT}/v2-${w}-map.png`});
  if(path==='small'){if(!(await p.textContent('#after05')).includes('같은 이름, 다른 자리')){fail++;console.log('no aha',w)}await p.click('#vnNext')}
  else await p.click('#keep05');
  await p.click('[data-rec="diff"]');
  const r=await p.textContent('#recOut');if(!r.includes('"record":"diff"')){fail++;console.log('no payload',w)}
  if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)){fail++;console.log('hscroll',w,path)}
  if(errs.length){fail++;console.log(errs)}
  await p.close();
 }
 console.log(w,'done');
}
await b.close();console.log(fail?'FAIL '+fail:'ALL PASS');process.exit(fail?1:0);
