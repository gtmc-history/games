(async()=>{
  for(const src of ['app-1.js','app-2.js','app-3.js']){
    await new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src=src;s.onload=resolve;s.onerror=()=>reject(new Error(`load failed: ${src}`));
      document.head.appendChild(s);
    });
  }
})().catch(err=>{console.error(err);document.body.insertAdjacentHTML('beforeend','<p style="padding:16px">게임 스크립트를 불러오지 못했습니다. 새로고침해 주세요.</p>')});
