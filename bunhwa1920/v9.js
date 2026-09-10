// Presentation only. SOURCE, EXPECTED, state transitions and result writers remain V8.
function v9KeepEvidenceVisible(root){
  let paper=root.querySelector('.evidence-paper');const chosen=paper?.querySelector('.resolved,.last-wrong');
  if(paper&&paper.scrollHeight<=paper.clientHeight)paper=paper.closest('.news-sheet')||paper;
  if(!paper||!chosen||paper.scrollHeight<=paper.clientHeight)return;
  const p=paper.getBoundingClientRect(),c=chosen.getBoundingClientRect();
  if(c.bottom>p.bottom)paper.scrollTop+=c.bottom-p.bottom+12;
  else if(c.top<p.top)paper.scrollTop-=p.top-c.top+12;
}
function v9Nav(){return `<nav class="v9-nav" aria-label="게임 메뉴"><div class="v9-brand">갈라진 지도 <small>HISTORY INVESTIGATION · V9.2</small></div><div class="v9-menu"><button onclick="v91SaveProgress()">저장하기</button><button onclick="v8Home()">처음으로</button><button onclick="v9Dialog('intro')">게임 소개</button><button onclick="v9Dialog('sources')">자료실</button></div></nav>`;}
function v9Dialog(kind){
  document.querySelector('.v9-dialog')?.remove();
  const content={
    intro:['게임 소개','<p>《갈라진 지도》는 1920년대 민족 운동의 여러 흐름을 자료에서 확인하고, 근거가 있는 관계만 지도에 연결하는 역사 조사 게임입니다.</p><p>관계를 직접 확인하면 선을 긋습니다. 현재 자료로 확인할 수 없으면 선을 만들지 않고 보류 기록에 남깁니다.</p>'],
    sources:['자료실',Object.entries(SOURCE).map(([key,value])=>`<details><summary>${esc(key)} · ${esc(Object.values(EVIDENCE_TASKS).find(t=>t.source===key)?.sourceLabel||Object.values(ITEMS).find(t=>t.source===key)?.sourceLabel||'기존 게임 자료')}</summary><p>${esc(value)}</p></details>`).join('')]
  }[kind];
  const d=document.createElement('dialog');d.className='v9-dialog';d.innerHTML=`<button onclick="this.closest('dialog').close()">닫기</button><h2>${content[0]}</h2>${content[1]}`;document.body.append(d);d.addEventListener('close',()=>d.remove());d.showModal();
}
function v9Map(){return GlobalMap();}

function v9Shell(inner,street=false,scene=''){return `<div class="v9-shell ${scene==='S4'?'workshop':scene==='S3'?'reading':street?'street':''}">${v9Nav()}<div class="v9-main">${inner}${scene==='S4'?v9S4Map():scene==='S3'?v9S3Map():v9Map()}</div><footer class="v9-footer"><span>${scene==='S4'?'S4 · 산업과 교육 / 실력 양성 운동':scene==='S3'?'S3 · 독서·토론 공간 / 대중 운동':street?'S2 · 1920년대 거리 / 목표와 차이':'S1 · 역사 조사실 / 조사 준비'}</span><span>자료를 읽고, 근거를 찾고, 관계를 연결하세요.</span></footer></div>`;}
function v9S1(){return v9Shell(`<section class="v9-intro"><div class="v9-kicker">역사 조사 기록 · 1920년대</div><h1>갈라진 지도</h1><p class="lead">1920년대 민족 운동은 여러 갈래로 나뉘었습니다. 흩어진 자료를 읽고 근거를 찾아, 비어 있는 관계 지도를 완성하세요.</p><div class="v9-rule-list"><div><span>01</span>자료의 문장에서 근거를 찾습니다.</div><div><span>02</span>관계를 직접 확인하면 선을 긋습니다.</div><div><span>03</span>현재 근거가 없으면 보류 기록에 남깁니다.</div></div><div class="v91-start-actions"><button class="v9-start" onclick="startActivities()">조사 시작하기 <b>→</b></button>${v91ReadProgress()?'<button class="v9-start resume" onclick="v91Resume()">이어하기 →</button>':''}</div>${v91ReadProgress()||Object.keys(S.mapState).length?'<button class="v91-restart" onclick="v91Restart()">처음부터 다시 시작</button>':''}</section>`);}
function v9S2(){return v91S2();}

