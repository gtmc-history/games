(()=>{
  // Registered location-map patch. The previous visual patch placed HTML pins over
  // an un-georeferenced historical raster, so the labels could not be trusted.
  // This version uses a Wikimedia location map with published geographic bounds
  // and derives every city position from latitude/longitude.
  const BASE={
    image:'https://upload.wikimedia.org/wikipedia/commons/b/b2/South_Korea_location_map.svg',
    page:'https://commons.wikimedia.org/wiki/File:South_Korea_location_map.svg',
    label:'South Korea location map',
    credit:'NordNordWest · Wikimedia Commons · CC BY-SA 3.0',
    width:1771.626,
    height:1672.413,
    west:124.5,
    east:132.0,
    north:38.9,
    south:33.0
  };
  const HISTORIC={
    page:'https://commons.wikimedia.org/wiki/File:1930s_korea_rail_map.jpg',
    label:'1934 「朝鮮鉄道略図」'
  };

  // Coordinates are used only to register labels to the present-day location map.
  // They do not assert historical causality.
  const POINTS={
    daejeon:{lat:36.3500,lon:127.3850,label:'대전'},
    gongju:{lat:36.4500,lon:127.1170,label:'공주'},
    iri:{lat:35.94167,lon:126.94583,label:'이리(현 익산역 일대)'},
    naju:{lat:35.03389,lon:126.71694,label:'구 나주읍'},
    gwangju:{lat:35.16667,lon:126.91667,label:'광주'},
    yeongsanpo:{lat:35.00528,lon:126.70667,label:'영산포'},
    mokpo:{lat:34.79361,lon:126.38861,label:'목포'}
  };

  const VIEWPORTS={
    national:{west:124.5,east:132.0,north:38.9,south:33.0},
    case1:{west:126.65,east:127.65,north:36.72,south:36.08},
    case2:{west:125.75,east:127.95,north:36.28,south:34.68},
    case3:{west:126.08,east:126.72,north:35.02,south:34.58}
  };

  const CASE_POINTS={
    case1:['gongju','daejeon'],
    case2:['iri','gwangju','naju','yeongsanpo'],
    case3:['mokpo']
  };
  const EFFECT_POINT={
    case1:{daejeon_growth:'daejeon',gongju_decline:'gongju'},
    case2:{iri_growth:'iri',naju_change:'naju',gwangju_node:'gwangju',yeongsanpo_growth:'yeongsanpo'},
    case3:{mokpo_start:'mokpo',mokpo_later:'mokpo'}
  };

  function sourceXY(lon,lat){
    return {
      x:(lon-BASE.west)/(BASE.east-BASE.west)*BASE.width,
      y:(BASE.north-lat)/(BASE.north-BASE.south)*BASE.height
    };
  }
  function viewBoxFor(v){
    const a=sourceXY(v.west,v.north),b=sourceXY(v.east,v.south);
    return {x:a.x,y:a.y,w:b.x-a.x,h:b.y-a.y};
  }
  function markerSvg(key,v,opts={}){
    const p=POINTS[key],xy=sourceXY(p.lon,p.lat),vb=viewBoxFor(v);
    const r=Math.max(3.5,vb.w/95),fs=Math.max(11,vb.w/25);
    const dx=(opts.dx??10)*vb.w/520,dy=(opts.dy??-10)*vb.h/360;
    return `<g class="registered-marker" aria-hidden="true">
      <circle cx="${xy.x.toFixed(2)}" cy="${xy.y.toFixed(2)}" r="${r.toFixed(2)}"></circle>
      <circle class="registered-marker-ring" cx="${xy.x.toFixed(2)}" cy="${xy.y.toFixed(2)}" r="${(r*2.2).toFixed(2)}"></circle>
      <text x="${(xy.x+dx).toFixed(2)}" y="${(xy.y+dy).toFixed(2)}" font-size="${fs.toFixed(2)}">${p.label}</text>
    </g>`;
  }
  function mapCredit(extra=''){
    return `<div class="map-credit registered-credit" title="${BASE.credit}">
      <span>${extra||'오늘날 위치도 · 좌표 등록'}</span>
      <a href="${BASE.page}" target="_blank" rel="noopener">배경 지도</a>
      <a href="${HISTORIC.page}" target="_blank" rel="noopener">1934 철도지도 참고</a>
    </div>`;
  }
  function georefMap(caseId){
    const v=VIEWPORTS[caseId],vb=viewBoxFor(v);
    const markers=CASE_POINTS[caseId].map((key,i)=>markerSvg(key,v,{dx:i%2?12:10,dy:i%2?-12:-9})).join('');
    const era=caseId==='case1'?'현재 위치 기준 · 대전/공주':caseId==='case2'?'현재 위치 기준 · 이리/광주/나주/영산포':'현재 위치 기준 · 목포';
    return `<svg class="georef-map-svg" data-map-case="${caseId}" viewBox="${vb.x.toFixed(2)} ${vb.y.toFixed(2)} ${vb.w.toFixed(2)} ${vb.h.toFixed(2)}" role="img" aria-label="${era}" preserveAspectRatio="xMidYMid meet">
      <image href="${BASE.image}" x="0" y="0" width="${BASE.width}" height="${BASE.height}" preserveAspectRatio="none"></image>
      <rect class="registered-wash" x="${vb.x}" y="${vb.y}" width="${vb.w}" height="${vb.h}"></rect>
      ${markers}
    </svg>
    <div class="map-era-chip registered-era">${era}</div>
    ${mapCredit('위치 표시는 공개 좌표로 지도에 등록')}`;
  }

  const originalCaseConfig=caseConfig;
  caseConfig=function(caseId){
    const cfg=originalCaseConfig(caseId);
    if(caseId==='case1'){
      cfg.title='좌표 등록 지도 · 대전 / 공주';
      cfg.map=georefMap('case1');
    }
    if(caseId==='case2'){
      cfg.title=S.cases.case2.stage===0?'좌표 등록 지도 · 먼저 이리':'좌표 등록 지도 · 나주 / 광주 / 영산포';
      cfg.map=georefMap('case2');
    }
    if(caseId==='case3'){
      cfg.title='좌표 등록 지도 · 목포';
      cfg.map=georefMap('case3');
    }
    return cfg;
  };

  function positionEffectNodes(caseId){
    const board=document.getElementById(`${caseId}Board`),svg=board?.querySelector('.georef-map-svg');
    if(!board||!svg)return;
    const boardRect=board.getBoundingClientRect(),svgRect=svg.getBoundingClientRect();
    const vb=viewBoxFor(VIEWPORTS[caseId]);
    const scale=Math.min(svgRect.width/vb.w,svgRect.height/vb.h);
    const drawW=vb.w*scale,drawH=vb.h*scale;
    const ox=(svgRect.width-drawW)/2,oy=(svgRect.height-drawH)/2;
    Object.entries(EFFECT_POINT[caseId]).forEach(([effect,key])=>{
      const node=board.querySelector(`[data-effect="${effect}"]`);if(!node)return;
      const p=POINTS[key],xy=sourceXY(p.lon,p.lat);
      let x=svgRect.left-boardRect.left+ox+(xy.x-vb.x)*scale;
      let y=svgRect.top-boardRect.top+oy+(xy.y-vb.y)*scale;
      node.classList.add('geo-registered-node');
      node.style.left=`${x}px`;node.style.top=`${y}px`;
      node.style.right='auto';
      node.dataset.geoPoint=key;
      if(caseId==='case3'){
        node.classList.add(effect==='mokpo_start'?'geo-offset-up':'geo-offset-down');
      }
    });
    requestAnimationFrame(()=>drawLinks(caseId));
  }

  const originalRenderCase=renderCase;
  renderCase=function(caseId){
    originalRenderCase(caseId);
    requestAnimationFrame(()=>positionEffectNodes(caseId));
  };

  function nationalMap(){
    const v=VIEWPORTS.national,vb=viewBoxFor(v);
    const points=['gongju','daejeon','iri','naju','mokpo'];
    const labels={gongju:'공주',daejeon:'대전',iri:'이리',naju:'나주',mokpo:'목포'};
    const marks=points.map((key,i)=>{
      const p=POINTS[key],xy=sourceXY(p.lon,p.lat),r=10;
      const dx=key==='gongju'?-80:18,dy=key==='naju'?38:-14;
      return `<g class="national-registered-marker"><circle cx="${xy.x}" cy="${xy.y}" r="${r}"></circle><text x="${xy.x+dx}" y="${xy.y+dy}" font-size="34">${labels[key]}</text></g>`;
    }).join('');
    return `<div class="historic-national-stage registered-national-stage">
      <svg class="registered-national-svg" viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}" role="img" aria-label="대한민국 위치도 위의 공주, 대전, 이리, 나주, 목포 위치">
        <image href="${BASE.image}" x="0" y="0" width="${BASE.width}" height="${BASE.height}" preserveAspectRatio="none"></image>
        <rect class="registered-wash" x="0" y="0" width="${BASE.width}" height="${BASE.height}"></rect>
        ${marks}
      </svg>
      <div class="map-era-chip registered-era national-era">오늘날 위치 기준 · 도시 좌표 등록</div>
      ${mapCredit('현재 위치도 위에 각 도시 좌표를 직접 등록')}
    </div>`;
  }

  const national=document.querySelector('.national-map');
  if(national)national.innerHTML=nationalMap();

  document.documentElement.classList.add('real-map-patch','registered-map-patch');
  window.addEventListener('resize',()=>{
    if(S.scene>=3&&S.scene<=5)requestAnimationFrame(()=>positionEffectNodes(`case${S.scene-2}`));
  });
  if(S.scene>=3&&S.scene<=5)requestAnimationFrame(()=>renderCase(`case${S.scene-2}`));
})();
