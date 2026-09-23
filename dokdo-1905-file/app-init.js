'use strict';
function start(){S.lens=$('input[name="lens"]:checked')?.value||'한국사';S.phase='scene';save();story('intro',renderS0)}
function restore(){load();$('#vnToggle').setAttribute('aria-pressed',String(S.vn));$('#vnToggle').textContent=S.vn?'대화 ON':'대화 OFF';if(S.phase==='start'){showView('#startView');progress(0);return}if(S.phase==='result'){finish();return}const fn=[renderS0,renderS1,renderS2,renderS3,renderS4,renderS5,renderS6,renderS7][S.scene]||renderS0;fn()}
function reset(){if(confirm('현재 연구 기록을 지우고 처음부터 시작할까요?')){sessionStorage.removeItem(SK);S=defaultState();location.reload()}}
$('#startBtn').onclick=start;
$('#vnToggle').onclick=()=>{S.vn=!S.vn;$('#vnToggle').setAttribute('aria-pressed',String(S.vn));$('#vnToggle').textContent=S.vn?'대화 ON':'대화 OFF';save()};
$('#restartBtn').onclick=reset;$('#playAgain').onclick=reset;$('#retrySave').onclick=()=>submitResult(true);
restore();
