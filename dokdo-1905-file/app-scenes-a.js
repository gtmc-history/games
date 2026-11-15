'use strict';
function renderS0(){
  setSceneMeta(0,'검수 보류','이 문장에서 1905년 당시 기록으로 먼저 확인해 보고 싶은 표현은 무엇인가?',['전시 초안에서 검수할 표현을 하나 표시한다.','왜 확인하려는지 연구 목적을 정한다.'],'1905년 당시 결정문을 연다');
  $('#sceneContent').innerHTML=`<article class="source-card"><h2>청소년 전시 초안</h2><div class="passport"><span>게임 속 가공 원고</span><span>역사 사료 아님</span></div><div class="reading">1905년 일본 내각은 독도가 <button class="evidence-btn phrase" data-v="이전부터 일본 영토였음을 확인">이전부터 일본 영토였음을 확인</button>하고 <button class="evidence-btn phrase" data-v="시마네현에 편입했다">시마네현에 편입했다</button>.</div></article><div class="task-card"><h3>연구 목적</h3><div class="two-col"><button class="evidence-btn why" data-v="1905년 당시 문서에 실제로 있는 표현인지 확인">당시 문서에 실제로 있는 표현인지 확인</button><button class="evidence-btn why" data-v="현재 설명과 1905년 당대 문서의 논리를 비교">현재 설명과 1905년 당대 문서 비교</button></div></div>`;
  const check=()=>{$('#sceneNext').disabled=!(S.initialMarked&&S.initialJudgment)};
  $$('.phrase').forEach(b=>b.onclick=()=>{S.initialMarked=b.dataset.v;$$('.phrase').forEach(x=>x.classList.toggle('selected',x===b));save();renderSide();check()});
  $$('.why').forEach(b=>b.onclick=()=>{S.initialJudgment=b.dataset.v;$$('.why').forEach(x=>x.classList.toggle('selected',x===b));save();check()});
  $$('.phrase').forEach(x=>x.classList.toggle('selected',x.dataset.v===S.initialMarked));
  $$('.why').forEach(x=>x.classList.toggle('selected',x.dataset.v===S.initialJudgment));check();
  $('#sceneNext').onclick=()=>{if(!S.draftHistory.some(x=>x.stage==='초안'))S.draftHistory.push({stage:'초안',text:`검수 필요: ${S.initialMarked}`});save();renderS1()};
}

function renderS1(){
  setSceneMeta(1,'1905년 일본 내각 결정','당시 일본 내각은 어떤 논리로 무엇을 결정했을까?',['1905년 내각 결정의 충분한 본문을 읽는다.','판단 근거 구절 1개 이상과 실제 결정 구절 1개를 저장한다.','보조자료는 필요한 경우에만 연다.'],'1905년보다 앞선 기록을 찾아본다');seen('cabinet1905');
  const s=D.sources.cabinet1905;
  $('#sceneContent').innerHTML=sourceCard('cabinet1905')+`<div class="task-card"><h3>본문에서 연구노트로 가져올 구절</h3><div class="task-help">방금 읽은 본문의 구절을 문장 단위로 탭해 저장합니다. 자료 역할은 저장한 뒤 연구노트에서 확인합니다.</div>${s.selectable.map(x=>`<button class="evidence-btn cab" data-id="${x.id}" data-role="${x.role}" data-t="${esc(x.text)}">${esc(x.text)}</button>`).join('')}</div><div class="archive"><h3>더 조사할 수 있는 자료</h3><p class="task-help">전부 열 필요가 없습니다. 지금 질문에 더 필요한 자료만 고르세요.</p><div class="archive-grid">${archiveCard('currentJapan','현재 일본 정부가 1905년을 어떻게 설명하는지 비교합니다.')}${archiveCard('nakai1904','1905년 결정 전에 제출된 개인 청원을 확인합니다.')}${archiveCard('shimane1905','내각 결정 뒤 지방 행정 고시를 확인합니다.')}</div></div>`;
  const selected=new Set(S.core1905||[]);
  const check=()=>{const basis=$$('.cab.selected[data-role="basis"]').length>=1,dec=$$('.cab.selected[data-role="decision"]').length>=1;$('#sceneNext').disabled=!(basis&&dec)};
  $$('.cab').forEach(b=>{if(selected.has(b.dataset.id))b.classList.add('selected');b.onclick=()=>{b.classList.toggle('selected');b.classList.contains('selected')?selected.add(b.dataset.id):selected.delete(b.dataset.id);S.core1905=[...selected];save();check();if(!$('#sceneNext').disabled)feedback('서로 다른 기능을 하는 구절을 확보했습니다. 보조자료는 더 필요할 때만 열어도 됩니다.')}});
  bindArchive();check();
  $('#sceneNext').onclick=()=>{S.core1905.forEach(id=>{const x=s.selectable.find(q=>q.id===id);if(x)addNote(x.text,x.role==='decision'?'1905 결정':'1905 판단 근거')});if(!S.draftHistory.some(x=>x.stage==='1905 확인'))S.draftHistory.push({stage:'1905 확인',text:'1905 결정문에서 직접 확인한 근거와 행정 결정을 분리함'});save();story('after1905',renderS2)};
}

