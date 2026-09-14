'use strict';
function renderS5(){
  setSceneMeta(5,'1906년 후속 기록','1906년 새 자료는 1900년에 보류했던 “석도” 메모를 어떻게 바꾸게 할까?',['심흥택 관련 보고에서 행정 소속 표현과 일본 측 통보를 각각 표시한다.','의정부 지령에서 중앙정부의 대응을 표시한다.','새 근거 트레이를 확인한 뒤 1900년의 옛 메모를 실제로 수정하거나 보류한다.'],'연구 보드에서 자료 관계를 만든다');seen('shim1906');seen('directive1906');
  $('#sceneContent').innerHTML=sourceCard('shim1906')+`<div class="task-card"><h3>심흥택 관련 보고에서 직접 확인</h3><button class="evidence-btn s1906" data-id="affiliation">“본군 소속 독도”</button><button class="evidence-btn s1906" data-id="notice">일본 측의 편입 통보 내용</button></div>`+sourceCard('directive1906')+`<div class="task-card"><h3>의정부 지령에서 직접 확인</h3><button class="evidence-btn s1906" data-id="reject">일본 영지 주장에 동의하지 않음</button><button class="evidence-btn s1906" data-id="recheck">재조사 지시</button></div><div id="newClueTray" class="clue-tray"></div><div class="old-memo"><b>1900년에 내가 저장한 메모</b><br>${esc(S.draftHistory.find(x=>x.stage==='1900 보류')?.text||'1900년 원문에는 “석도”가 있다. 현재 독도와의 연결은 추가 근거 필요.')}</div><div class="task-card"><h3>이전 메모를 어떻게 수정할까?</h3><p class="task-help">위 1906 자료에서 필요한 구절을 먼저 표시하면 수정 버튼이 열립니다.</p><button class="evidence-btn rev" data-v="후속 명칭·행정 기록을 통해 현재 독도와의 연결을 지지하는 근거가 보강되었다." disabled>근거가 보강되었다고 수정</button><button class="evidence-btn rev" data-v="아직 더 확인하고 싶어 판단을 보류한다." disabled>판단을 계속 보류</button></div><div class="locked-note"><b>어떤 선택에도 남는 주의</b><br>1900년 칙령 원문에 실제로 적힌 글자는 여전히 “석도”입니다.</div>`;
  const picks=new Set(S.report1906Selections||[]);
  function renderTray(){
    const m={affiliation:'1906 행정 소속: “본군 소속 독도”',notice:'1906 보고: 일본 측 편입 통보 내용',reject:'중앙정부 대응: 일본 영지 주장에 동의하지 않음',recheck:'중앙정부 대응: 재조사 지시'};
    $('#newClueTray').innerHTML=[...picks].map(id=>`<div class="clue"><b>새 근거</b><br>${esc(m[id])}</div>`).join('')+S.seokdoEvidence.map(x=>`<div class="clue"><b>선택 조사에서 확보</b><br>${esc(x)}</div>`).join('');
    const ready=picks.has('affiliation')&&picks.has('notice')&&(picks.has('reject')||picks.has('recheck'));$$('.rev').forEach(b=>b.disabled=!ready);if(ready)feedback('1906년의 행정 소속 표현·일본 측 통보·중앙정부 대응을 분리해 확보했습니다. 이제 1900년 메모를 다시 판단하세요.');
  }
  $$('.s1906').forEach(b=>{if(picks.has(b.dataset.id))b.classList.add('selected');b.onclick=()=>{b.classList.toggle('selected');b.classList.contains('selected')?picks.add(b.dataset.id):picks.delete(b.dataset.id);S.report1906Selections=[...picks];save();renderTray()}});renderTray();
  $$('.rev').forEach(b=>{if(S.revisionChoice===b.dataset.v)b.classList.add('selected');b.onclick=()=>{if(b.disabled)return;$$('.rev').forEach(x=>x.classList.toggle('selected',x===b));const changed=S.revisionChoice!==b.dataset.v;S.revisionChoice=b.dataset.v;if(changed)S.revisionCount++;S.seokdoStatus=b.dataset.v+' (단, 1900년 원문 표기는 “석도”)';if(picks.has('affiliation'))addNote('“본군 소속 독도”라는 행정 표현','1906 보고');if(picks.has('notice'))addNote('일본 관리 일행의 독도 편입 통보가 보고됨','1906 보고');if(picks.has('reject'))addNote('대한제국 중앙정부가 일본의 독도 영지 주장에 동의하지 않음','1906 중앙정부 대응');if(picks.has('recheck'))addNote('대한제국 중앙정부가 독도와 일본인 행동의 재조사를 지시','1906 중앙정부 대응');save();renderSide();$('#sceneNext').disabled=false;feedback('새 자료를 보고 1900년에 저장했던 메모를 실제로 수정했습니다. 원문의 “석도” 표기는 그대로 유지됩니다.')}});
  if(S.revisionChoice)$('#sceneNext').disabled=false;
  $('#sceneNext').onclick=()=>{if(!S.draftHistory.some(x=>x.stage==='1906 수정'))S.draftHistory.push({stage:'1906 수정',text:S.seokdoStatus});save();renderS6()};
}

