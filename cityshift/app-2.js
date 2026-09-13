function caseConfig(caseId){
  const stage=S.cases[caseId].stage;
  if(caseId==='case1')return{
    title:'충남 약도 · 대전 / 공주',
    map:`<svg class="map-bg" viewBox="0 0 760 500" aria-hidden="true"><path class="region-fill" d="M80 90 Q260 35 440 82 T690 120 L655 430 Q410 468 105 410Z"/><path class="geo rail" d="M110 380 C250 305 330 260 470 125"/><path class="geo rail" d="M342 274 C435 300 522 344 650 390"/><text x="500" y="110" fill="#777168" font-size="15">경부선</text><text x="520" y="345" fill="#777168" font-size="15">호남선</text></svg>`,
    effects:[['daejeon_growth','대전','도시 위상 상승',62,35],['gongju_decline','공주','상대적 쇠퇴',28,61]],
    causes:[['rail_hub','철도 분기점','대전'],['admin_move','충남도청 이전','1932']],
    sources:stage===0?[sourceCard('1933년의 대전 기록','자료는 대전이 한적한 촌이었으나 경부선 역 설치 뒤 대전이라 불리게 되었다고 전합니다.','S02 · 『충남산업지』(1933), 대전광역시 인용')]:[
      sourceCard('1933년의 대전 기록','자료는 대전이 한적한 촌이었으나 경부선 역 설치 뒤 대전이라 불리게 되었다고 전합니다.','S02 · 『충남산업지』(1933), 대전광역시 인용'),
      sourceCard('T1 · 세 시점 연표',`<div class="timeline"><div class="time-row"><b>1905</b><span>대전역 개통</span></div><div class="time-row"><b>1913</b><span>호남선 분기</span></div><div class="time-row"><b>1932</b><span>충남도청 공주→대전 이전</span></div></div>`,'S03+S04 조합 카드. 이 연표가 직접 말하는 것은 철도 개통과 도청 이전이 즉시 연쇄적으로 일어난 것은 아니라는 점까지입니다.',true)
    ],
    action:renderCase1Actions()
  };
  if(caseId==='case2'){
    const sources=[];
    if(stage===0) sources.push(sourceCard('이리의 짧은 연표','1912년 호남선 개통과 함께 이리역이 개설됐고, 1917년 이리는 지정면이 되었습니다.','S06·S07 · 문화도시익산'));
    if(stage>=1) sources.push(sourceCard('나주에서 깨지는 규칙','호남선은 나주를 지났다. 그러나 교과서는 나주를 상대적 쇠퇴 사례로 듭니다.','S10a·S10b · 교과서 48쪽 + 호남선 통과 사실',stage===1));
    if(stage>=2) sources.push(sourceCard('1896년 행정 기능 변화','전남 관찰부가 광주에 설치되었고, 광주는 전남의 행정 중심 도시가 되었습니다.','S09a·S09b · 한국민족문화대백과사전·디지털광주문화대전·광주 동구',stage===2));
    if(stage>=3) sources.push(sourceCard('영산포의 별도 성장 양상','영산포에는 동양척식주식회사가 설치되고 일본인이 유입되어 경제적 주도권을 쥐었습니다.','S16 · 국가유산청',stage===3));
    return{
      title:stage===0?'호남 약도 · 먼저 이리':'호남 약도 · 나주 / 광주 / 영산포',
      map:`<svg class="map-bg" viewBox="0 0 760 500" aria-hidden="true"><path class="region-fill" d="M70 75 Q280 40 560 85 L690 208 Q650 350 566 436 Q360 470 105 420Z"/><path class="geo rail" d="M315 70 C330 158 336 255 330 420"/><path class="geo" d="M250 320 C335 345 410 350 515 385"/><text x="350" y="105" fill="#777168" font-size="15">호남선</text><text x="455" y="405" fill="#777168" font-size="14">영산강</text></svg>`,
      effects:[['iri_growth','이리','새 중심지 형성',42,23],['naju_change','나주읍','상대적 위상 변화',44,63],['gwangju_node','광주','전남 행정 중심',65,48],['yeongsanpo_growth','영산포','별도 성장 양상',57,78]],
      causes:[['rail','철도','앞 사례에서 이어 온 카드'],['gwancharbu','전남 관찰부의 광주 설치','1896'],['gwangju_admin','광주의 행정 중심 기능','나주와의 관계는 별도 판단'],['dongcheok','동척 설치·일본인 유입','영산포']],
      sources,action:renderCase2Actions()
    }
  }
  const sources=[];
  if(stage>=1)sources.push(sourceCard('1897년 10월 1일','목포가 개항했습니다.','S11 · 목포시',stage===1));
  if(stage>=2)sources.push(sourceCard('1914년 철도 도착','호남선 전 구간이 개통되어 대전과 목포가 철도로 연결됐습니다.','S13 · 목포시. 개통 사실만 말하며 성장 기여도는 말하지 않습니다.',stage===2));
  if(stage>=3)sources.push(sourceCard('1932년의 목포','무안군 일부를 편입한 목포는 인구 6만으로 전국 6대 도시 가운데 하나가 되었습니다.','S14 · 목포시. 국세조사 원자료는 미대조.',stage===3));
  return{
    title:'전남 서남 해안 약도 · 목포',
    map:`<svg class="map-bg" viewBox="0 0 760 500" aria-hidden="true"><path class="region-fill" d="M80 65 L590 80 Q625 120 610 170 Q675 210 632 255 Q694 306 642 346 Q590 390 560 452 L120 445 Q75 360 95 285 Q52 220 92 170Z"/><path class="geo coast" d="M590 80 Q625 120 610 170 Q675 210 632 255 Q694 306 642 346 Q590 390 560 452"/><path class="geo rail" d="M170 110 C300 190 410 250 570 330"/><path d="M590 304 l38 0 l-6 22 l-38 0Z" fill="#d8d1c6" stroke="#9b958c" stroke-width="2"/><text x="614" y="297" fill="#777168" font-size="14">항만</text><text x="260" y="170" fill="#777168" font-size="15">호남선</text></svg>`,
    effects:[['mokpo_start','목포','성장 시작',70,52],['mokpo_later','목포','1932 대도시 위상',60,74]],
    causes:[['rail','철도','앞 사례에서 가져온 카드'],['port','목포 개항','1897']],
    sources,action:renderCase3Actions()
  }
}