function renderS2(){
  setSceneMeta(2,'1877년 태정관 지령','“죽도 외 1도”라는 직접 문구와, 그 두 번째 섬의 현재 지명 식별은 어디까지 구분해야 할까?',['지령 본문에서 “죽도 외 1도”의 처리 내용을 확인한다.','같은 일건에 편철된 시마네현 제출 지도에서 명칭과 상대 위치 단서를 확인한다.','현재 지명 식별은 해석 메모로 따로 저장하거나 판단을 보류한다.'],'1900년 대한제국 기록을 확인한다');seen('dajokan1877');
  const mapReady=()=>new Set(S.mapClues||[]).size>=2;
  $('#sceneContent').innerHTML=sourceCard('dajokan1877')+`<div class="task-card"><h3>1단계 · 본문 직접 문구</h3><button id="direct1877" class="evidence-btn">“죽도 외 1도”가 일본과 관계없다는 취지로 처리하라고 했다.</button></div><div class="map-source-panel"><h3>2단계 · 시마네현 제출 지도 단서</h3><p>1876년 시마네현이 제출한 「기죽도약도」의 실제 공개 스캔을 살펴보세요. 지령 본문의 표현과 지도에서 관찰한 명칭·상대 위치는 서로 구분해 기록합니다.</p><div class="map-source-wrap" aria-label="기죽도약도 원자료 지도"><img class="map-source-img" src="assets/sources/kijukdo-yakudo.jpg" alt="1876년 시마네현 제출 지도 기죽도약도 전체" loading="eager" onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='https://dokdo.mofa.go.kr/m/kor/img/contents/view0503_img02_b.jpg'}"><button class="map-hotspot big" data-map="큰 섬의 명칭과 위치 표기" aria-label="큰 섬의 명칭과 위치 확인"><span>단서 1</span></button><button class="map-hotspot small" data-map="두 번째 섬의 명칭과 상대 위치 표기" aria-label="두 번째 섬의 명칭과 상대 위치 확인"><span>단서 2</span></button></div><p class="map-caption">1876년 시마네현 제출 지도 「기죽도약도」. 일본 국립공문서관 소장 자료의 공개 스캔을 화면에 표시합니다. 두 단서를 직접 눌러 위치 관계를 확인하세요.</p><div class="map-note"><a href="https://www.digital.archives.go.jp/item/en/3018187" target="_blank" rel="noopener noreferrer">일본 국립공문서관 정본 정보 ↗</a><span aria-hidden="true"> · </span><a href="https://dokdo.mofa.go.kr/kor/pds/part06_view09.jsp" target="_blank" rel="noopener noreferrer">외교부 공개 자료 ↗</a></div></div><div class="task-card"><h3>3단계 · 식별은 해석층으로 저장</h3><p class="task-help">지금까지 직접 확인한 것은 태정관 지령의 문구와 별도 단계에서 만들어진 지도 자료의 단서입니다. 이 단서와 후대의 식별 해석을 연결해 현재 지명까지 메모할지, 더 확인해야 한다고 보류할지 근거 강도를 정하세요.</p><div class="two-col"><button id="identify1877" class="evidence-btn interp" data-v="시마네현 제출 지도 단서와 후대의 식별 해석을 연결해 ‘외 1도’를 현재 독도로 식별한다.">지도·후대 해석을 연결해 식별</button><button id="hold1877" class="evidence-btn interp" data-v="지령 본문만으로 현재 지명을 직접 확정하지 않고, 지도와 후대 해석이 필요한 식별 문제로 보류한다.">현재 지명 식별은 보류</button></div><button id="hint1877" class="ghost" type="button">지도 읽기 힌트</button></div>`;
  let direct=S.direct1877, map=new Set(S.mapClues||[]);
  if(direct)$('#direct1877').classList.add('selected');
  $$('[data-map]').forEach(b=>{if(map.has(b.dataset.map))b.classList.add('selected')});
  $$('.interp').forEach(b=>{b.disabled=!mapReady();if(S.outsideOneStatus===b.dataset.v)b.classList.add('selected')});
  function ready(){$('#sceneNext').disabled=!(direct&&S.outsideOneStatus)}
  $('#direct1877').onclick=e=>{direct=true;S.direct1877=true;e.currentTarget.classList.add('selected');save();ready()};
  $$('[data-map]').forEach(b=>b.onclick=()=>{b.classList.toggle('selected');b.classList.contains('selected')?map.add(b.dataset.map):map.delete(b.dataset.map);S.mapClues=[...map];$$('.interp').forEach(x=>x.disabled=!mapReady());save()});
  $$('.interp').forEach(b=>b.onclick=()=>{if(b.disabled)return;$$('.interp').forEach(x=>x.classList.toggle('selected',x===b));S.outsideOneStatus=b.dataset.v;addNote('“죽도 외 1도”가 일본과 관계없다는 취지의 처리','1877 직접 문구');addNote(S.outsideOneStatus,'1877 식별 메모');save();renderSide();ready();feedback('지령 본문의 직접 문구와 지도 자료를 거쳐 만든 현재 지명 식별을 서로 다른 층으로 저장했습니다. 이 해석 선택에는 단일 정오 판정을 붙이지 않습니다.')});
  $('#hint1877').onclick=()=>{uniqPush(S.hintUsed,'1877-map');feedback('힌트: 지령 본문 표현만 보지 말고, 시마네현 제출 지도에 적힌 섬 이름과 두 섬의 상대 위치·거리 정보를 함께 읽어보세요.');save()};
  ready();
  $('#sceneNext').onclick=()=>{if(!S.draftHistory.some(x=>x.stage==='1877 확인'))S.draftHistory.push({stage:'1877 확인',text:S.outsideOneStatus});save();renderS3()};
}