function v9S3Map(){return GlobalMap();}

function v9S3(inner){
  const id=S.screen,fold=id==='foldS3',step=fold?2:id==='E02_S3_MASS'?0:1;
  let content=inner;
  if(!fold){
    const task=EVIDENCE_TASKS[id],state=getEvidenceTaskState(id);
    content=`<div class="v9-s3-question"><h2 class="v9-question">${esc(task.prompt)}</h2><p class="v9-help">문장 하나를 눌러 확인합니다. 근거를 찾는 활동은 다시 선택할 수 있습니다.</p></div><div class="paper evidence-paper v9-s3-paper" data-source-key="S3">${v7EvidenceRows(id)}<span class="source">— ${esc(task.sourceLabel)}</span></div><div class="v9-s3-actions">${state.attempt_count?`<div class="evidence-feedback ${state.completed?'':'retry'}"><strong>${state.completed?'근거 확인':'다시 찾아보기'}</strong>${state.completed?'이 문장이 관계를 직접 말합니다.':'이 문장보다 관계를 직접 말하는 문장을 다시 찾아보세요.'}</div>`:''}${state.completed?(step===0?`<div class="auto-note">농민 운동 · 자료에 함께 제시됨</div>${scopeBadgeHtml(true)}`:'<div class="result-note">이 선은 치안유지법이 사회주의 운동 탄압에 사용되었다는 관계를 보여줍니다. 치안유지법의 적용 대상이 사회주의에만 한정되었다는 뜻은 아닙니다.</div>'):''}${state.completed?`<div class="btnrow"><button class="btn" onclick="continueEvidence('${id}')">계속 →</button></div>`:''}</div>`;
  }
  return v9Shell(`<section class="v9-investigation v9-s3-investigation"><header class="v9-casehead"><div class="v9-kicker">FILE 03 · 자료 조사 ${step+1} / 3</div><h1>${esc(V7_SCENES.S3.title)}</h1><div class="v9-steps">${['E02 · 대중 운동','E03 · 탄압','조사 정리'].map((t,i)=>`<span class="${i===step?'current':i<step?'done':''}">${t}</span>`).join('')}</div></header><div class="v9-activity ${fold?'v9-s3-summary':'v9-s3-evidence'}">${content}</div></section>`,false,'S3');
}

function v9S4Map(){return GlobalMap();}

function v9S4(inner){
  const id=S.screen,fold=id==='foldS4',evidence=id==='E04_S4_EMPHASIS',step=fold?2:evidence?0:1;
  let content=inner;
  if(evidence){
    const task=EVIDENCE_TASKS[id],state=getEvidenceTaskState(id);
    const rows=v7EvidenceRows(id).replace('>물산 장려 운동 회사령','><strong>물산 장려 운동</strong> 회사령');
    content=`<div><h2 class="v9-question">${esc(task.prompt)}</h2><p class="v9-help">문장 하나를 눌러 확인합니다. 근거를 찾는 활동은 다시 선택할 수 있습니다.</p></div><div class="paper evidence-paper v9-s3-paper" data-source-key="S4">${rows}<span class="source">— ${esc(task.sourceLabel)}</span></div><div class="v9-s3-actions">${state.attempt_count?`<div class="evidence-feedback"><strong>${state.completed?'근거 확인':'다시 찾아보기'}</strong>${state.completed?'이 문장이 관계를 직접 말합니다.':'이 문장보다 관계를 직접 말하는 문장을 다시 찾아보세요.'}</div>`:''}${state.completed?`<div class="btnrow"><button class="btn" onclick="continueEvidence('${id}')">계속 →</button></div>`:''}</div>`;
  }else if(!fold){
    const item=ITEMS[id],chosen=S.judgmentState[id],done=chosen!==undefined,mark=done?{anchors:item.anchors,focus:item.focus,context:item.context,contextFocus:item.contextFocus}:{};
    const feedback=done?feedbackFor(id,chosen):null;
    content=`<div><h2 class="v9-question">이 자료는 위 관계를 어디까지 말하고 있습니까?</h2>${relationCard(item.relation,{candidate:true})}${done?'<div class="context-label">자료가 실제로 말한 부분</div>':''}</div>${sourceBox(item.source,item.sourceLabel,mark)}<div class="v9-s3-actions"><div class="choice-grid">${['direct','inference','none'].map(v=>`<button class="choice ${chosen===v?'picked':''}" ${done?'disabled':''} onclick="choose('${id}','${v}')">${LABEL[v]}</button>`).join('')}</div>${done?`<div class="feedback">${v91MyChoice(id)}<div class="feedback-title">자료 판정 · ${esc(feedback.title)}</div><p>${esc(feedback.text)}</p></div>${feedback.closure?'<div class="result-note">이 관계는 현재 자료로 확인되지 않아 선을 긋지 않습니다.</div>':''}<div class="btnrow"><button class="btn" onclick="continueJudgment('${id}')">계속 →</button></div>`:''}</div>`;
  }
  return v9Shell(`<section class="v9-investigation v9-s4-investigation"><header class="v9-casehead"><div class="v9-kicker">FILE 04 · 자료 조사 ${step+1} / 3</div><h1>${esc(V7_SCENES.S4.title)}</h1><div class="v9-steps">${['E04 · 강조점','관계 판정','조사 정리'].map((t,i)=>`<span class="${i===step?'current':i<step?'done':''}">${t}</span>`).join('')}</div></header><div class="v9-activity ${fold?'v9-s3-summary v9-s4-summary':'v9-s3-evidence v9-s4-evidence'}">${content}</div></section>`,false,'S4');
}

