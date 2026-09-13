function finalizeCase(caseId){S.cases[caseId].summary=buildSummary(caseId);save()}
function buildSummary(caseId){
  const links=S.cases[caseId].links.filter(l=>l.status!=='withdrawn');if(!links.length)return '인과 연결을 확정하지 않음 / 판단 유보';
  const pieces=links.slice(0,4).map(l=>`${shortLabel(l.cause)}→${shortEffect(l.effect)} ${l.timeScope!=='미상'?l.timeScope+' ':''}${STATUS_LABEL[l.status]}`);const holds=links.filter(l=>l.status==='hold').length;return `${pieces.join(' / ')} / 유보 ${holds}`
}
function shortLabel(id){const map={rail_hub:'철도',rail_bypass:'철도 제외',admin_move:'행정',rail:'철도',gwancharbu:'관찰부',gwangju_admin:'광주 행정',dongcheok:'영산포·동척',port:'개항'};return map[id]||LABELS[id]||id}
function shortEffect(id){const map={daejeon_growth:'대전 상승',gongju_decline:'공주 쇠퇴',iri_growth:'이리 성장',naju_change:'나주 변화',gwangju_node:'광주 중심',yeongsanpo_growth:'영산포 성장',mokpo_start:'목포 시작',mokpo_later:'목포 대도시'};return map[id]||LABELS[id]||id}
function unresolvedClaims(){
  const out=[];
  const c2=findLink('case2','gwangju_admin','naju_change');if(c2?.status==='hold'||S.cases.case2.najuHold)out.push('관찰부의 광주 설치가 나주의 상대적 위상 변화에 어떤 영향을 주었는가 — 직접 연결 자료 미확보');
  const c3=findLink('case3','rail','mokpo_later');if(c3?.status==='hold'||S.cases.case3.entryHold)out.push('1914년 이후 철도가 목포 성장에 어느 정도 기여했는가 — 직접 연결 자료 미확보');
  const c1=S.cases.case1.links.find(l=>l.cause==='admin_move'&&l.status==='hold');if(c1)out.unshift('1932년 행정 기능 변화가 대전·공주의 위상 변화에 어느 정도 기여했는가 — 직접 연결 자료 미확보');
  return out;
}
function renderUnresolvedPreview(){if(S.scene===7)renderFinal()}

function renderCompare(){
  ['case1','case2','case3'].forEach(finalizeCase);
  const facts={case1:'1905 대전역 개통 · 1913 호남선 분기 · 1932 충남도청 이전',case2:'1912 이리역 개설 · 1896 전남 관찰부 광주 설치 · 영산포의 별도 성장 양상',case3:'1897 목포 개항 · 1914 호남선 전 구간 개통 · 1932 전국 6대 도시'};
  const titles={case1:'대전 / 공주',case2:'이리 / 나주',case3:'목포'};
  document.getElementById('compareGrid').innerHTML=['case1','case2','case3'].map(k=>`<article class="compare-card"><h3>${titles[k]}</h3><div class="model-summary">${escapeHtml(S.cases[k].summary)}</div><div class="fact-summary"><strong>확인된 사실</strong><br>${facts[k]}</div></article>`).join('')
}
function renderFinal(){
  document.getElementById('frozenChoice').textContent=S.initialPrediction==='A'?'조건 A · 오래된 행정 중심지':'조건 B · 장이 서던 작은 마을';document.getElementById('frozenReason').textContent=S.initialReason||'—';const fm=document.getElementById('finalModel');if(fm&&fm.value!==S.finalModel)fm.value=S.finalModel||'';const list=unresolvedClaims();const box=document.getElementById('unresolvedBox');const ul=document.getElementById('unresolvedList');box.style.display=list.length?'block':'none';ul.innerHTML=list.map(x=>`<li>${escapeHtml(x)}</li>`).join('');if(S.completedAt){document.getElementById('postPanel').classList.add('on');document.getElementById('finishCore').disabled=true;document.getElementById('saveStatus').textContent=S.submittedAt?'✓ 결과 기록을 저장했습니다.':S.submitError?'저장에 실패했습니다. 게임 완료에는 영향이 없습니다. 아래에서 같은 기록으로 재시도할 수 있습니다.':'결과 기록 저장을 준비합니다.';document.getElementById('retrySave').hidden=!S.submitError}}
function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]))}

