// Browser checkpoint only. This module never sends a result to a server.
const V91_PROGRESS_SCHEMA=1;
let v91InitialState;
function v91StorageKey(){return `bunhwa1920:progress:v9.1:${classParam()||'default'}`;}
function v91Initialize(){v91InitialState=structuredClone(S);}
function v91Notice(text,error=false){
  let n=document.getElementById('progressNotice');
  if(!n){n=document.createElement('div');n.id='progressNotice';n.role='status';n.setAttribute('aria-live','polite');document.body.append(n);}
  n.textContent=text;n.className=error?'error':'';n.hidden=false;
  clearTimeout(v91Notice.timer);v91Notice.timer=setTimeout(()=>n.hidden=true,2000);
}
function v91ReadProgress(){
  try{
    const raw=localStorage.getItem(v91StorageKey());if(!raw)return null;
    const record=JSON.parse(raw),state=record.state;
    const screens=['s1',...Object.keys(EVIDENCE_TASKS),...STRENGTH_JUDGMENTS,'foldS3','foldS4','s5Discover','s5Reveal','foldS5','s6Reading','foldS6','s7A','s7B','finalPrompt','done'];
    const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
    if(record.schema!==V91_PROGRESS_SCHEMA||record.game_id!=='bunhwa1920'||!object(state)||!screens.includes(state.screen)||typeof state.sessionId!=='string'||!state.sessionId)return null;
    for(const k of ['judgmentState','evidenceState','mapState','noLineState'])if(!object(state[k]))return null;
    if(Object.entries(state.judgmentState).some(([id,v])=>!STRENGTH_JUDGMENTS.includes(id)||!['direct','inference','none'].includes(v)))return null;
    if(Object.entries(state.mapState).some(([id,v])=>!ITEMS[id]||EXPECTED[id]!=='direct'||v!=='direct'))return null;
    if(Object.entries(state.noLineState).some(([id,v])=>EXPECTED[id]!=='none'||v!==true))return null;
    for(const [id,t] of Object.entries(state.evidenceState)){
      if(!EVIDENCE_TASKS[id]||!object(t)||typeof t.completed!=='boolean'||!Number.isInteger(t.attempt_count)||t.attempt_count<0)return null;
      const len=evidenceSegments(SOURCE[EVIDENCE_TASKS[id].source]).length;
      for(const key of ['first_choice','last_choice','correct_index'])if(t[key]!==null&&(!Number.isInteger(t[key])||t[key]<0||t[key]>=len))return null;
    }
    for(const key of ['scopeBadgeIntroSeen','scopeExpanded','s5NoteSeen','finalGoalConfirmed','submitted','finalSubmitted','commentSubmitted'])if(typeof state[key]!=='boolean')return null;
    if(typeof state.finalExplanation!=='string'||state.finalExplanation.length>300||(state.finalSplit!==null&&!FINAL_SPLITS[state.finalSplit]))return null;
    if(state.feedback!==null&&(!object(state.feedback)||typeof state.feedback.title!=='string'||typeof state.feedback.text!=='string'))return null;
    return record;
  }catch{return null;}
}
function v91SaveProgress(){
  const input=document.getElementById('finalText');if(input)S.finalExplanation=input.value;
  const record={schema:V91_PROGRESS_SCHEMA,game_id:'bunhwa1920',presentation_version:'v9.1',saved_at:new Date().toISOString(),state:structuredClone(S),commentDraft:document.getElementById('comment')?.value||''};
  try{localStorage.setItem(v91StorageKey(),JSON.stringify(record));v91Notice('현재 조사 기록을 저장했습니다.');}
  catch{v91Notice('저장하지 못했습니다. 브라우저의 저장 공간 설정을 확인해 주세요.',true);}
}
function v91Resume(){
  const record=v91ReadProgress();if(!record){v91Notice('이어갈 수 있는 저장 기록이 없습니다.',true);return;}
  // Whitelist fields from the initial state, including submission guards and session id.
  for(const key of Object.keys(v91InitialState))S[key]=structuredClone(record.state[key]??v91InitialState[key]);
  V91MapUI.seen=new Set(v91AcquiredIds());V91MapUI.fresh=[];V91MapUI.lastLog='저장한 조사 기록을 복원했습니다.';
  render();const comment=document.getElementById('comment');if(comment)comment.value=record.commentDraft||'';
  v91Notice('저장한 조사 기록을 이어갑니다.');
}
function v91Restart(){
  if(!confirm('처음부터 다시 시작할까요? 저장한 조사 기록과 현재 진행이 삭제됩니다.'))return;
  try{localStorage.removeItem(v91StorageKey());}catch{v91Notice('저장 기록을 삭제하지 못했습니다.',true);return;}
  Object.assign(S,structuredClone(v91InitialState));S.sessionId=crypto.randomUUID();
  V91MapUI.seen=new Set();V91MapUI.fresh=[];V91MapUI.lastLog='';V91MapUI.selected=null;
  render();
}
