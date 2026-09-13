window.__GAME_AUDIT__={game:'cityshift',table:'game_results',method:'POST',choices:true,classQuery:'URLSearchParams class',timestamp:'toISOString'};
window.GAME_CONFIG={game_id:'cityshift',title:'도시의 자리',version:'1.0'};
window.CHARLIE_CONFIG={supabaseUrl:'https://xgniwztlrakkrbzcfklb.supabase.co',supabasePublishableKey:'sb_publishable_mYZObIGh4nOLKqfnjXHsow_eIARb5U9'};
const GAME_ID='cityshift';
const PARAMS=new URLSearchParams(location.search);
const CLASS=(PARAMS.get('class')||'미입력').slice(0,40);
const STORAGE_KEY='cityshift_v1_state';
const STATUS_LABEL={hypothesis:'가설',confirmed:'근거확인',hold:'유보',withdrawn:'철회'};
const STATUS_SAVE={hypothesis:'가설',confirmed:'근거확인',hold:'유보',withdrawn:'철회'};
const LABELS={
  rail_hub:'철도 분기점',rail_bypass:'경부선 노선에서 벗어남',admin_move:'충남도청 이전',
  daejeon_growth:'대전의 도시 위상 상승',gongju_decline:'공주의 상대적 쇠퇴',
  rail:'철도',iri_growth:'이리의 새 중심지 형성',naju_change:'나주의 상대적 위상 변화',
  gwancharbu:'전남 관찰부의 광주 설치',gwangju_admin:'광주의 행정 중심 기능',gwangju_node:'광주가 전남 행정 중심이 됨',
  dongcheok:'동척 설치·일본인 유입',yeongsanpo_growth:'영산포의 별도 성장 양상',
  port:'목포 개항',mokpo_start:'목포 성장 시작',mokpo_later:'1932년 목포의 대도시 위상'
};
const DIRECT_BADGE='자료에 연결이 명시됨';
const UNSPOKEN_BADGE='연결은 자료에 미진술';