function v9IsLateScreen(){return ['S5','S6','S7'].includes(v7SceneKey(S.screen))||['finalPrompt','done'].includes(S.screen);}

function v9LateFrame(content,scene,mode=''){
  return `<div class="v9-shell v9-late ${scene.toLowerCase()} ${mode}">${v9Nav()}${content}<footer class="v9-footer"><span>${scene} · ${scene==='S5'?'두 자료 비교':scene==='S6'?'민립 대학 설립 운동':'분화된 지도 완성'}</span><span>자료를 읽고, 근거를 찾고, 관계를 연결하세요.</span></footer></div>`;
}
function v9LateMap(){return GlobalMap();}

function v9MapDialog(){v91ExpandMap();}


function v9S6(){
  const id=S.screen,evidence=id==='E07_S6_GOAL';
  let content='';
  if(evidence){
    const task=EVIDENCE_TASKS[id],state=getEvidenceTaskState(id);
    content=`<div><h2 class="v9-question">${esc(task.prompt)}</h2><p class="v9-help">문장 하나를 눌러 확인합니다. 근거를 찾는 활동은 다시 선택할 수 있습니다.</p></div><div class="paper evidence-paper v9-s3-paper" data-source-key="S6A">${v7EvidenceRows(id)}<span class="source">— ${esc(task.sourceLabel)}</span></div><div class="v9-s3-actions">${state.attempt_count?`<div class="evidence-feedback"><strong>${state.completed?'근거 확인':'다시 찾아보기'}</strong>${state.completed?'이 문장이 관계를 직접 말합니다.':'이 문장보다 관계를 직접 말하는 문장을 다시 찾아보세요.'}</div>`:''}${state.completed?`<div class="btnrow"><button class="btn" onclick="continueEvidence('${id}')">계속 →</button></div>`:''}</div>`;
  }else content=id==='s6Reading'?s6Reading():foldS6().replace('>계속</button>','>최종 지도 확인 →</button>');
  return v9LateFrame(`<div class="v9-main"><section class="v9-investigation"><header class="v9-casehead"><div class="v9-kicker">FILE 06 · ${evidence?'E07 · 목표 찾기':id==='s6Reading'?'추가 읽기':'조사 정리'}</div><h1>대학을 세우자는 움직임</h1></header><div class="v9-activity ${evidence?'v9-s3-evidence':'v9-late-summary'}">${content}</div></section>${v9LateMap('S6')}</div>`,'S6');
}
function v9FullBoard(){return GlobalMap({large:true});}

function v9Inspect(id){v91Inspect(id);}


function v9LateRender(){const scene=v7SceneKey(S.screen);return scene==='S5'?v91S5():scene==='S6'?v9S6():v91S7();}
