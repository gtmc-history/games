(()=>{
  const MAPS={
    rail1934:{
      image:'https://upload.wikimedia.org/wikipedia/commons/7/76/1930s_korea_rail_map.jpg',
      page:'https://commons.wikimedia.org/wiki/File:1930s_korea_rail_map.jpg',
      label:'1934 「朝鮮鉄道略図」',
      credit:'Chosen Government Railway · Wikimedia Commons · Public Domain'
    },
    najuNow:{
      image:'https://upload.wikimedia.org/wikipedia/commons/e/e8/Naju-map.png',
      page:'https://commons.wikimedia.org/wiki/File:Naju-map.png',
      label:'오늘날 나주시 행정구역도',
      credit:'장길산 · Wikimedia Commons · Public Domain'
    },
    iksanNow:{
      image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Iksan-map.png',
      page:'https://commons.wikimedia.org/wiki/File:Iksan-map.png',
      label:'오늘날 익산시 행정구역도',
      credit:'장길산 · Wikimedia Commons · Public Domain'
    },
    mokpoTopo:{
      image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/%EB%AA%A9%ED%8F%AC%20%EC%A7%80%ED%98%95%EB%8F%84.svg',
      page:'https://commons.wikimedia.org/wiki/File:%EB%AA%A9%ED%8F%AC_%EC%A7%80%ED%98%95%EB%8F%84.svg',
      label:'오늘날 목포 지형도',
      credit:'Jjw · Wikimedia Commons · CC BY-SA 4.0'
    }
  };

  function sourceLink(m,extra=''){
    return `<div class="map-credit" title="${m.credit}"><span>${extra||m.label}</span><a href="${m.page}" target="_blank" rel="noopener">지도 출처</a></div>`;
  }
  function railFrame(kind){
    const captions={
      case1:'1934 실제 철도지도 · 충남권 위치 확인용',
      case2:'1934 실제 철도지도 · 호남선 축 위치 확인용'
    };
    return `<div class="real-map-layer rail-history ${kind}" aria-hidden="true">
      <img class="real-map-img" src="${MAPS.rail1934.image}" alt="" loading="eager" referrerpolicy="no-referrer">
      <div class="map-wash"></div>
    </div>
    <div class="map-era-chip">${captions[kind]}</div>
    ${sourceLink(MAPS.rail1934)}`;
  }
  function case2Insets(){
    return `<div class="locator-insets" aria-hidden="true">
      <figure><img src="${MAPS.iksanNow.image}" alt="" referrerpolicy="no-referrer"><figcaption>현재 익산</figcaption></figure>
      <figure><img src="${MAPS.najuNow.image}" alt="" referrerpolicy="no-referrer"><figcaption>현재 나주</figcaption></figure>
    </div>`;
  }
  function mokpoFrame(){
    return `<div class="real-map-layer mokpo-current" aria-hidden="true">
      <img class="real-map-img" src="${MAPS.mokpoTopo.image}" alt="" loading="eager" referrerpolicy="no-referrer">
      <div class="map-wash"></div>
    </div>
    <div class="map-era-chip">오늘날 실제 지형도 · 항만과 해안 위치 확인용</div>
    ${sourceLink(MAPS.mokpoTopo)}`;
  }

  const originalCaseConfig=caseConfig;
  caseConfig=function(caseId){
    const cfg=originalCaseConfig(caseId);
    if(caseId==='case1'){
      cfg.title='실제 지도 기반 보드 · 대전 / 공주';
      cfg.map=railFrame('case1');
      cfg.effects=[
        ['daejeon_growth','대전','도시 위상 상승',57,38],
        ['gongju_decline','공주','상대적 쇠퇴',28,56]
      ];
    }
    if(caseId==='case2'){
      cfg.title=S.cases.case2.stage===0?'실제 지도 기반 보드 · 먼저 이리':'실제 지도 기반 보드 · 나주 / 광주 / 영산포';
      cfg.map=railFrame('case2')+case2Insets();
      cfg.effects=[
        ['iri_growth','이리','새 중심지 형성',47,24],
        ['naju_change','나주읍','상대적 위상 변화',40,62],
        ['gwangju_node','광주','전남 행정 중심',62,52],
        ['yeongsanpo_growth','영산포','별도 성장 양상',47,78]
      ];
    }
    if(caseId==='case3'){
      cfg.title='실제 지도 기반 보드 · 목포';
      cfg.map=mokpoFrame();
      cfg.effects=[
        ['mokpo_start','목포','성장 시작',58,48],
        ['mokpo_later','목포','1932 대도시 위상',65,72]
      ];
    }
    return cfg;
  };

  const national=document.querySelector('.national-map');
  if(national){
    national.innerHTML=`<div class="historic-national-stage">
      <img src="${MAPS.rail1934.image}" alt="1934년 조선철도약도" class="historic-national-img" referrerpolicy="no-referrer">
      <div class="map-wash"></div>
      <div class="national-pin p1"><b>사례 1</b><span>공주 · 대전</span></div>
      <div class="national-pin p2"><b>사례 2</b><span>이리 · 나주</span></div>
      <div class="national-pin p3"><b>사례 3</b><span>목포</span></div>
      <div class="map-era-chip">1934년 실제 철도지도</div>
      ${sourceLink(MAPS.rail1934,'1934 「朝鮮鉄道略図」 · 원본 일본어 표기')}
    </div>`;
  }

  document.documentElement.classList.add('real-map-patch');
  if(S.scene>=3&&S.scene<=5)requestAnimationFrame(()=>renderCase(`case${S.scene-2}`));
})();