function boardSourceIds(){return S.evidenceSeen.filter(id=>D.sources[id])}
function renderS6(){
  setSceneMeta(6,'연구 보드','내가 실제로 읽은 자료들 사이에는 어떤 관계가 있을까?',['실제 열람 자료 중 최종 전시에 쓸 핵심 사료 2~4개를 고른다.','두 자료를 선택하고 관계 라벨을 붙인다.','관계는 최대 3개만 남긴다.'],'내 연구 메모로 전시 패널을 편집한다');
  const ids=boardSourceIds();
  const years={dajokan1877:'1877',ordinance1900:'1900',niitaka1904:'1904',tsushima1904:'1904',nakai1904:'1904',cabinet1905:'1905',shimane1905:'1905',currentJapan:'현재',toponymStudy:'현대',timeline1904:'정리',shim1906:'1906',directive1906:'1906'};
  const byYear=['1877','1900','1904','1905','1906'].map(y=>({y,ids:ids.filter(id=>years[id]===y)}));
  $('#sceneContent').innerHTML=`<div class="board-shell"><h3>내가 실제로 열람한 자료</h3><div class="timeline">${byYear.map(g=>`<div class="year-col"><div class="year">${g.y}</div>${g.ids.map(id=>`<div class="board-source">${esc(sourceName(id))}</div>`).join('')||'<div class="board-source hidden-source">열람 자료 없음</div>'}</div>`).join('')}</div><div class="task-card"><h3>최종 전시 핵심 사료 2~4개</h3><div class="source-select-grid">${ids.map(id=>`<label><input type="checkbox" class="exsrc" value="${id}"> ${esc(sourceName(id))}</label>`).join('')}</div></div><div class="relation-builder"><h3>자료쌍 → 관계 라벨</h3><p class="task-help"><strong>자료 A를 주어로 읽습니다.</strong> 예: ‘A가 B를 보강한다’, ‘A는 B에 대한 후속 대응이다’.</p><div class="two-col"><label>자료 A<select id="relA"><option value="">선택</option>${ids.map(id=>`<option value="${id}">${esc(sourceName(id))}</option>`).join('')}</select></label><label>자료 B<select id="relB"><option value="">선택</option>${ids.map(id=>`<option value="${id}">${esc(sourceName(id))}</option>`).join('')}</select></label></div><div class="two-col"><select id="relLabel"><option value="">관계 선택</option><option value="보강한다">A가 B를 보강한다</option><option value="긴장한다">A가 B와 긴장한다</option><option value="후속 대응이다">A는 B에 대한 후속 대응이다</option><option value="시대적 배경으로 연결된다">A는 B의 시대적 배경으로 연결된다</option><option value="직접 인과로 단정하기 어렵다">A만으로 B와의 직접 인과를 단정하기 어렵다</option></select><button id="addRel" type="button">관계 추가</button></div><div id="relList" class="relation-list"></div></div></div>`;
  const sel=new Set(S.selectedExhibitSources||[]);
  $$('.exsrc').forEach(c=>{if(sel.has(c.value))c.checked=true;c.onchange=()=>{c.checked?sel.add(c.value):sel.delete(c.value);if(sel.size>4){c.checked=false;sel.delete(c.value);feedback('핵심 사료는 최대 4개만 선택합니다.',true)}S.selectedExhibitSources=[...sel];save();check()}});
  function renderRels(){const box=$('#relList');box.innerHTML=S.boardLinks.map((r,i)=>`<div class="relation-item"><span class="small">자료 A</span><br>${esc(sourceName(r.a))}<br><b>→ ${esc(r.label)} →</b><br><span class="small">자료 B</span><br>${esc(sourceName(r.b))} <button type="button" data-del="${i}">삭제</button></div>`).join('')||'<span class="small">아직 관계가 없습니다.</span>';$$('[data-del]').forEach(b=>b.onclick=()=>{S.boardLinks.splice(+b.dataset.del,1);save();renderRels();check()})}
  $('#addRel').onclick=()=>{const a=$('#relA').value,b=$('#relB').value,label=$('#relLabel').value;if(!a||!b||!label||a===b){feedback('서로 다른 두 자료와 관계 라벨을 선택하세요.',true);return}if(S.boardLinks.length>=3){feedback('핵심 관계는 최대 3개만 남길 수 있습니다.',true);return}S.boardLinks.push({a,b,label});save();renderRels();check()};
  function check(){$('#sceneNext').disabled=!(sel.size>=2&&sel.size<=4&&S.boardLinks.length>=2)}
  renderRels();check();$('#sceneNext').onclick=()=>story('beforeExhibit',renderS7);
}