function renderS3(){
  setSceneMeta(3,'1900년 대한제국 칙령 제41호','칙령이 직접 확인해 주는 것은 무엇이고, “석도=현재 독도”까지 말하려면 무엇이 더 필요할까?',['행정 개편의 맥락과 제1·2조를 읽는다.','행정 변화와 “울릉전도·죽도·석도” 구절을 각각 저장한다.','현재 독도와의 연결은 우선 “추가 근거 필요”로 남긴다.'],'필요한 1904년 자료를 조사한다');seen('ordinance1900');
  const s=D.sources.ordinance1900;
  $('#sceneContent').innerHTML=sourceCard('ordinance1900')+`<div class="task-card"><h3>본문 구절 저장</h3><div class="task-help">위 본문에서 확인한 문장을 문장 단위로 탭해 연구노트에 옮깁니다.</div>${s.selectable.map(x=>`<button class="evidence-btn ord" data-id="${x.id}" data-role="${x.role}" data-t="${esc(x.text)}">${esc(x.text)}</button>`).join('')}</div><div class="old-memo"><b>현재 연구 메모</b><br>1900년 원문에는 <strong>석도</strong>가 있다. 현재 독도와의 연결은 <strong>추가 근거 필요</strong>로 남긴다.</div>`;
  const sel=new Set(S.ordSelections||[]);
  $$('.ord').forEach(b=>{if(sel.has(b.dataset.id))b.classList.add('selected');b.onclick=()=>{b.classList.toggle('selected');b.classList.contains('selected')?sel.add(b.dataset.id):sel.delete(b.dataset.id);S.ordSelections=[...sel];save();$('#sceneNext').disabled=!(sel.has('ord-admin')&&sel.has('ord-area'))}});
  $('#sceneNext').disabled=!(sel.has('ord-admin')&&sel.has('ord-area'));
  $('#sceneNext').onclick=()=>{s.selectable.forEach(x=>{if(sel.has(x.id))addNote(x.text,x.role==='admin'?'1900 행정개편':'1900 관할 구역')});S.seokdoStatus='1900년 원문에는 “석도”가 있다. 현재 독도와의 연결은 추가 근거 필요.';if(!S.draftHistory.some(x=>x.stage==='1900 보류'))S.draftHistory.push({stage:'1900 보류',text:S.seokdoStatus});save();story('after1900',renderS4)};
}

