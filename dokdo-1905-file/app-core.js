'use strict';
const D=window.DOKDO_DATA;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const GAME=D.gameId, VER=D.version, PARAMS=new URLSearchParams(location.search);
const CLASS=(PARAMS.get('class')||'미입력').slice(0,40);
const SB='https://xgniwztlrakkrbzcfklb.supabase.co';
const KEY='sb_publishable_mYZObIGh4nOLKqfnjXHsow_eIARb5U9';
const SK='dokdo1905_build_v1';

const defaultState=()=>({
  lens:'한국사', phase:'start', scene:0, vn:true,
  initialMarked:'', initialJudgment:'', draftHistory:[],
  evidenceSeen:[], openedOptional:[], hintUsed:[],
  core1905:[], direct1877:false, mapClues:[], outsideOneStatus:'',
  ordSelections:[], seokdoStatus:'추가 근거 필요', seokdoEvidence:[],
  niitakaParts:[], report1906Selections:[], contextRelation:'',
  revisionCount:0, revisionChoice:'', boardLinks:[], selectedExhibitSources:[],
  extractedNotes:[], finalPanel:{title:'',body:'',caution:''},
  resultId:'', completedAt:'', submittedAt:'', submitError:''
});
let S=defaultState();

function load(){
  try{
    const x=JSON.parse(sessionStorage.getItem(SK)||'null');
    if(x&&typeof x==='object') S={...defaultState(),...x,finalPanel:{...defaultState().finalPanel,...(x.finalPanel||{})}};
  }catch{}
}
function save(){try{sessionStorage.setItem(SK,JSON.stringify(S))}catch{}}
function uniqPush(arr,v){if(v&&!arr.includes(v))arr.push(v)}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function sourceName(id){return D.sources[id]?.title||id}
function seen(id){uniqPush(S.evidenceSeen,id);save();renderSide()}
function addNote(text,tag='메모'){
  if(!text)return;
  const k=tag+'|'+text;
  if(!S.extractedNotes.some(n=>n.k===k)) S.extractedNotes.push({k,tag,text});
  save(); renderSide();
}
function progress(n){$('#progressFill').style.width=Math.max(0,Math.min(100,(n/8)*100))+'%'}
function showView(id){['#startView','#storyView','#sceneView','#resultView'].forEach(v=>$(v).hidden=v!==id);scrollTo(0,0)}
function feedback(msg,warn=false){const f=$('#sceneFeedback');f.className='feedback show'+(warn?' warn':'');f.innerHTML=msg}
function clearFeedback(){const f=$('#sceneFeedback');f.className='feedback';f.textContent=''}
function mission(items){return `<strong>이번 장면에서 끝내야 할 일</strong><ol>${items.map(x=>`<li>${x}</li>`).join('')}</ol>`}
function passport(s){return `<div class="passport"><span>${esc(s.date||'')}</span><span>${esc(s.author||'')}</span><span>${esc(s.type||'')}</span></div>`}
function sourceCard(id,{context=true,link=true}={}){
  const s=D.sources[id]; if(!s)return'';
  return `<article class="source-card"><h2>${esc(s.title)}</h2>${passport(s)}${context&&s.context?`<div class="context"><b>왜 이 자료가 만들어졌나?</b>${esc(s.context)}</div>`:''}<div class="reading">${s.paragraphs?s.paragraphs.map(p=>`<p>${esc(p)}</p>`).join(''):`<p>${esc(s.body||'')}</p>`}</div>${s.note?`<div class="terms">${esc(s.note)}</div>`:''}${link&&s.sourceUrl?`<div class="source-link"><a href="${s.sourceUrl}" target="_blank" rel="noopener noreferrer">공식 공개 페이지에서 원문·이미지 확인 ↗</a></div>`:''}</article>`;
}
function openDialog(id){const s=D.sources[id];if(!s)return;seen(id);$('#dialogTitle').textContent=s.title;$('#dialogBody').innerHTML=sourceCard(id);$('#sourceDialog').showModal()}
function archiveCard(id,desc){const opened=S.openedOptional.includes(id);return `<div class="archive-card ${opened?'opened':''}" data-doc="${id}"><h4>${esc(D.sources[id].title)}</h4><p>${esc(desc)}</p><button type="button" data-open="${id}">${opened?'다시 보기':'열람'}</button></div>`}
function bindArchive(onSave){$$('[data-open]').forEach(b=>b.onclick=()=>{const id=b.dataset.open;uniqPush(S.openedOptional,id);seen(id);save();openDialog(id);b.closest('.archive-card')?.classList.add('opened');b.textContent='다시 보기';onSave?.(id)})}
function renderSide(){
  const mem=$('#memoPanel'), seenBox=$('#seenPanel'); if(!mem||!seenBox)return;
  const notes=[];
  if(S.initialMarked) notes.push(`<div class="memo-item"><b>처음 검수:</b><br>${esc(S.initialMarked)}</div>`);
  if(S.outsideOneStatus) notes.push(`<div class="memo-item"><b>1877 메모:</b><br>${esc(S.outsideOneStatus)}</div>`);
  if(S.seokdoStatus) notes.push(`<div class="memo-item ${S.revisionChoice?'updated':''}"><b>1900 석도 메모:</b><br>${esc(S.seokdoStatus)}</div>`);
  if(S.contextRelation) notes.push(`<div class="memo-item"><b>1904~1905 관계:</b><br>${esc(S.contextRelation)}</div>`);
  mem.innerHTML=notes.join('')||'<span class="small">아직 저장된 메모가 없습니다.</span>';
  seenBox.innerHTML=S.evidenceSeen.length?S.evidenceSeen.map(x=>`<span class="seen-chip">${esc(sourceName(x))}</span>`).join(''):'<span class="small">아직 열람한 자료가 없습니다.</span>';
}
function setSceneMeta(i,title,question,items,nextLabel){
  S.scene=i;S.phase='scene';save();showView('#sceneView');progress(i+1);
  $('#sceneIndex').textContent=`SCENE ${i} / 7`;$('#sceneTitle').textContent=title;$('#sceneQuestion').textContent=question;
  $('#sceneMission').innerHTML=mission(items);$('#sceneNext').textContent=nextLabel;$('#sceneNext').disabled=true;clearFeedback();renderSide();
}
function story(key,cb){
  if(!S.vn){cb();return}
  const seq=D.vn[key]||[]; if(!seq.length){cb();return}
  showView('#storyView');let i=0;
  const r=()=>{$('#storySpeaker').textContent=seq[i][0];$('#storyText').textContent=seq[i][1]};r();
  $('#storyNext').onclick=()=>{i++;if(i<seq.length)r();else cb()};
}