function memoBlocks(){const blocks=[];S.extractedNotes.forEach((n,i)=>blocks.push({id:'n'+i,label:n.tag,text:n.text}));S.boardLinks.forEach((r,i)=>blocks.push({id:'r'+i,label:'자료 관계',text:`${sourceName(r.a)} — ${r.label} — ${sourceName(r.b)}`}));return blocks}
function renderS7(){
  setSceneMeta(7,'청소년 전시 패널 편집','내가 실제로 읽고 저장한 근거만으로 어떤 전시문을 만들 수 있을까?',['내가 확보한 메모 블록을 필요한 만큼 골라 본문에 넣는다.','제목과 연결어를 다듬는다.','현재 자료보다 강하게 단정하지 않는 주의 문구를 남긴다.'],'전시 패널을 확정한다');
  const blocks=memoBlocks();
  $('#sceneContent').innerHTML=`<div class="editor-grid"><section class="block-bank"><h3>내가 실제로 확보한 메모</h3><p class="task-help">미리 작성된 모범답안은 없습니다. 앞 장면에서 내가 저장한 메모만 나옵니다.</p>${blocks.map(b=>`<button type="button" class="block" data-block="${b.id}" data-text="${esc(b.text)}"><b>${esc(b.label)}</b><br>${esc(b.text)}</button>`).join('')}</section><section class="exhibit-form"><label class="field"><span>패널 제목</span><input id="panelTitle" maxlength="80" value="${esc(S.finalPanel.title||'')}" placeholder="전시 패널 제목"></label><label class="field"><span>핵심 설명</span><textarea id="panelBody" rows="9" maxlength="1200" placeholder="왼쪽의 내 메모를 눌러 문장을 구성하세요.">${esc(S.finalPanel.body||'')}</textarea></label><label class="field"><span>표현상 주의</span><textarea id="panelCaution" rows="4" maxlength="500" placeholder="현재 자료로 단정하지 않을 내용을 적어보세요.">${esc(S.finalPanel.caution||'')}</textarea></label></section></div><div id="panelPreview" class="exhibit-preview"></div>`;
  const body=$('#panelBody'),title=$('#panelTitle'),caution=$('#panelCaution');
  $$('.block').forEach(b=>b.onclick=()=>{const t=b.dataset.text;if(!body.value.includes(t)){body.value+=(body.value?'\n':'')+t;b.classList.add('used');preview()}});
  [body,title,caution].forEach(e=>e.oninput=preview);
  function preview(){S.finalPanel={title:title.value.trim(),body:body.value.trim(),caution:caution.value.trim()};save();$('#panelPreview').innerHTML=`<h2>${esc(S.finalPanel.title||'제목을 입력하세요')}</h2><p>${esc(S.finalPanel.body||'내 연구 메모를 이용해 핵심 설명을 구성하세요.').replace(/\n/g,'<br>')}</p><div class="evidence-line"><b>핵심 근거</b><br>${S.selectedExhibitSources.map(id=>esc(sourceName(id))).join(' · ')}</div><div class="evidence-line"><b>표현상 주의</b><br>${esc(S.finalPanel.caution||'아직 작성하지 않음')}</div>`;$('#sceneNext').disabled=!(S.finalPanel.title&&S.finalPanel.body&&S.finalPanel.caution)}
  preview();$('#sceneNext').onclick=finish;
}

