// Direct renderers: no intermediate V8 HTML parsing.
function v91MyChoice(id){return `<div class="my-choice"><b>내 선택</b> ${esc(LABEL[S.judgmentState[id]])}</div>`;}
function v91S2(){
  const id=S.screen,evidence=id==='E01_S2_COMMON',step=evidence?0:id==='P03'?1:2;
  let top='',paper='',bottom='';
  if(evidence){
    const task=EVIDENCE_TASKS[id],state=getEvidenceTaskState(id);
    top=`<h2 class="v9-question">${esc(task.prompt)}</h2><p class="v9-help">문장 하나를 눌러 확인합니다. 근거를 찾는 활동은 다시 선택할 수 있습니다.</p>`;
    paper=`<div class="paper evidence-paper" data-source-key="S2">${v7EvidenceRows(id)}<span class="source">— ${esc(task.sourceLabel)}</span></div>`;
    bottom=`${state.attempt_count?`<div class="evidence-feedback"><strong>${state.completed?'근거 확인':'다시 찾아보기'}</strong>${state.completed?'이 문장이 관계를 직접 말합니다.':'이 문장보다 관계를 직접 말하는 문장을 다시 찾아보세요.'}</div>`:''}${state.completed?`<div class="btnrow"><button class="btn" onclick="continueEvidence('${id}')">계속 →</button></div>`:''}`;
  }else{
    const item=ITEMS[id],chosen=S.judgmentState[id],done=chosen!==undefined;
    top=`<h2 class="v9-question">이 자료는 위 관계를 어디까지 말하고 있습니까?</h2>${relationCard(item.relation,{candidate:true})}`;
    paper=sourceBox(item.source,item.sourceLabel,done?{anchors:item.anchors,focus:item.focus,context:item.context,contextFocus:item.contextFocus}:{});
    bottom=`<div class="choice-grid">${['direct','inference','none'].map(v=>`<button class="choice ${chosen===v?'picked':''}" ${done?'disabled':''} onclick="choose('${id}','${v}')">${LABEL[v]}</button>`).join('')}</div>${done?`<div class="feedback">${v91MyChoice(id)}<div class="feedback-title">자료 판정 · ${LABEL[EXPECTED[id]]}</div><p>${esc(feedbackFor(id,chosen).text)}</p></div><div class="btnrow"><button class="btn" onclick="continueJudgment('${id}')">계속 →</button></div>`:''}`;
  }
  return v9Shell(`<section class="v9-investigation"><header class="v9-casehead"><div class="v9-kicker">FILE 02 · 자료 조사 ${step+1} / 3</div><h1>같은 목표, 다른 생각</h1><div class="v9-steps">${['E01 · 공통 목표','P03 · 추가 목표','P04 · 근거 판정'].map((t,i)=>`<span class="${i===step?'current':i<step?'done':''}">${t}</span>`).join('')}</div></header><div class="v9-activity v91-task-layout"><div>${top}</div>${paper}<div class="v91-task-bottom">${bottom}</div></div></section>`,true);
}
function v91S5(){
  const id=S.screen,evidence=!!EVIDENCE_TASKS[id],judgment=id==='R11C';
  if(id==='foldS5')return v9LateFrame(`<div class="v9-main"><section class="v9-investigation"><div class="v9-activity v9-late-summary">${foldS5()}</div></section>${GlobalMap()}</div>`,'S5');
  let source1=sourceBox('S5A','《동아일보》, 1923. 1. 2.'),source2=sourceBox('S5B','《동아일보》, 1923. 3. 20.'),actions='';
  if(evidence){
    const task=EVIDENCE_TASKS[id],state=getEvidenceTaskState(id);
    source1=`<div class="paper evidence-paper" data-source-key="S5A">${v7EvidenceRows(id)}<span class="source">— 《동아일보》, 1923. 1. 2.</span></div>`;
    source2='<div class="v91-source-locked"><strong>자료 2 · 1923. 3. 20.</strong><p>자료 1에서 필요한 근거를 모두 확보하면 개봉됩니다.</p></div>';
    actions=`<div class="evidence-question">${esc(task.prompt)}</div><div class="evidence-help">신문에서 근거가 되는 문장을 클릭하세요.</div>${state.attempt_count?`<div class="evidence-feedback"><strong>${state.completed?'근거 확보':'다시 찾아보기'}</strong>${state.completed?'선택한 문장이 조사 기록함에 들어갔습니다.':'관계를 더 직접 말하는 문장을 다시 찾아보세요.'}</div>`:''}${state.completed?`<div class="btnrow"><button class="btn" onclick="continueEvidence('${id}')">${id==='E05_S5_PRIORITY'?'같은 신문에서 다음 근거 찾기':'자료 2 개봉'}</button></div>`:''}`;
  }else if(judgment){
    const chosen=S.judgmentState[id],done=chosen!==undefined,item=ITEMS[id];
    source2=sourceBox('S5B',item.sourceLabel,done?{anchors:item.anchors,focus:item.focus}:{});
    actions=`${relationCard(item.relation,{candidate:true})}<div class="judgment-question">이 자료는 위 관계를 어디까지 말하고 있습니까?</div><div class="choice-grid">${['direct','inference','none'].map(v=>`<button class="choice ${chosen===v?'picked':''}" ${done?'disabled':''} onclick="choose('${id}','${v}')">${LABEL[v]}</button>`).join('')}</div>${done?`<div class="feedback">${v91MyChoice(id)}<div class="feedback-title">자료 판정 · ${LABEL[EXPECTED[id]]}</div><p>${esc(feedbackFor(id,chosen).text)}</p></div><div class="btnrow"><button class="btn" onclick="continueJudgment('${id}')">계속</button></div>`:''}`;
  }else if(id==='s5Discover'){
    actions='<div class="discover"><h3>두 글의 주장만 보고 작성자의 정치적 소속까지 확정할 수 있을까?</h3><div class="btnrow"><button class="btn" onclick="revealS5()">계속</button></div></div>';
  }else{
    actions=`<div class="discover"><p>두 자료를 '민족주의 대 사회주의'의 주장으로 단순하게 나눌 수는 없습니다. 당시 사회주의 진영 안에서도 물산장려운동을 둘러싼 입장이 같지 않았습니다.</p><p>두 글은 모두 《동아일보》에 실렸습니다. 신문명이나 주장 하나만으로 필자의 사상적 소속을 단정할 수 없습니다.</p></div><div class="btnrow"><button class="btn" onclick="go('foldS5')">계속</button></div>`;
  }
  return v9LateFrame(`<div class="v9-main v9-compare-main"><section class="v9-investigation v9-comparison"><header class="v9-casehead"><div class="v9-kicker">FILE 05 · ${evidence?(id==='E05_S5_PRIORITY'?'E05 · 생산력':'E06 · 단결'):judgment?'자료 2 · 관계 판정':'두 자료 함께 보기'}</div><h1>같은 운동, 다른 근거</h1></header><div class="v9-news-pair"><section class="news-sheet"><div class="news-head"><span class="news-name">동아일보</span><span class="news-date">1923. 1. 2.</span></div>${source1}</section><section class="news-sheet"><div class="news-head"><span class="news-name">동아일보</span><span class="news-date">1923. 3. 20.</span></div>${source2}</section></div><section class="v9-comparison-actions">${actions}</section></section>${GlobalMap()}</div>`,'S5');
}
function v91HeldRecords(){return `<div class="v91-held"><h3>보류 기록</h3>${Object.keys(S.noLineState).map(id=>`<button onclick="v91Inspect('${id}')">${esc(ITEMS[id].relation[0])} → 계급 해방 · 현재 근거 없음</button>`).join('')}</div>`;}
function v91ExplanationForm(){
  const canWrite=S.finalGoalConfirmed&&!!S.finalSplit;
  return `<div class="v91-final-scroll"><h1>1920년대 민족 운동은 왜 하나의 길로 모이지 않았을까?</h1><p class="lead">완성된 지도에서 여러 세력이 <strong>함께 향한 목표</strong>를 확인하고, 서로 <strong>갈라진 지점 하나</strong>를 골라 설명해 보자.</p><section class="final-step"><h3>1. 함께 향한 목표 확인</h3><button class="goal-btn ${S.finalGoalConfirmed?'selected':''}" onclick="confirmGoal()">민족 해방</button>${S.finalGoalConfirmed?'<p class="hint">민족주의 세력과 사회주의 세력이 함께 이 목표에 연결되어 있습니다.</p>':''}</section><section class="final-step"><h3>2. 갈라진 지점 하나 선택</h3><div class="split-grid">${Object.entries(FINAL_SPLITS).map(([id,t])=>`<button class="split-btn ${S.finalSplit===id?'selected':''}" onclick="selectSplit('${id}')">${esc(t)}</button>`).join('')}</div></section><section class="final-step"><h3>3. 1~2문장으로 설명</h3><textarea id="finalText" maxlength="300" placeholder="공통 목표와 갈라진 지점을 연결해 설명해 보세요." oninput="updateFinalText(this.value)" ${canWrite?'':'disabled'}>${esc(S.finalExplanation)}</textarea></section></div><div class="v91-final-action"><button class="btn" id="finalSubmit" onclick="submitFinal()" ${canWrite&&S.finalExplanation.trim()?'':'disabled'}>답 제출</button></div>`;
}
function v91DoneForm(){return `<div class="v91-final-scroll"><h1>지도를 완성했습니다</h1><p class="lead">자료로 확인한 관계와, 근거가 부족해 긋지 않은 판단을 함께 남겼습니다.</p><div class="answer-box"><h3>내 설명</h3><p>${esc(S.finalExplanation)}</p><p class="hint">선택한 갈라진 지점 · ${esc(FINAL_SPLITS[S.finalSplit]||'')}</p></div><button class="btn secondary" onclick="copyAnswer()">내 답 복사</button><div class="comment-box"><label for="comment">한 줄 소감</label><textarea id="comment" rows="2" placeholder="한 줄 소감을 남겨보세요. (이름·학번 제외)" maxlength="100"></textarea><button class="btn ghost" id="commentSend" onclick="sendComment()" ${S.commentSubmitted?'disabled':''}>${S.commentSubmitted?'소감 전송됨':'소감 보내기'}</button></div><div class="footer">© 찰리쌤 · hischarlie.tistory.com</div></div>`;}
function v91S7(){
  const id=S.screen;
  if(id==='s7A')return v9LateFrame(`<div class="v9-main"><section class="v9-investigation"><div class="v9-activity v9-late-summary">${s7A()}</div></section>${GlobalMap()}</div>`,'S7');
  const form=id==='finalPrompt'||id==='done';
  let right=form?`<button id="inspectorBack" class="gm-back" hidden onclick="v91ReturnToForm()">${id==='finalPrompt'?'설명으로 돌아가기':'완료 화면으로 돌아가기'}</button><div id="globalInspector" hidden></div><section id="finalForm">${id==='finalPrompt'?v91ExplanationForm():v91DoneForm()}</section>`:`<div id="globalInspector">${v91InspectorHtml(V91MapUI.selected||'P03')}</div>${v91HeldRecords()}<div class="v91-final-action"><button class="btn" onclick="go('finalPrompt')">조사를 마치고 설명하기 →</button></div>`;
  return v9LateFrame(`<div class="v9-main v9-finale-main">${GlobalMap({large:true})}<section class="v9-investigation v91-final-side">${right}</section></div>`,'S7',id==='finalPrompt'?'writing':'');
}
