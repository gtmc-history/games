// EXPLORE 1877 장면 자동 점검: 저장소 루트에서 python3 -m http.server 8766 실행 후 node로 실행 (playwright 필요)
import { chromium } from 'playwright';
const b=await chromium.launch();let fail=0;
for (const [w,h] of [[390,844],[768,1024],[1280,900]]){
 const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://127.0.0.1:8766/dokdo-1905-file/explore/act-1877/');await p.waitForTimeout(600);
 const orig=p.locator('#orig');const bb=await orig.boundingBox();await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);
 await p.click('#origText .t[data-i="1"]');await p.click('#origText .t[data-i="2"]');await p.click('#origText .t[data-i="3"]');
 await p.click('#toMap');await p.waitForTimeout(300);
 const at=async(x,y)=>{await p.locator('#map').scrollIntoViewIfNeeded();const m=await p.locator('#map').boundingBox();await p.mouse.click(m.x+x/1000*m.width,m.y+y/841*m.height)};
 await at(470,420);await p.click('#okSmall');await at(320,250);
 await p.click('#okIso');await p.waitForTimeout(200);
 await p.locator('#rev').fill('100');await p.locator('#rev').dispatchEvent('input');await p.waitForTimeout(200);
 await p.click('#toNames');
 const link=async(a,c,k,e)=>{await p.click(`.nc[data-id="${a}"]`);await p.click(`.nc[data-id="${c}"]`);await p.click(`[data-k="${k}"]`);if(e)await p.click(`[data-e="${e}"]`);await p.click('#saveLink')};
 await link('t77','iso','ok','e1');await link('o77','sm','maybe','e2');
 await p.click('[data-s="diff"]');await p.waitForTimeout(200);
 const txt=await p.textContent('#sameOut');if(!txt.includes('같은 이름, 다른 섬'))fail++;
 const hs=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);if(hs){fail++;console.log('hscroll',w)}
 if(errs.length){fail++;console.log(errs)}
 console.log(w,'ok');await p.close();
}
await b.close();console.log(fail?'FAIL '+fail:'ALL PASS');