function finish(){
  S.completedAt=S.completedAt||new Date().toISOString();S.phase='result';save();showView('#resultView');progress(8);
  const path=[['처음 검수',S.initialMarked||'—'],['1877년 식별 메모',S.outsideOneStatus||'—'],['1900년 보류',S.draftHistory.find(x=>x.stage==='1900 보류')?.text||'—'],['1906년 이후',S.revisionChoice||'—']];
  $('#resultPath').innerHTML=path.map(x=>`<div class="path-card"><strong>${esc(x[0])}</strong>${esc(x[1])}</div>`).join('');
  $('#finalExhibit').innerHTML=`<h2>${esc(S.finalPanel.title)}</h2><p>${esc(S.finalPanel.body).replace(/\n/g,'<br>')}</p><div class="evidence-line"><b>내가 선택한 핵심 사료</b><br>${S.selectedExhibitSources.map(id=>esc(sourceName(id))).join(' · ')}</div><div class="evidence-line"><b>표현상 주의</b><br>${esc(S.finalPanel.caution)}</div>`;
  const seq=D.vn.ending||[];if(S.vn&&seq.length&&!$('#finalExhibit').nextElementSibling?.classList.contains('panel')){const extra=document.createElement('div');extra.className='panel';extra.innerHTML=seq.map(x=>`<p><b>${esc(x[0])}</b> ${esc(x[1])}</p>`).join('');$('#finalExhibit').after(extra)}
  submitResult();
}
function resultId(){if(!S.resultId)S.resultId=GAME+'-'+(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2));save();return S.resultId}
function payload(){return{class:CLASS,game:GAME,choices:{result_id:resultId(),version:VER,course_lens:S.lens,evidence_seen:S.evidenceSeen,hint_used:S.hintUsed,outside_one_status:S.outsideOneStatus,revision_count:S.revisionCount,seokdo_status:S.seokdoStatus,context_relation:S.contextRelation,board_links:S.boardLinks,selected_exhibit_sources:S.selectedExhibitSources,completion:'finished'},comment:'',timestamp:S.completedAt||new Date().toISOString()}}
async function submitResult(force=false){
  if(S.submittedAt&&!force){$('#saveStatus').textContent='✓ 연구 기록이 이미 저장되었습니다.';return}
  $('#saveStatus').textContent='연구 기록을 저장하는 중입니다…';$('#retrySave').hidden=true;
  try{const r=await fetch(SB+'/rest/v1/game_results',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(payload()),keepalive:true});if(!r.ok)throw new Error('HTTP '+r.status);S.submittedAt=new Date().toISOString();S.submitError='';save();$('#saveStatus').textContent='✓ 연구 기록이 저장되었습니다.'}
  catch(e){S.submitError=String(e);save();$('#saveStatus').textContent='기록 저장에 실패했습니다. 게임 완료에는 영향이 없습니다.';$('#retrySave').hidden=false}
}