function renderS4(){
  setSceneMeta(4,'선택 조사: 1904년의 이름과 시대 맥락','1900년의 “석도”와 1905년의 조치를 더 이해하려면 어떤 자료가 필요할까?',['원하는 보조자료만 선택해 조사한다.','니타카 자료를 열었다면 “누가 / 정보가 어디서 왔나 / 어떤 명칭인가”를 분해한다.','1904~1905 자료의 관계 강도를 현재 근거 범위에서 정한다.'],'1906년 후속 기록을 확인한다');
  $('#sceneContent').innerHTML=`<div class="archive"><h3>선택 자료실</h3><p class="task-help">모든 자료를 열 필요가 없습니다. 지금 질문에 필요하다고 생각하는 자료만 조사하세요.</p><div class="archive-grid">${archiveCard('niitaka1904','1904년 무렵 “독도”라는 명칭 사용 정보를 확인합니다.')}${archiveCard('toponymStudy','석도·독도 명칭 연결에 대한 현대 연구 논증을 봅니다.')}${archiveCard('tsushima1904','러일전쟁 중 군사·통신 조사 사실을 확인합니다.')}${archiveCard('timeline1904','청원·해군 조사·내각 결정·고시의 시간 순서를 확인합니다.')}</div></div><div id="niitakaBreakdown" class="task-card" ${S.openedOptional.includes('niitaka1904')?'':'hidden'}><h3>니타카 기록을 세 부분으로 분해</h3><p class="task-help">자료가 “무엇을 직접 보여주는지”를 확인하려면 정보의 주체와 전달 경로를 나눠 보세요.</p><div class="source-select-grid"><button class="evidence-btn npart" data-p="누가 기록했나: 일본 군함 니타카의 행동일지">누가 기록했나<br><b>일본 군함 니타카의 행동일지</b></button><button class="evidence-btn npart" data-p="정보는 어디서 왔나: 울릉도에서 리앙코르드암을 실제로 보았다는 사람에게서 들은 정보">정보는 어디서 왔나<br><b>울릉도에서 들은 정보</b></button><button class="evidence-btn npart" data-p="어떤 명칭인가: 한국인은 리앙코르드암을 독도라고 적는다는 정보">어떤 명칭인가<br><b>한국인은 “독도”라고 적음</b></button></div></div><div class="task-card"><h3>현재 근거로 1904~1905 관계를 어떻게 메모할까?</h3><div class="two-col"><button class="evidence-btn ctx" data-v="직접 원인이라고 주장한다">직접 원인이라고 주장한다</button><button class="evidence-btn ctx" data-v="1905년을 이해하는 시대적 배경 맥락으로 연결한다">배경 맥락으로 연결한다</button><button class="evidence-btn ctx" data-v="현재 자료만으로 관계 강도는 보류한다">관계 강도 보류</button></div></div>`;
  function bindNiitakaParts(){
    const partSet=new Set(S.niitakaParts||[]);
    $$('.npart').forEach(b=>{if(partSet.has(b.dataset.p))b.classList.add('selected');b.onclick=()=>{b.classList.toggle('selected');b.classList.contains('selected')?partSet.add(b.dataset.p):partSet.delete(b.dataset.p);S.niitakaParts=[...partSet];save();if(partSet.size===3){uniqPush(S.seokdoEvidence,'1904년 니타카 기록은 일본 군함이 울릉도에서 들은 명칭 정보를 적은 것이며, 그 안에 한국인이 “독도”라고 적는다는 내용이 있다.');addNote('1904년 일본 군함이 울릉도에서 들은 정보로 “한국인은 독도라고 적는다”는 명칭을 기록','1904 명칭');feedback('니타카 자료의 작성 주체·정보 경로·명칭을 분리했습니다. 대한제국의 공식 명명 문서로 바꾸어 읽지 않습니다.')}};});
  }
  bindArchive(id=>{if(id==='niitaka1904'){$('#niitakaBreakdown').hidden=false;bindNiitakaParts()}if(id==='toponymStudy'){uniqPush(S.seokdoEvidence,'현대 지명 연구가 석도와 독도의 표기·발음 관계를 논증한다.');addNote('현대 연구가 석도·독도 지명 관계를 논증','현대 연구')}if(id==='tsushima1904')addNote('1904년 일본 해군이 유선 전신소 설치 적합성을 조사','1904 군사·통신');save()});
  bindNiitakaParts();
  $$('.ctx').forEach(b=>{if(S.contextRelation===b.dataset.v)b.classList.add('selected');b.onclick=()=>{$$('.ctx').forEach(x=>x.classList.toggle('selected',x===b));S.contextRelation=b.dataset.v;save();$('#sceneNext').disabled=false;if(S.contextRelation.startsWith('직접'))feedback('현재 확보한 자료는 군사·통신 조사와 시간적 맥락을 보여주지만, 이것만으로 편입 결정의 직접 원인을 단일하게 확정하기에는 부족합니다. 다음 장면으로 진행할 수 있지만 이 경고가 연구 기록에 남습니다.',true);else feedback('현재 읽은 범위에 맞춰 관계 강도를 설정했습니다.')}});
  if(S.contextRelation)$('#sceneNext').disabled=false;
  $('#sceneNext').onclick=()=>story('before1906',renderS5);
}