function newId(prefix='id'){
  if(globalThis.crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
function blankState(){return{
  version:'1.0',scene:1,resultId:newId('cityshift'),submittedAt:'',submitError:'',completedAt:'',
  initialPrediction:'',initialReason:'',finalModel:'',postInquiry:'',
  caseStarts:{},durations:{case1:0,case2:0,case3:0},
  cases:{
    case1:{stage:0,pendingCause:'',links:[],relationHold:false,summary:''},
    case2:{stage:0,pendingCause:'',links:[],najuHold:false,summary:''},
    case3:{stage:0,pendingCause:'',links:[],entryHold:false,summary:''}
  }
}}
let S=blankState();
function load(){try{const raw=sessionStorage.getItem(STORAGE_KEY);if(raw)S=Object.assign(blankState(),JSON.parse(raw))}catch(e){console.warn('state load failed',e)}}
function save(){try{sessionStorage.setItem(STORAGE_KEY,JSON.stringify(S))}catch(e){console.warn('state save failed',e)}}
function now(){return Date.now()}
function startTimer(key){if(!S.caseStarts[key]){S.caseStarts[key]=now();save()}}
function stopTimer(key,durKey){if(S.caseStarts[key]){S.durations[durKey]=(S.durations[durKey]||0)+Math.max(0,now()-S.caseStarts[key]);delete S.caseStarts[key];save()}}

const SCENE_NAMES=['첫 판단','무대 공개','대전·공주','이리·나주','목포','세 사례 대조','설명 다시 쓰기'];
function renderProgress(){const root=document.getElementById('progress');root.innerHTML=SCENE_NAMES.map((x,i)=>`<span class="step ${i+1===S.scene?'on':i+1<S.scene?'done':''}">${i+1}. ${x}</span>`).join('')}
function showScene(n){S.scene=n;save();document.querySelectorAll('.scene').forEach(el=>el.classList.toggle('on',Number(el.dataset.scene)===n));renderProgress();if(n===3){startTimer('case1');renderCase('case1')}if(n===4){startTimer('case2');renderCase('case2')}if(n===5){startTimer('case3');renderCase('case3')}if(n===6)renderCompare();if(n===7)renderFinal();window.scrollTo({top:0,behavior:'smooth'})}

function directnessFor(caseId,cause,effect){
  const key=`${cause}>${effect}`;
  const maps={
    case1:{'rail_hub>daejeon_growth':'direct','rail_bypass>gongju_decline':'direct','admin_move>daejeon_growth':'unspoken','admin_move>gongju_decline':'unspoken'},
    case2:{'rail>iri_growth':'direct','rail>naju_change':'unspoken','gwancharbu>gwangju_node':'direct','gwangju_admin>naju_change':'unspoken','dongcheok>yeongsanpo_growth':'direct'},
    case3:{'rail>mokpo_later':'unspoken','port>mokpo_start':'direct'}
  };
  return maps[caseId]?.[key]||'unspoken';
}
function evidenceFor(caseId,cause,effect,stage){
  const key=`${cause}>${effect}`;
  const maps={
    case1:{'rail_hub>daejeon_growth':['S01','S02','S03'],'rail_bypass>gongju_decline':['S01'],'admin_move>daejeon_growth':['S04'],'admin_move>gongju_decline':['S04']},
    case2:{'rail>iri_growth':['S06','S07'],'rail>naju_change':['S10a','S10b'],'gwancharbu>gwangju_node':['S09a','S09b'],'gwangju_admin>naju_change':['S09a','S09b'],'dongcheok>yeongsanpo_growth':['S16']},
    case3:{'rail>mokpo_later':stage>=2?['S13']:[],'port>mokpo_start':['S11']}
  };
  return maps[caseId]?.[key]||[];
}
function timeFor(caseId,cause,effect,stage){
  const key=`${cause}>${effect}`;
  const maps={
    case1:{'rail_hub>daejeon_growth':'1905~','rail_bypass>gongju_decline':'1905~','admin_move>daejeon_growth':'1932~','admin_move>gongju_decline':'1932~'},
    case2:{'rail>iri_growth':'1912~','rail>naju_change':'1912~','gwancharbu>gwangju_node':'1896~','gwangju_admin>naju_change':'미상','dongcheok>yeongsanpo_growth':'미상'},
    case3:{'rail>mokpo_later':stage>=2?'1914~':'미상','port>mokpo_start':'1897~'}
  };
  return maps[caseId]?.[key]||'미상';
}
function defaultStatus(caseId,cause,effect,stage){
  if(caseId==='case3'&&cause==='rail') return stage>=2?'hold':'hypothesis';
  return directnessFor(caseId,cause,effect)==='direct'?'confirmed':'hypothesis';
}
function allowedTargets(caseId,cause,stage){
  const maps={
    case1:{rail_hub:['daejeon_growth'],rail_bypass:['gongju_decline'],admin_move:['daejeon_growth','gongju_decline']},
    case2:{rail:stage===0?['iri_growth']:['naju_change'],gwancharbu:['gwangju_node'],gwangju_admin:['naju_change'],dongcheok:['yeongsanpo_growth']},
    case3:{rail:['mokpo_later'],port:['mokpo_start']}
  };
  return maps[caseId]?.[cause]||[];
}
function causeAvailable(caseId,cause,stage){
  if(caseId==='case1')return cause!=='admin_move'||stage>=1;
  if(caseId==='case2'){
    if(cause==='rail')return true;
    if(cause==='gwancharbu')return stage>=2;
    if(cause==='gwangju_admin')return stage>=2;
    if(cause==='dongcheok')return stage>=3;
  }
  if(caseId==='case3')return cause!=='port'||stage>=1;
  return false;
}
function effectAvailable(caseId,effect,stage){
  if(caseId==='case1')return true;
  if(caseId==='case2'){
    if(effect==='iri_growth')return stage===0;
    if(effect==='naju_change')return stage>=1;
    if(effect==='gwangju_node')return stage>=2;
    if(effect==='yeongsanpo_growth')return stage>=3;
  }
  if(caseId==='case3')return effect==='mokpo_later'||(effect==='mokpo_start'&&stage>=1);
  return false;
}
function selectCause(caseId,cause){
  const c=S.cases[caseId]; if(!causeAvailable(caseId,cause,c.stage))return;
  c.pendingCause=c.pendingCause===cause?'':cause;save();renderCase(caseId);
}
function connect(caseId,effect){
  const c=S.cases[caseId];const cause=c.pendingCause;if(!cause)return;
  if(!allowedTargets(caseId,cause,c.stage).includes(effect)||!effectAvailable(caseId,effect,c.stage))return;
  const existing=c.links.find(l=>l.cause===cause&&l.effect===effect&&l.status!=='withdrawn');
  if(existing){c.pendingCause='';save();openLinkDialog(caseId,existing.id);return}
  const link={id:newId('link'),cause,effect,status:defaultStatus(caseId,cause,effect,c.stage),evidence:evidenceFor(caseId,cause,effect,c.stage),timeScope:timeFor(caseId,cause,effect,c.stage),directness:directnessFor(caseId,cause,effect)};
  c.links.push(link);c.pendingCause='';save();renderCase(caseId);setTimeout(()=>openLinkDialog(caseId,link.id),50);
}
function updateLink(caseId,linkId,patch){const l=S.cases[caseId].links.find(x=>x.id===linkId);if(!l)return;Object.assign(l,patch);save();renderCase(caseId);renderUnresolvedPreview()}
function findLink(caseId,cause,effect){return S.cases[caseId].links.find(l=>l.cause===cause&&l.effect===effect&&l.status!=='withdrawn')}

function sourceCard(title,body,info,isNew=false){return `<article class="source-card ${isNew?'new':''}"><div class="source-title">${title}</div><div class="source-body">${body}</div><details><summary>자료 정보</summary><div>${info}</div></details></article>`}