function resultLinks(caseId){return S.cases[caseId].links.filter(l=>l.status!=='withdrawn').map(l=>({cause:l.cause,effect:l.effect,status:STATUS_SAVE[l.status]||l.status,evidence:[...l.evidence],timeScope:l.timeScope}))}
function resultPayload(){
  if(!S.completedAt)S.completedAt=new Date().toISOString();
  ['case1','case2','case3'].forEach(finalizeCase);
  const choices={version:'1.0',record_type:'result',result_id:S.resultId,initial_prediction:S.initialPrediction,initial_reason:S.initialReason,case_models:{daejeon_gongju:{final_links:resultLinks('case1'),summary:S.cases.case1.summary},iri_naju:{final_links:resultLinks('case2'),summary:S.cases.case2.summary},mokpo:{final_links:resultLinks('case3'),summary:S.cases.case3.summary}},unresolved_claims:unresolvedClaims(),final_model:S.finalModel,durations_ms:{case1:S.durations.case1||0,case2:S.durations.case2||0,case3:S.durations.case3||0},completed_at:S.completedAt};
  return {class:CLASS,game:GAME_ID,choices,comment:S.finalModel||'',timestamp:S.completedAt}
}
function publicHeaders(extra){const key=window.CHARLIE_CONFIG.supabasePublishableKey||'';const h={apikey:key,...(extra||{})};if(key.startsWith('eyJ'))h.Authorization=`Bearer ${key}`;return h}
async function submitResult(force=false){
  if(S.submittedAt&&!force)return {ok:true,duplicateGuard:true};const body=resultPayload(),{supabaseUrl:url,supabasePublishableKey:key}=window.CHARLIE_CONFIG;
  if(!url||!key||key.startsWith('__')){console.info('[save skipped]',body);return {ok:false,skipped:true}}
  try{const res=await fetch(`${url}/rest/v1/game_results`,{method:'POST',headers:publicHeaders({'Content-Type':'application/json',Prefer:'return=minimal'}),body:JSON.stringify(body),keepalive:true});if(!res.ok)throw new Error(`HTTP ${res.status}`);S.submittedAt=new Date().toISOString();S.submitError='';save();return {ok:true}}catch(err){console.warn('[save failed]',err);S.submitError=String(err?.message||err);save();return {ok:false,error:err}}
}

// Scene 1
load();
document.querySelectorAll('.condition').forEach(btn=>btn.onclick=()=>{if(S.scene>1||S.initialPrediction)return;S.initialPrediction=btn.dataset.pick;document.querySelectorAll('.condition').forEach(x=>x.classList.toggle('selected',x===btn));save()});
document.getElementById('initialReason').addEventListener('input',e=>{S.initialReason=e.target.value;save()});
document.getElementById('lockPrediction').onclick=()=>{const v=document.getElementById('initialValidation');if(!S.initialPrediction||!S.initialReason.trim()){v.textContent='조건을 하나 고르고 이유를 적어 주세요.';return}v.textContent='';showScene(2)};
document.getElementById('openCase1').onclick=()=>showScene(3);
document.getElementById('reviewInitial').onclick=()=>showScene(7);
document.getElementById('finalModel').addEventListener('input',e=>{S.finalModel=e.target.value;save()});
document.getElementById('finishCore').onclick=async()=>{const v=document.getElementById('finalValidation');if(!S.finalModel.trim()){v.textContent='마지막 설명을 자신의 문장으로 적어 주세요.';return}v.textContent='';S.completedAt=new Date().toISOString();save();renderFinal();document.getElementById('saveStatus').textContent='결과 기록을 저장하는 중입니다…';const r=await submitResult();renderFinal();if(!r.ok&&!r.skipped)document.getElementById('saveStatus').textContent='저장에 실패했습니다. 게임 완료에는 영향이 없습니다. 아래에서 같은 기록으로 재시도할 수 있습니다.'};
document.getElementById('retrySave').onclick=async()=>{document.getElementById('saveStatus').textContent='같은 기록으로 저장을 다시 시도합니다…';await submitResult(true);renderFinal()};
document.getElementById('postInquiry').addEventListener('input',e=>{S.postInquiry=e.target.value;save()});
document.getElementById('restartGame').onclick=()=>{if(!confirm('첫 판단과 모든 연결을 지우고 처음부터 다시 시작할까요?'))return;sessionStorage.removeItem(STORAGE_KEY);S=blankState();showScene(1);location.reload()};

// Restore visible state
if(S.initialPrediction){document.querySelector(`.condition[data-pick="${S.initialPrediction}"]`)?.classList.add('selected');document.getElementById('initialReason').value=S.initialReason||'';if(S.scene>1){document.querySelectorAll('.condition').forEach(b=>b.disabled=true);document.getElementById('initialReason').disabled=true}}
document.getElementById('postInquiry').value=S.postInquiry||'';
showScene(Math.min(7,Math.max(1,S.scene||1)));