function renderCase(caseId){
  const mount=document.getElementById({case1:'case1Mount',case2:'case2Mount',case3:'case3Mount'}[caseId]);if(!mount)return;
  const c=S.cases[caseId],cfg=caseConfig(caseId);
  const links=c.links.filter(l=>l.status!=='withdrawn').length,holds=c.links.filter(l=>l.status==='hold').length;
  mount.innerHTML=`<div class="case-layout" id="${caseId}Layout">
    <section class="board" id="${caseId}Board"><div class="board-head"><h3>${cfg.title}</h3><span class="statusbar">연결 ${links}개 · 유보 ${holds}개</span></div>${cfg.map}
      ${cfg.effects.map(([id,label,sub,x,y])=>`<button type="button" class="effect-node ${effectAvailable(caseId,id,c.stage)?'':'locked'}" data-effect="${id}" style="left:${x}%;top:${y}%" ${effectAvailable(caseId,id,c.stage)?'':'disabled'}>${label}<small>${sub}</small></button>`).join('')}
      <div class="mobile-links" style="position:absolute;left:12px;right:12px;bottom:12px;background:#fffdf9;border:1px solid var(--line);border-radius:10px;padding:9px;font-size:12px;color:var(--muted)">${mobileLinkText(caseId)}</div>
    </section>
    <aside class="drawer"><div class="drawer-section"><div class="drawer-title">원인 카드</div><div class="cause-list">${cfg.causes.map(([id,label,sub])=>`<button type="button" class="cause-chip ${c.pendingCause===id?'selected':''} ${!causeAvailable(caseId,id,c.stage)?'locked':''} ${id==='rail'&&caseId==='case3'?'carry':''}" data-cause="${id}" ${causeAvailable(caseId,id,c.stage)?'':'disabled'}>${label}<small>${sub}</small></button>`).join('')}</div></div>
      <div class="drawer-section"><div class="drawer-title">도착한 자료</div><div class="source-list">${cfg.sources.join('')}</div></div>
      <div class="case-actions">${cfg.action}</div>
    </aside><svg class="link-layer" id="${caseId}Links" aria-hidden="true"></svg><div id="${caseId}Labels"></div></div>`;
  mount.querySelectorAll('[data-cause]').forEach(b=>b.onclick=()=>selectCause(caseId,b.dataset.cause));
  mount.querySelectorAll('[data-effect]').forEach(b=>b.onclick=()=>connect(caseId,b.dataset.effect));
  bindCaseActionButtons(caseId);requestAnimationFrame(()=>drawLinks(caseId));
}
function mobileLinkText(caseId){
  const ls=S.cases[caseId].links.filter(l=>l.status!=='withdrawn');if(!ls.length)return '아직 만든 인과 연결이 없습니다.';
  return ls.map(l=>`${LABELS[l.cause]} → ${LABELS[l.effect]} · ${STATUS_LABEL[l.status]} · ${l.timeScope}`).join('<br>');
}
function drawLinks(caseId){
  const layout=document.getElementById(`${caseId}Layout`),svg=document.getElementById(`${caseId}Links`),labels=document.getElementById(`${caseId}Labels`);if(!layout||!svg||!labels)return;
  const rect=layout.getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${rect.width} ${rect.height}`);svg.setAttribute('width',rect.width);svg.setAttribute('height',rect.height);svg.innerHTML='';labels.innerHTML='';
  for(const l of S.cases[caseId].links){
    const src=layout.querySelector(`[data-cause="${l.cause}"]`),dst=layout.querySelector(`[data-effect="${l.effect}"]`);if(!src||!dst)continue;
    const a=src.getBoundingClientRect(),b=dst.getBoundingClientRect();const x1=a.left-rect.left+2,y1=a.top-rect.top+a.height/2,x2=b.right-rect.left-2,y2=b.top-rect.top+b.height/2;const bend=Math.max(60,Math.abs(x1-x2)*.38);const d=`M ${x1} ${y1} C ${x1-bend} ${y1}, ${x2+bend} ${y2}, ${x2} ${y2}`;
    const ns='http://www.w3.org/2000/svg';const hit=document.createElementNS(ns,'path');hit.setAttribute('d',d);hit.setAttribute('class','link-hit');hit.dataset.link=l.id;svg.append(hit);const path=document.createElementNS(ns,'path');path.setAttribute('d',d);path.setAttribute('class',`link-path ${l.directness==='unspoken'?'unspoken':''} ${l.status==='hold'?'hold':''} ${l.status==='withdrawn'?'withdrawn':''}`);path.dataset.link=l.id;svg.append(path);
    [hit,path].forEach(el=>el.addEventListener('click',()=>openLinkDialog(caseId,l.id)));
    const div=document.createElement('button');div.type='button';div.className=`link-label ${l.directness==='unspoken'?'unspoken':''} ${l.status==='hold'?'hold':''} ${l.status==='withdrawn'?'withdrawn':''}`;div.style.left=`${(x1+x2)/2}px`;div.style.top=`${(y1+y2)/2}px`;div.innerHTML=`<span class="badge">${l.directness==='direct'?DIRECT_BADGE:UNSPOKEN_BADGE}</span><span class="time">${l.timeScope}</span>`;div.onclick=()=>openLinkDialog(caseId,l.id);labels.append(div);
  }
}
window.addEventListener('resize',()=>{if(S.scene>=3&&S.scene<=5)requestAnimationFrame(()=>drawLinks(`case${S.scene-2}`))});

function openLinkDialog(caseId,linkId){
  const l=S.cases[caseId].links.find(x=>x.id===linkId);if(!l)return;const dlg=document.getElementById('linkDialog');dlg.dataset.caseId=caseId;dlg.dataset.linkId=linkId;
  document.getElementById('dialogTitle').textContent=`${LABELS[l.cause]} → ${LABELS[l.effect]}`;
  document.getElementById('dialogMeta').innerHTML=`현재 상태: <strong>${STATUS_LABEL[l.status]}</strong><br>${l.directness==='direct'?DIRECT_BADGE:UNSPOKEN_BADGE} · 자료 ${l.evidence.length?l.evidence.join(', '):'아직 없음'} · 시기 ${l.timeScope}`;
  const actions=[];
  if(l.status!=='confirmed') actions.push(`<button class="btn" data-dialog-action="keep">이 설명을 유지한다</button>`);
  actions.push(`<button class="btn" data-dialog-action="add">다른 원인을 추가한다</button>`);
  if(l.status!=='hold') actions.push(`<button class="btn" data-dialog-action="hold">아직 판단하지 않는다</button>`);
  if(l.status!=='withdrawn') actions.push(`<button class="btn" data-dialog-action="withdraw">이 연결을 내 설명에서 철회한다</button>`);
  document.getElementById('dialogActions').innerHTML=actions.join('');
  document.getElementById('dialogActions').querySelectorAll('[data-dialog-action]').forEach(b=>b.onclick=()=>{
    const a=b.dataset.dialogAction;if(a==='keep')updateLink(caseId,linkId,{status:l.directness==='direct'?'confirmed':'hypothesis'});if(a==='hold')updateLink(caseId,linkId,{status:'hold'});if(a==='withdraw')updateLink(caseId,linkId,{status:'withdrawn'});dlg.close();if(a==='add'){S.cases[caseId].pendingCause='';save();renderCase(caseId)}
  });
  if(!dlg.open)dlg.showModal();
}
document.getElementById('closeDialog').onclick=()=>document.getElementById('linkDialog').close();

function renderCase1Actions(){
  const c=S.cases.case1;if(c.stage===0)return `<div class="action-note">첫 설명을 남긴 뒤 시점 자료를 엽니다. 연결을 만들지 않고 유보해도 됩니다.</div><div class="action-buttons"><button class="btn" data-act="c1keep">이 설명을 유지하고 연표를 더 본다</button><button class="btn" data-act="c1hold">판단을 유보하고 연표를 더 본다</button></div>`;
  return `<div class="action-note">연표는 철도 개통과 도청 이전이 즉시 연쇄가 아니었음을 보여줍니다. 두 변화의 관계 자체는 확정하지 않습니다.</div><div class="action-buttons"><button class="btn primary" data-act="c1finish">현재 모델로 첫 사례를 마친다</button></div>`;
}
function renderCase2Actions(){
  const c=S.cases.case2;
  if(c.stage===0)return `<div class="action-note">이리에서 만든 설명을 그대로 나주에 가져가 볼 수 있습니다.</div><div class="action-buttons"><button class="btn" data-act="c2iriKeep">이 설명으로 나주를 살펴본다</button><button class="btn" data-act="c2iriHold">판단을 유보하고 나주를 살펴본다</button></div>`;
  if(c.stage===1)return `<div class="action-note">호남선 통과와 상대적 쇠퇴를 함께 본 뒤, 지금의 모델을 제출합니다.</div><div class="action-buttons"><button class="btn" data-act="c2najuKeep">이 설명을 유지하고 자료를 더 본다</button><button class="btn" data-act="c2najuHold">판단을 유보하고 자료를 더 본다</button></div>`;
  if(c.stage===2)return `<div class="action-note">광주가 행정 중심이 된 사실과 나주의 변화 사이 연결은 자료에 직접 진술되어 있지 않습니다.</div><div class="action-buttons"><button class="btn" data-act="c2adminKeep">이 설명을 유지하고 자료를 더 본다</button><button class="btn" data-act="c2adminHold">판단을 유보하고 자료를 더 본다</button></div>`;
  return `<div class="action-note">영산포의 별도 성장 양상을 모델에 추가할지 판단한 뒤 사례를 마칩니다.</div><div class="action-buttons"><button class="btn primary" data-act="c2finish">현재 모델로 두 번째 사례를 마친다</button></div>`;
}
function renderCase3Actions(){
  const c=S.cases.case3;
  if(c.stage===0)return `<div class="action-note">철도 카드를 연결해도 되고, 처음부터 판단을 유보해도 됩니다.</div><div class="action-buttons"><button class="btn" data-act="c3entryKeep">이 설명을 유지하고 자료를 더 본다</button><button class="btn" data-act="c3entryHold">판단을 유보하고 자료를 더 본다</button></div>`;
  if(c.stage===1)return `<div class="action-note">개항 시점을 모델에 반영한 뒤 철도 도착 시점을 확인합니다.</div><div class="action-buttons"><button class="btn" data-act="c3timeline">현재 모델로 시기 자료를 더 본다</button></div>`;
  if(c.stage===2)return `<div class="action-note">철도 개통은 확인되지만 성장 기여도는 이 자료가 직접 말하지 않습니다. 선을 탭해 유지·유보·철회를 정할 수 있습니다.</div><div class="action-buttons"><button class="btn" data-act="c3result">현재 상태로 결과 자료를 확인한다</button></div>`;
  return `<div class="action-note">1932년 결과까지 확인했습니다. 학생의 현재 모델을 그대로 보존합니다.</div><div class="action-buttons"><button class="btn primary" data-act="c3finish">현재 모델로 세 번째 사례를 마친다</button></div>`;
}
function bindCaseActionButtons(caseId){document.getElementById(`${caseId}Mount`)?.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>handleCaseAction(b.dataset.act))}
function handleCaseAction(act){
  if(act==='c1keep'||act==='c1hold'){S.cases.case1.relationHold=act==='c1hold';S.cases.case1.stage=1;save();renderCase('case1');return}
  if(act==='c1finish'){stopTimer('case1','case1');finalizeCase('case1');showScene(4);return}
  if(act==='c2iriKeep'||act==='c2iriHold'){if(act==='c2iriHold'){const l=findLink('case2','rail','iri_growth');if(l)l.status='hold'}S.cases.case2.stage=1;save();renderCase('case2');return}
  if(act==='c2najuKeep'||act==='c2najuHold'){const l=findLink('case2','rail','naju_change');if(l&&act==='c2najuHold')l.status='hold';S.cases.case2.najuHold=act==='c2najuHold'&&!l;S.cases.case2.stage=2;save();renderCase('case2');return}
  if(act==='c2adminKeep'||act==='c2adminHold'){
    const l=findLink('case2','gwangju_admin','naju_change');if(l)l.status=act==='c2adminHold'?'hold':'hypothesis';else if(act==='c2adminHold')S.cases.case2.najuHold=true;
    S.cases.case2.stage=3;save();renderCase('case2');return
  }
  if(act==='c2finish'){stopTimer('case2','case2');finalizeCase('case2');showScene(5);return}
  if(act==='c3entryKeep'||act==='c3entryHold'){
    const l=findLink('case3','rail','mokpo_later');if(l&&act==='c3entryHold')l.status='hold';S.cases.case3.entryHold=act==='c3entryHold'&&!l;S.cases.case3.stage=1;save();renderCase('case3');return
  }
  if(act==='c3timeline'){S.cases.case3.stage=2;const l=findLink('case3','rail','mokpo_later');if(l){l.status='hold';l.evidence=['S13'];l.timeScope='1914~';l.directness='unspoken'}save();renderCase('case3');return}
  if(act==='c3result'){S.cases.case3.stage=3;save();renderCase('case3');return}
  if(act==='c3finish'){stopTimer('case3','case3');finalizeCase('case3');showScene(6)}
}
