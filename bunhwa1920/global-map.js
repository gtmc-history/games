// One topology for S1–S7. Coordinates and relation identifiers never depend on scene.
// Topic enclosures are not historical edges; every solid edge refers to ITEMS or R14.
const V91MapUI={seen:new Set(),fresh:[],selected:null,lastLog:'',lastNoLine:new Set()};
const GLOBAL_NODES=[
  ['nat','민족주의 세력',130,60,['P01']],['goal','민족 해방',390,60,['P01','P02']],['soc','사회주의 세력',650,60,['P02','P03','P05','P06']],
  ['noncoop','비타협적 민족주의 세력',130,165,['R14']],['autonomy','자치 운동',350,165,['R14']],['class','노동자·농민의 계급 해방',820,165,['P03'],'계급 해방'],
  ['imperial','일제',130,280,['P07']],['socmovement','사회주의 운동',320,280,['P07']],
  ['labor','노동 운동',500,280,['P05']],['farmer','농민 운동',660,280,['P05','P06']],['youth','청년 운동',820,280,['P06']],
  ['skill','실력 양성 운동',130,410,['R09','R10']],['industry','민족 산업 육성',70,525,['R09']],['education','교육을 통한 인재 양성',280,525,['R10'],'교육·인재 양성'],
  ['source1','자료 1',520,460,['R11A','R11B']],['source2','자료 2',820,460,['R11C']],
  ['production','조선인의 생산력 발전',430,585,['R11A'],'생산력 발전'],['unity','유산·무산 계급을 막론한 단결',620,585,['R11B'],'유산·무산 단결'],['critique','물산 장려 운동의 계급적 이해관계',820,585,['R11C'],'계급적 이해관계'],
  ['university','민립 대학 설립 운동',130,670,['R12']],['higher','한국인 본위의 고등교육',350,670,['R12'],'한국인 본위 고등교육']
];
const GLOBAL_EDGES=[
  ['P01','nat','goal',260,43],['P02','soc','goal',520,43],['P03','soc','class',770,95],
  ['P05','soc','labor',510,190],['P06','soc','youth',810,215],['P07','imperial','socmovement',240,255],
  ['R09','skill','industry',60,465],['R10','skill','education',250,465],
  ['R11A','source1','production',420,515],['R11B','source1','unity',625,515],['R11C','source2','critique',810,515],
  ['R12','university','higher',240,646],['R14','noncoop','autonomy',240,143]
];
function v91Verified(){return S.submitted||['s7B','finalPrompt','done'].includes(S.screen);}
function v91AcquiredIds(){return [...Object.keys(S.mapState).filter(id=>S.mapState[id]),...(v91Verified()?['R14']:[])];}
function v91MapPrepare(){
  const ids=v91AcquiredIds();V91MapUI.fresh=ids.filter(id=>!V91MapUI.seen.has(id));
  if(V91MapUI.fresh.length)V91MapUI.lastLog=`새 관계 기록 · ${V91MapUI.fresh.map(id=>id==='R14'?'비타협적 민족주의 세력 → 자치 운동':`${ITEMS[id].relation[0]} → ${ITEMS[id].relation[2]}`).join(' / ')}`;
  const held=Object.keys(S.noLineState).filter(id=>!V91MapUI.lastNoLine.has(id));
  if(held.length)V91MapUI.lastLog='보류 기록 · 현재 자료로 확인되지 않아 선을 긋지 않습니다.';
  V91MapUI.seen=new Set(ids);V91MapUI.lastNoLine=new Set(Object.keys(S.noLineState));
}
function v91MapScene(){return ['finalPrompt','done'].includes(S.screen)?'S7':v7SceneKey(S.screen);}
function GlobalMap({large=false}={}){
  const acquired=new Set(v91AcquiredIds()),scene=v91MapScene(),fresh=new Set(V91MapUI.fresh);
  const current=id=>id==='R14'?scene==='S7':ITEMS[id]?.scene===scene;
  const count=Object.values(S.evidenceState).filter(t=>t.completed).length;
  const positions=Object.fromEntries(GLOBAL_NODES.map(n=>[n[0],n]));
  const edgeHtml=GLOBAL_EDGES.filter(([id])=>acquired.has(id)).map(([id,from,to,lx,ly])=>{
    const a=positions[from],b=positions[to],dx=b[2]-a[2],dy=b[3]-a[3];
    const path=id==='P06'?'M 650 60 C 650 150, 700 205, 820 280':`M ${a[2]} ${a[3]} C ${a[2]+dx*.25} ${a[3]+dy*.6}, ${b[2]-dx*.25} ${b[3]-dy*.6}, ${b[2]} ${b[3]}`;
    return `<g class="gm-edge ${current(id)?'current':'past'} ${fresh.has(id)?'new':''} ${id==='R14'?'verified':''}" data-relation="${id}"><path class="gm-stroke" pathLength="1" d="${path}"/><path class="gm-hit" d="${path}" role="button" tabindex="0" aria-label="${esc(id==='R14'?'검증 자료 · 비타협적 민족주의 세력 — 비판·경계 — 자치 운동':ITEMS[id].relation.join(' — '))}" onclick="v91Inspect('${id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();v91Inspect('${id}')}"/></g>`;
  }).join('');
  const labels=GLOBAL_EDGES.filter(([id])=>acquired.has(id)).map(([id,,,x,y])=>`<button class="gm-edge-label ${current(id)?'current':'past'}" style="left:${x/9}%;top:${y/7.2}%" onclick="v91Inspect('${id}')">${esc(id==='R14'?'비판·경계':ITEMS[id].relation[1])}</button>`).join('');
  const nodes=GLOBAL_NODES.filter(n=>n[4].some(id=>acquired.has(id))||(S.screen!=='s1'&&['nat','goal','soc'].includes(n[0]))).map(n=>{
    const ids=n[4].filter(id=>acquired.has(id)),isNew=ids.some(id=>fresh.has(id));
    return `<button class="gm-node ${ids.length?ids.some(current)?'current':'past':'pending'} ${isNew?'new':''} ${n[0]==='farmer'?'context-node':''}" data-node="${n[0]}" style="left:${n[2]/9}%;top:${n[3]/7.2}%" ${ids.length?`onclick="v91Inspect('${n[0]==='farmer'?'farmer':ids[0]}')"`:'disabled'} title="${esc(n[1])}"><span class="gm-full-label">${esc(n[1])}</span><span class="gm-short-label">${esc(n[5]||n[1])}</span></button>`;
  }).join('');
  const mass=acquired.has('P05')||acquired.has('P06'),goods=['R11A','R11B','R11C'].some(id=>acquired.has(id));
  return `<aside class="global-map ${large?'large':'compact'}" data-global-map="v9.1" aria-label="나의 조사 지도"><header class="gm-header"><div><span class="v9-kicker">GLOBAL LIVE MAP</span><h2>나의 조사 지도</h2></div><strong><small class="gm-progress-label">근거</small> ${count}/7</strong></header><div class="gm-canvas"><svg class="gm-lines" viewBox="0 0 900 720" preserveAspectRatio="none" aria-label="확보한 역사 관계">${edgeHtml}</svg>${mass?'<div class="gm-topic gm-mass"><span>대중 운동</span><small>농민 운동 · 자료에 함께 제시됨</small></div>':''}${goods?'<div class="gm-topic gm-goods"><span>물산 장려 운동 · 두 글의 주장</span></div>':''}${nodes}${labels}${S.screen==='s1'&&count===0?'<div class="gm-waiting"><span>조사 대기 중</span><p>자료를 조사하면 이곳에<br>나의 기록이 쌓입니다.</p></div>':''}${scene==='S7'&&!v91Verified()?'<div class="gm-final-pending">마지막 조사 대기 · 검증 자료</div>':''}</div><footer class="gm-footer"><div class="gm-legend">밝은 선 · 현재 조사　<span>낮은 명도 · 이전 기록</span></div><div class="gm-log" role="status" aria-live="polite">${count===7&&scene==='S6'?'7번째 근거 확보 — 지도를 완성할 준비가 되었습니다.':esc(V91MapUI.lastLog||'자료에서 근거를 찾으면 첫 관계가 연결됩니다.')}</div>${!large?'<button class="gm-expand" onclick="v91ExpandMap()">전체 지도 크게 보기 ↗</button>':''}</footer></aside>`;
}
function v91InspectorHtml(id){
  if(id==='farmer')return '<h2>농민 운동</h2><p>농민 운동 · 자료에 함께 제시됨</p>'+sourceBox('S3','교과서 41쪽',{anchors:[EVIDENCE_TASKS.E02_S3_MASS.correct]})+scopeBadgeHtml(true);
  if(id==='R14')return `<h2>검증 자료로 보완된 관계</h2><p class="gm-inspect-relation">비타협적 민족주의 세력 → 비판·경계 → 자치 운동</p><p>검증 자료 · 「민족적 경륜」</p>${sourceBox('S7B','《동아일보》, 1924. 1. 3.')}${branchBlock()}<p class="hint">자료에서 직접 확인한 관계와 구분해 검증 자료로 보완된 관계를 표시합니다.</p>`;
  const item=ITEMS[id];if(!item)return '<h2>근거 확인</h2><p>지도에서 노드나 관계선을 눌러 기록을 확인하세요.</p>';
  const task=Object.values(EVIDENCE_TASKS).find(t=>t.relations.includes(id));
  const held=!!S.noLineState[id];
  return `<h2>관계의 근거</h2><p class="gm-inspect-relation">${item.relation.map(esc).join(' → ')}</p><p class="gm-kind">${held?'보류 · 현재 근거 없음':'직접 진술'}</p>${S.judgmentState[id]!==undefined?`<div class="judgment-separation"><p><b>내 선택</b> ${LABEL[S.judgmentState[id]]}</p><p><b>자료 판정</b> ${LABEL[EXPECTED[id]]}</p></div>`:''}${sourceBox(item.source,item.sourceLabel,{anchors:task?[task.correct]:item.anchors,focus:item.focus,context:item.context})}${['P05','P06'].includes(id)?scopeBadgeHtml(true):''}${id==='P07'?'<p class="result-note">이 선은 치안유지법이 사회주의 운동 탄압에 사용되었다는 관계를 보여줍니다. 치안유지법의 적용 대상이 사회주의에만 한정되었다는 뜻은 아닙니다.</p>':''}${held?`<p>${esc(feedbackFor(id,S.judgmentState[id]).text)}</p>`:''}`;
}
function v91Inspect(id){
  V91MapUI.selected=id;
  const edge=GLOBAL_EDGES.find(e=>e[0]===id),ends=edge?edge.slice(1,3):[];
  document.querySelectorAll('.gm-edge').forEach(n=>n.classList.toggle('selected',n.dataset.relation===id));
  document.querySelectorAll('.gm-node').forEach(n=>n.classList.toggle('selected',ends.includes(n.dataset.node)||id==='farmer'&&n.dataset.node==='farmer'));
  const target=document.getElementById('globalInspector');
  if(target){target.innerHTML=v91InspectorHtml(id);target.hidden=false;document.getElementById('finalForm')?.setAttribute('hidden','');const back=document.getElementById('inspectorBack');if(back)back.hidden=false;target.scrollTop=0;return;}
  const dialog=document.createElement('dialog');dialog.className='v9-dialog gm-inspector-dialog';dialog.innerHTML=`<button onclick="this.closest('dialog').close()">닫기</button>${v91InspectorHtml(id)}`;document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove());dialog.showModal();
}
function v91ReturnToForm(){document.getElementById('globalInspector').hidden=true;document.getElementById('finalForm').hidden=false;document.getElementById('inspectorBack').hidden=true;}
function v91ExpandMap(){
  const dialog=document.createElement('dialog');dialog.className='gm-map-dialog';dialog.innerHTML=`<button class="gm-close" onclick="this.closest('dialog').close()">닫기</button>${GlobalMap({large:true})}`;document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove());dialog.showModal();
}
