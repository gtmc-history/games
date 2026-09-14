const GAME_ID='cityshift';
const PARAMS=new URLSearchParams(location.search);
const CLASS=(PARAMS.get('class')||'미입력').slice(0,40);
const PREVIEW=PARAMS.get('preview')==='1';
const STORAGE_KEY='cityshift_v2_state';
const SCENE_LABELS=['익명 초고','대전·공주','시간차','이리 적용','나주 반례','목포','마감','후속 질문'];

const SUPABASE=window.CHARLIE_CONFIG||{};
const APP=document.getElementById('app');
const PROGRESS=document.getElementById('progress');
const TOAST=document.getElementById('toast');
document.getElementById('classBadge').textContent=PREVIEW?`검수 모드 · 저장 안 함`:`반 ${CLASS}`;

const GROUP_FOR_SCENE={1:'intro',2:'daejeon_gongju',3:'daejeon_gongju',4:'iri_naju',5:'iri_naju',6:'mokpo'};

function id(prefix='id'){
  if(globalThis.crypto?.randomUUID)return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
function blankState(){return{
  version:'2.0',scene:1,mode:'vn',dialogueIndex:0,phase:0,resultId:id('cityshift'),
  initialPrediction:'',initialLead:'',currentDraft:'',
  evidenceMarks:[],evidenceAttachments:[],openQuestions:[],revisionHistory:[],evidenceSeen:[],
  selectedActions:[],finalModel:'',postInquiry:'',completedAt:'',submittedAt:'',submitError:'',
  timerGroup:'intro',timerStarted:Date.now(),durations:{intro:0,daejeon_gongju:0,iri_naju:0,mokpo:0}
}}
let S=blankState();
function save(){try{sessionStorage.setItem(STORAGE_KEY,JSON.stringify(S))}catch(e){console.warn('state save failed',e)}}
function load(){try{const raw=sessionStorage.getItem(STORAGE_KEY);if(raw)S={...blankState(),...JSON.parse(raw)}}catch(e){console.warn('state load failed',e);S=blankState()}}
function escapeHtml(value){return String(value??'').replace(/[&<>'\"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[ch]))}
function toast(msg){TOAST.textContent=msg;TOAST.classList.add('on');clearTimeout(toast._t);toast._t=setTimeout(()=>TOAST.classList.remove('on'),1800)}

function tickGroup(nextScene){
  const now=Date.now();
  if(S.timerGroup&&S.timerStarted&&S.durations[S.timerGroup]!=null){S.durations[S.timerGroup]+=Math.max(0,now-S.timerStarted)}
  const next=GROUP_FOR_SCENE[nextScene]||'';S.timerGroup=next;S.timerStarted=next?now:0;
}
function setScene(scene,mode='vn',phase=0){tickGroup(scene);S.scene=scene;S.mode=mode;S.phase=phase;S.dialogueIndex=0;S.selectedActions=[];save();render();window.scrollTo({top:0,behavior:'smooth'})}

const DIALOGUE={
  1:[
    ['편집 담당자','이번 특집의 질문은 하나예요. ‘무엇이 도시의 자리를 바꿨는가?’'],
    ['자료 담당자','먼저 지명은 가려 둘게요. 두 조건만 보고 첫 문장을 써 주세요.'],
    ['편집 담당자','이 첫 문장은 마감 때 다시 펼쳐 볼 겁니다. 나중에 고칠 수는 있어도, 처음 문장은 지우지 않아요.']
  ],
  2:[
    ['자료 담당자','첫 봉투입니다. 이제 지명을 공개할게요. 공주와 대전입니다.'],
    ['편집 담당자','지도는 정답판이 아니라 자료예요. 철도선과 도시 변화 자료에서 근거가 될 구절을 직접 표시해 보세요.']
  ],
  3:[
    ['자료 담당자','대전·공주 자료에서 날짜 세 개를 따로 뽑았습니다.'],
    ['편집 담당자','철도라는 설명은 남길 수 있어요. 하지만 1905, 1914, 1932를 한 줄짜리 원인으로 묶어도 될까요?']
  ],
  4:[
    ['편집 담당자','대전에서 고친 설명을 다른 도시에도 한번 적용해 봅시다.'],
    ['자료 담당자','이번엔 이리입니다. 길게 조사하지 않고, 현재 설명이 여기에서도 버티는지만 확인할게요.']
  ],
  5:[
    ['자료 담당자','같은 호남선에서 다른 자료가 나왔습니다. 나주예요.'],
    ['편집 담당자','앞의 설명이 맞다면 여기서도 비슷한 결과가 나와야 할까요? 새 자료는 한꺼번에 열지 않겠습니다.']
  ],
  6:[
    ['편집 담당자','이제 지금까지 고친 원고를 목포에 적용해 봅시다.'],
    ['자료 담당자','이번에는 원인 이름보다 날짜 순서가 중요할지도 모르겠습니다. 첫 봉투부터 열죠.']
  ],
  7:[
    ['편집 담당자','마감입니다. 처음 문장과 지금까지의 교정 흔적을 한 화면에 놓겠습니다.'],
    ['자료 담당자','끝까지 단정하지 않은 질문도 지우지 않았습니다.'],
    ['편집 담당자','이제 마지막 한두 문장만 당신의 말로 정리해 주세요.']
  ],
  8:[
    ['편집 담당자','원고는 끝났습니다. 그런데 도시가 커졌다는 말만으로는 아직 남는 질문이 있어요.'],
    ['자료 담당자','성장은 도시 안의 모든 사람에게 같은 변화였을까요? 다음 수업에서 확인할 질문을 하나 남겨 봅시다.']
  ]
};

const SOURCES={
  D4:{title:'대전과 공주의 변화',meta:'대전광역시 근대사 자료 · 우리역사넷 계열 / 교육용 요약',info:'철도 부설 이후 대전이 신흥도시로 성장했고, 공주는 철도 연선 도시의 성장 속에서 상대적 위상이 낮아진 사례로 다룬다. 절대 인구 감소를 뜻하지 않는다.',phrases:[
    ['d4_rail','철도 부설 이후'],['d4_daejeon','대전은 새 중심지로 부상했다.'],['d5_gongju','공주는 상대적으로 도시 위상이 낮아졌다.']
  ]},
  Dtimeline:{title:'세 시점 연표',meta:'대전광역시 공식 연혁 / 사실 카드',info:'1905 대전역 개통, 1914 호남선 개통, 1932년 10월 1일 충남도청 공주→대전 이전. 연표 자체는 철도 때문에 도청이 이전했다고 말하지 않는다.',timeline:[['1905','대전역 개통'],['1914','호남선 개통'],['1932','충남도청 공주→대전 이전']],phrases:[
    ['d1_1905','1905년 대전역 개통'],['d2_1914','1914년 호남선 개통'],['d3_1932','1932년 충남도청 이전']
  ]},
  I12:{title:'이리 적용 자료',meta:'익산시·지역사 연구 / 교육용 요약',info:'1912년 호남선·군산선이 이리 지역에 연결된 사실과, 이리가 일제강점기 철도를 중심으로 형성된 식민도시의 성격을 띠었다는 연구 요약을 결합했다. ‘1912 이리역 개설’처럼 역명 변천은 핵심 사실로 쓰지 않는다.',phrases:[
    ['i1_rail','1912년 철도망이 이리 지역에 연결되었다.'],['i2_city','이리는 철도를 중심으로 형성된 근대 식민도시의 성격을 띠었다.']
  ]},
  N12:{title:'나주에서 깨지는 규칙',meta:'교과서 + 철도·지역사 자료 / 교육용 요약',info:'호남선 통과 사실과 교과서의 나주 상대적 쇠퇴 사례를 함께 놓는다. ‘상대적 쇠퇴’는 절대 인구 감소와 같은 말이 아니다.',phrases:[
    ['n1_pass','호남선은 나주를 통과했다.'],['n2_relative','교과서는 나주를 상대적 쇠퇴 사례로 제시한다.']
  ]},
  N3:{title:'광주의 행정 기능',meta:'광주광역시 역사민속박물관 / 교육용 요약',info:'1896년 전남 관찰부가 광주에 설치되고 광주가 행정 중심지가 되었다는 사실을 확인한다. 이 사실만으로 나주 쇠퇴와의 직접 인과를 확정하지 않는다.',phrases:[
    ['n3_1896','1896년 전남 관찰부가 광주에 설치되었다.'],['n3_admin','광주는 전남의 행정 중심지가 되었다.']
  ]},
  N4:{title:'영산포의 별도 성장 양상',meta:'한국민족문화대백과사전 「영산포」 / 교육용 요약',info:'영산포가 포구·산물 집산지로 번성했고 1914년 철도역과 선창 연결 이후 해상·육상 교통의 결절점으로 더 번창했다는 내용을 요약한다. ‘나주의 중심이 영산포로 이동했다’고 말하지 않는다.',phrases:[
    ['n4_port','영산포는 일제강점기 포구와 산물 집산지로 번성했다.'],['n4_1914','1914년 철도와 선창을 잇는 교통 결절점으로 더 성장했다.']
  ]},
  N5:{title:'식민지 경제 지배의 흔적',meta:'한국민족문화대백과사전 · 공공 지역자료 / 맥락 카드',info:'동양척식주식회사 건물, 식산은행, 일본인 지주 가옥 등의 흔적은 영산포 성장의 식민지적 맥락을 함께 보게 한다.',phrases:[
    ['n5_dongcheok','동양척식주식회사 건물이 남아 있다.'],['n5_control','식산은행·일본인 지주 가옥 등 식민지 경제 지배의 흔적이 남아 있다.']
  ]},
  M1:{title:'첫 번째 날짜 — 개항',meta:'목포시 공식 역사 / 사실 카드',info:'목포는 1897년 10월 1일 개항했다. 개항이 모든 도시 성장의 충분조건이라는 뜻은 아니다.',phrases:[
    ['m1_open','1897년 10월 1일 목포가 개항했다.']
  ]},
  M2:{title:'두 번째 날짜 — 철도',meta:'목포시 공식 역사 / 사실 카드',info:'1914년 호남선 전 구간 개통으로 대전과 목포가 철도로 연결되었다. 개통 사실만으로 철도의 성장 기여 정도가 직접 확인되는 것은 아니다.',phrases:[
    ['m2_rail','1914년 호남선 전 구간이 개통되었다.'],['m2_after','철도 연결은 1897년 개항보다 뒤에 일어났다.']
  ]},
  M3:{title:'1932년의 목포',meta:'목포시 공식 역사 / 결과 카드',info:'1932년 시역 확대와 인구 약 6만, 전국 6대 도시라는 위상을 확인한다. 도시 규모의 성장과 주민 모두의 삶의 질을 동일시하지 않는다.',phrases:[
    ['m3_1932','1932년 목포는 시역이 확대되었다.'],['m3_six','인구 약 6만으로 전국 6대 도시 가운데 하나로 제시된다.']
  ]}
};

const STAGES={
  '2-0':{title:'대전·공주 — 첫 조사',docs:['D4'],diagram:'assets/rail-daejeon.svg',diagramCaption:'공주·대전과 경부선·호남선의 관계를 단순화한 수업용 노선 관계도(축척 없음).',actions:[
    {tag:'add_rail_condition',label:'철도·새 교통망을 조건으로 추가',detail:'첫 원고에 교통망이라는 조건을 덧붙인다.',summary:'철도·새 교통망을 도시 변화의 한 조건으로 추가했다.'},
    {tag:'narrow_single_rule',label:'하나의 조건만으로 단정하지 않게 범위를 좁힘',detail:'철도가 중요해 보여도 단일 규칙으로 일반화하지 않는다.',summary:'철도 하나만으로 모든 도시 변화를 설명하지 않도록 일반화를 좁혔다.'},
    {tag:'hold_first_case',label:'? 아직 원인을 단정하지 않음',detail:'자료는 확인했지만 인과 설명은 더 보류한다.',summary:'첫 사례의 원인을 아직 단정하지 않고 유보했다.',hold:true}
  ],next:[3,'vn',0]},
  '3-0':{title:'대전·공주 — 시간차 반론',docs:['Dtimeline'],actions:[
    {tag:'add_admin_condition',label:'행정 기능을 별도 조건으로 추가',detail:'1932년 도청 이전을 철도와 구분되는 조건 후보로 남긴다.',summary:'행정 기능 변화를 철도와 구분되는 조건 후보로 추가했다.',question:'1932년 행정 기능 변화가 대전·공주의 위상 변화에 어느 정도 기여했는가 — 연표에는 직접 인과가 없음'},
    {tag:'narrow_direct_cause',label:'철도→도청 이전의 직접 인과는 쓰지 않음',detail:'시차와 사실은 남기되 직접 원인 관계를 단정하지 않는다.',summary:'철도 개통과 도청 이전 사이의 직접 인과는 원고에서 단정하지 않았다.'},
    {tag:'hold_admin_relation',label:'? 행정 기능의 기여 정도를 유보',detail:'행정 기능이 중요할 수 있지만 이 자료만으로 정도를 확정하지 않는다.',summary:'행정 기능이 도시 위상에 미친 기여 정도를 유보했다.',hold:true,question:'1932년 행정 기능 변화가 대전·공주의 위상 변화에 어느 정도 기여했는가 — 직접 연결 자료 미확보'}
  ],feedback:'연표에는 세 사건의 시차가 보이지만, 철도가 도청 이전을 직접 일으켰다는 인과는 적혀 있지 않습니다.',next:[4,'vn',0]},
  '4-0':{title:'이리 — 적용 테스트',docs:['I12'],diagram:'assets/rail-honam.svg',diagramCaption:'호남선과 이리·광주·나주·영산포의 관계를 단순화한 수업용 노선 관계도(축척 없음).',exclusive:true,actions:[
    {tag:'apply_rail_rule',label:'현재 철도 설명을 이리에도 적용',detail:'앞에서 만든 설명이 이리 자료에서는 어느 정도 맞아 보인다고 본다.',summary:'대전에서 고친 철도 관련 설명을 이리에도 적용했다.'},
    {tag:'hold_iri',label:'? 이리에서도 단일 원인은 유보',detail:'철도 중심 형성은 확인하지만 충분조건으로는 보지 않는다.',summary:'이리에서도 철도를 충분조건으로 단정하지 않고 유보했다.',hold:true}
  ],next:[5,'vn',0]},
  '5-0':{title:'나주 — 첫 번째 반례',docs:['N12'],diagram:'assets/rail-honam.svg',diagramCaption:'같은 호남선이 여러 도시를 잇지만 결과가 같았다는 뜻은 아니다.',actions:[
    {tag:'narrow_rail_sufficient',label:'“철도 통과=성장” 일반화를 좁힘',detail:'철도 통과만으로 같은 결과를 예상할 수 없다고 고친다.',summary:'나주 반례를 보고 철도 통과를 성장의 충분조건으로 보던 일반화를 좁혔다.'},
    {tag:'hold_rail_naju',label:'? 나주 변화와 철도 관계를 유보',detail:'철도 통과와 상대적 쇠퇴가 함께 보이지만 관계를 단정하지 않는다.',summary:'나주의 상대적 위상 변화와 철도의 관계를 유보했다.',hold:true,question:'호남선 통과와 나주의 상대적 위상 변화는 어떤 관계였는가 — 직접 인과 미확인'}
  ],next:[5,'desk',1]},
  '5-1':{title:'나주 — 두 번째 봉투: 광주 행정 기능',docs:['N3'],actions:[
    {tag:'add_admin_hypothesis',label:'행정 기능을 새 원인 후보로 추가',detail:'광주의 행정 중심화를 새 조건 후보로 두되, 나주 쇠퇴의 직접 원인이라고 쓰지 않는다.',summary:'광주의 행정 중심화를 새 조건 후보로 추가했지만 나주 변화와의 직접 인과는 확정하지 않았다.',question:'광주의 행정 중심화가 나주의 상대적 위상 변화에 어떤 영향을 주었는가 — 자료에 직접 인과가 없음'},
    {tag:'hold_gwangju_naju',label:'? 광주→나주 직접 연결은 유보',detail:'광주의 행정 기능 사실과 나주 변화 사이를 바로 연결하지 않는다.',summary:'광주의 행정 중심화와 나주 변화 사이의 직접 연결을 유보했다.',hold:true,question:'광주의 행정 중심화가 나주의 상대적 위상 변화에 어떤 영향을 주었는가 — 직접 연결 자료 미확보'},
    {tag:'withdraw_gwangju_naju',label:'직접 연결 문장은 원고에 쓰지 않음',detail:'광주 행정 중심화 사실은 남기되 나주 쇠퇴의 직접 원인 문장은 철회한다.',summary:'광주 행정 중심화와 나주 쇠퇴를 직접 연결하는 문장은 원고에서 철회했다.',withdraw:true,removeQuestion:'광주의 행정 중심화'}
  ],feedback:'이 자료는 광주의 행정 기능을 확인하지만, 나주 변화와의 직접 인과는 말하지 않습니다.',next:[5,'desk',2]},
  '5-2':{title:'나주 — 세 번째 봉투: 영산포',docs:['N4','N5'],actions:[
    {tag:'add_spatial_difference',label:'같은 나주군 안의 서로 다른 변화 양상을 추가',detail:'지역 전체가 하나의 방향으로 변했다는 설명을 피한다.',summary:'같은 나주군 안에서도 나주읍과 영산포의 변화 양상이 하나로 같지 않았음을 설명에 추가했다.'},
    {tag:'narrow_region_generalization',label:'지역 전체를 한 방향으로 묶는 일반화를 좁힘',detail:'나주군 전체를 ‘성장’ 또는 ‘쇠퇴’ 하나로 표현하지 않는다.',summary:'한 지역의 변화를 하나의 성장·쇠퇴 방향으로 묶던 일반화를 좁혔다.'},
    {tag:'add_colonial_context',label:'식민지 경제 지배의 맥락을 함께 기록',detail:'도시 성장 자체를 모두에게 같은 이익으로 표현하지 않는다.',summary:'영산포의 성장 양상과 함께 식민지 경제 지배의 흔적을 원고에 기록했다.'}
  ],next:[6,'vn',0]},
  '6-0':{title:'목포 — 첫 번째 날짜: 1897 개항',docs:['M1'],diagram:'assets/mokpo-port.svg',diagramCaption:'개항·항만의 시점을 읽기 위한 수업용 삽화. 실제 지형 축척도 아님.',actions:[
    {tag:'add_port_onset',label:'개항·항만을 성장 시작의 조건 후보로 추가',detail:'철도보다 앞선 1897년의 조건을 현재 설명에 반영한다.',summary:'목포에서는 1897년 개항·항만을 성장 시작을 설명할 조건 후보로 추가했다.'},
    {tag:'hold_port_sufficiency',label:'? 개항 하나만으로는 충분조건이라 단정하지 않음',detail:'개항의 선행성은 확인하되 모든 성장을 하나로 설명하지 않는다.',summary:'개항이 먼저였다는 사실은 반영하되 개항 하나를 충분조건으로 단정하지 않았다.',hold:true}
  ],next:[6,'desk',1]},
  '6-1':{title:'목포 — 두 번째 날짜: 1914 철도',docs:['M2'],diagram:'assets/mokpo-rail.svg',diagramCaption:'1914년 대전–목포 철도 연결 관계를 단순화한 수업용 노선도(축척 없음).',actions:[
    {tag:'limit_rail_after_1914',label:'철도 설명의 적용 시기를 1914년 이후로 제한',detail:'철도는 1897년보다 뒤이므로 “성장 시작” 설명에는 쓰지 않는다.',summary:'목포에서 철도 설명의 적용 시기를 1914년 이후로 제한했다.',timeScope:'1914~'},
    {tag:'hold_rail_contribution',label:'? 1914년 이후 철도의 기여 정도는 유보',detail:'철도 개통 사실은 확인하지만 성장 기여 정도는 직접 자료가 더 필요하다.',summary:'1914년 이후 철도가 목포 성장에 기여한 정도는 유보했다.',hold:true,question:'1914년 이후 철도가 목포 성장에 어느 정도 기여했는가 — 직접 연결 자료 미확보'}
  ],feedback:'시간 순서는 분명합니다: 개항 1897 → 철도 1914. 철도를 목포 성장의 “시작 원인”으로 둘 수는 없습니다.',next:[6,'desk',2]},
  '6-2':{title:'목포 — 세 번째 날짜: 1932 결과',docs:['M3'],actions:[
    {tag:'keep_multi_condition',label:'도시마다 조건과 시점을 구분하는 설명 유지',detail:'개항·철도·행정 기능을 하나의 보편 규칙으로 합치지 않는다.',summary:'목포 결과까지 본 뒤 도시마다 조건과 시점을 구분하는 설명을 유지했다.'},
    {tag:'narrow_growth_meaning',label:'“도시 성장=모두에게 같은 이익” 표현을 피함',detail:'도시 규모의 성장과 주민의 경험을 같은 것으로 쓰지 않는다.',summary:'도시 규모의 성장과 그 안의 모든 사람의 삶을 같은 의미로 쓰지 않도록 범위를 좁혔다.'}
  ],next:[7,'vn',0]}
};

function sceneTitle(){
  const titles={1:'익명 초고',2:'대전·공주 — 첫 조사',3:'대전·공주 — 시간차',4:'이리 — 적용 테스트',5:'나주 — 규칙이 깨지는 곳',6:'목포 — 먼저 온 조건',7:'마감 — 처음 문장 다시 보기',8:'후속 질문'};return titles[S.scene]
}
function renderProgress(){PROGRESS.innerHTML=SCENE_LABELS.map((x,i)=>`<span class="progress-step ${S.scene===i+1?'on':S.scene>i+1?'done':''}">${i+1}. ${x}</span>`).join('')}

function render(){renderProgress();if(S.mode==='vn')renderVN();else if(S.scene===1)renderIntro();else if(S.scene>=2&&S.scene<=6)renderDesk();else if(S.scene===7)renderFinal();else if(S.scene===8)renderPost();bindGlobal()}
function renderVN(){
  const lines=DIALOGUE[S.scene]||[];const i=Math.min(S.dialogueIndex,lines.length-1);const [speaker,text]=lines[i]||['편집 담당자','자료를 확인해 봅시다.'];const last=i>=lines.length-1;
  APP.innerHTML=`<h1 class="scene-title">${sceneTitle()}</h1><p class="scene-sub">${S.scene===1?'일제강점기 식민지 도시 변화와 경제 지배의 맥락을 다룹니다.':'자료가 원고를 바꿀 때만 다음 장으로 넘어갑니다.'}</p>
  <section class="vn-stage">
    <div class="office-prop" aria-hidden="true"></div>
    <div class="character editor"><img class="portrait" src="assets/editor.svg" alt="편집 담당자 일러스트"><span class="char-label">편집 담당자</span></div>
    <div class="vn-dialogue"><div class="speaker">${escapeHtml(speaker)}</div><div class="speech">${escapeHtml(text)}</div><div class="dialogue-controls">${last?`<button id="leaveVN" class="primary-btn" type="button">${S.scene===7?'마감 원고 펼치기':S.scene===8?'후속 자료 보기':S.scene===1?'초고 쓰기':'자료 책상으로'}</button>`:`<button id="nextLine" class="primary-btn" type="button">계속</button>`}</div></div>
    <div class="character archivist"><img class="portrait" src="assets/archivist.svg" alt="자료 담당자 일러스트"><span class="char-label">자료 담당자</span></div>
  </section>`;
  document.getElementById('nextLine')?.addEventListener('click',()=>{S.dialogueIndex++;save();render()});
  document.getElementById('leaveVN')?.addEventListener('click',()=>{S.mode=S.scene===7?'result':S.scene===8?'post':S.scene===1?'intro':'desk';S.dialogueIndex=0;save();render()});
}

function renderIntro(){
  APP.innerHTML=`<h1 class="scene-title">익명 초고</h1><p class="scene-sub">지명·철도·지도 없이 두 조건만 보고 첫 설명을 남깁니다. 이 문장은 잠기며 마지막에 다시 나타납니다.</p>
  <div class="intro-layout">
    <section class="brief-card"><span class="chapter-badge">초고 0 · 조건만 공개</span><h2>어느 곳이 앞으로 도시 성장에 더 유리해 보이나요?</h2>
      <div class="condition-grid">
        <button class="condition-card ${S.initialPrediction==='A'?'selected':''}" data-pick="A" type="button"><strong>조건 A</strong>오래된 행정 중심지<br><span class="helper">관청과 기존 중심 기능이 모여 있던 곳</span></button>
        <button class="condition-card ${S.initialPrediction==='B'?'selected':''}" data-pick="B" type="button"><strong>조건 B</strong>장이 서던 작은 마을<br><span class="helper">기존의 큰 행정 중심은 아니었던 곳</span></button>
      </div>
      <p class="helper">현재의 도시 규모나 이름을 떠올리지 말고, 지금 보이는 조건만으로 판단하세요.</p>
    </section>
    <section class="draft-paper"><h2>첫 문장</h2><p class="helper">선택한 조건이 더 유리하다고 본 이유를 30~60자 정도의 한 문장으로 적습니다.</p>
      <textarea id="initialLead" maxlength="90" placeholder="예: 기존의 행정 기능이 모여 있던 곳은 사람과 기능이 계속 모이기 쉬울 것 같다.">${escapeHtml(S.initialLead)}</textarea>
      <div class="helper"><span id="leadCount">${S.initialLead.length}</span>/90 · 30자 이상이면 잠글 수 있습니다.</div><div id="introValidation" class="validation"></div>
      <div class="scene-controls"><button id="lockLead" class="primary-btn" type="button">첫 문장 잠그고 지명 공개</button></div>
    </section>
  </div>`;
  document.querySelectorAll('[data-pick]').forEach(b=>b.addEventListener('click',()=>{S.initialPrediction=b.dataset.pick;save();render()}));
  document.getElementById('initialLead').addEventListener('input',e=>{S.initialLead=e.target.value;document.getElementById('leadCount').textContent=e.target.value.length;save()});
  document.getElementById('lockLead').addEventListener('click',()=>{const v=document.getElementById('introValidation');if(!S.initialPrediction){v.textContent='먼저 조건 A 또는 B를 고르세요.';return}if(S.initialLead.trim().length<30){v.textContent='첫 설명을 30자 이상으로 적어 주세요.';return}S.currentDraft=S.initialLead.trim();save();setScene(2,'vn',0)});
}

function stage(){return STAGES[`${S.scene}-${S.phase}`]}
function phraseById(pid){for(const [sid,src] of Object.entries(SOURCES)){for(const [id,text] of src.phrases||[])if(id===pid)return{sourceId:sid,text,title:src.title}}return null}
function isMarked(pid){return S.evidenceMarks.includes(pid)}
function isClipped(pid){return S.evidenceAttachments.some(a=>a.phraseId===pid)}
function activePhaseKey(){return `${S.scene}-${S.phase}`}
function phaseClips(){return S.evidenceAttachments.filter(a=>a.stageKey===activePhaseKey())}

function documentHtml(sourceId,src){
  const phrases=(src.phrases||[]).map(([pid,text])=>`<button type="button" class="phrase ${isMarked(pid)?'marked':''} ${isClipped(pid)?'clipped':''}" data-phrase="${pid}" aria-pressed="${isMarked(pid)}">${escapeHtml(text)}</button>`).join(' ');
  const timeline=src.timeline?`<div class="timeline">${src.timeline.map(([y,t],i)=>`${i?'<div class="sequence-arrow">→</div>':''}<div class="time-card"><b>${y}</b><span>${escapeHtml(t)}</span></div>`).join('')}</div>`:'';
  return `<article class="document" data-source="${sourceId}"><div class="doc-meta">${escapeHtml(src.meta)}</div><h3>${escapeHtml(src.title)}</h3>${timeline}<p>${phrases}</p><button class="doc-info-btn" data-info="${sourceId}" type="button">자료 정보 · 출처 범위 보기</button></article>`
}
function revisionVisuals(){
  if(!S.revisionHistory.length)return `<div class="revision-empty">아직 빨간펜 교정 흔적이 없습니다.</div>`;
  return `<div class="revision-stack">${S.revisionHistory.slice(-7).map(r=>`<div class="revision-note ${r.hold?'hold':''} ${r.withdraw?'withdraw':''}">${escapeHtml(r.summary)}${r.timeScope?`<time>적용 시기 ${escapeHtml(r.timeScope)}</time>`:''}</div>`).join('')}</div>`
}
function currentClipsHtml(){
  const clips=S.evidenceAttachments.slice(-8);if(!clips.length)return `<div class="empty-state">밑줄 친 구절을 ‘근거로 클립’하면 여기에 붙습니다.</div>`;
  return `<div class="clip-list">${clips.map(a=>{const p=phraseById(a.phraseId);return `<div class="clip-card"><b>${escapeHtml(p?.title||a.sourceId)}</b>${escapeHtml(p?.text||a.phraseId)}</div>`}).join('')}</div>`
}
function openQuestionsHtml(){if(!S.openQuestions.length)return `<div class="empty-state">아직 남겨 둔 ?가 없습니다.</div>`;return `<div class="clip-list">${S.openQuestions.slice(-5).map(q=>`<div class="clip-card question-card"><b>? 유보</b>${escapeHtml(q.text)}</div>`).join('')}</div>`}
function actionButtons(cfg){return cfg.actions.map(a=>`<button type="button" class="action-btn ${S.selectedActions.includes(a.tag)?'selected':''} ${a.hold?'hold':''}" data-action="${a.tag}" aria-pressed="${S.selectedActions.includes(a.tag)}">${escapeHtml(a.label)}<small>${escapeHtml(a.detail)}</small></button>`).join('')}
function stageIntro(){
  if(S.scene===5&&S.phase===1)return `<div class="envelope"><h3>두 번째 봉투</h3><p>철도만으로 설명하기 어려워지자, 광주의 행정 기능 자료가 들어왔습니다.</p></div>`;
  if(S.scene===5&&S.phase===2)return `<div class="envelope"><h3>세 번째 봉투</h3><p>이번에는 같은 나주군 안의 영산포 자료입니다. 지역 전체를 한 방향으로 묶어도 되는지 확인하세요.</p></div>`;
  if(S.scene===6&&S.phase===1)return `<div class="envelope"><h3>두 번째 날짜</h3><p>개항보다 17년 뒤, 철도 자료가 도착했습니다.</p></div>`;
  if(S.scene===6&&S.phase===2)return `<div class="envelope"><h3>세 번째 날짜</h3><p>이제 1932년의 결과를 확인합니다. 규모의 성장과 원인을 구분해서 읽으세요.</p></div>`;
  return '';
}
function renderDesk(){
  const cfg=stage();if(!cfg){APP.innerHTML='<p>장면 구성을 찾지 못했습니다.</p>';return}
  cfg.docs.forEach(x=>{if(!S.evidenceSeen.includes(x))S.evidenceSeen.push(x)});save();
  const selected=S.evidenceMarks.filter(pid=>cfg.docs.some(sid=>SOURCES[sid].phrases?.some(([id])=>id===pid))&&!isClipped(pid));
  APP.innerHTML=`<h1 class="scene-title">${escapeHtml(cfg.title)}</h1><p class="scene-sub">문서에서 근거 구절을 직접 표시하고, 현재 원고에 클립한 뒤 빨간펜 교정을 남기세요.</p>${stageIntro()}
  <div class="desk">
    <div class="desk-column"><section class="panel"><div class="panel-head"><strong>자료 묶음</strong><span class="helper">밑줄 → 클립</span></div><div class="panel-body">
      ${cfg.diagram?`<div class="diagram-wrap"><img src="${cfg.diagram}" alt=""><div class="diagram-caption">${escapeHtml(cfg.diagramCaption||'')}</div></div>`:''}
      ${cfg.docs.map(id=>documentHtml(id,SOURCES[id])).join('')}
      <div class="mark-toolbar"><div class="selected-count">현재 새로 표시한 구절 ${selected.length}개</div><button id="clipEvidence" class="clip-btn" type="button" ${selected.length?'':'disabled'}>선택 구절을 원고에 근거로 클립</button></div>
    </div></section></div>
    <div class="desk-column"><section class="panel"><div class="panel-head"><strong>교정 원고</strong><span class="helper">같은 문장을 계속 고칩니다</span></div><div class="panel-body"><article class="manuscript"><div class="draft-kicker">처음 문장 · 원문 보존</div><div class="draft-text">${escapeHtml(S.initialLead)}</div>${revisionVisuals()}
      <div class="red-pencil"><h4>빨간펜 교정</h4><div class="action-grid">${actionButtons(cfg)}</div>${cfg.feedback?`<div class="draft-feedback ${S.scene===6&&S.phase===1?'fact':'question'}">${escapeHtml(cfg.feedback)}</div>`:''}</div>
    </article></div></section></div>
    <div class="desk-column"><section class="panel"><div class="panel-head"><strong>근거 클립 · ? 메모</strong><span class="helper">정답 점수 없음</span></div><div class="panel-body"><div class="right-section"><h4>붙인 근거</h4>${currentClipsHtml()}</div><div class="right-section"><h4>끝까지 확인할 질문</h4>${openQuestionsHtml()}</div></div></section></div>
  </div>
  <div id="deskValidation" class="validation"></div><div class="scene-controls"><button id="commitRevision" class="primary-btn" type="button">${S.scene===4?'적용 테스트 마치기':(S.scene===5&&S.phase<2)||(S.scene===6&&S.phase<2)?'교정 저장하고 다음 봉투 열기':'현재 교정본 제출'}</button></div>`;
  bindDesk(cfg);
}
function bindDesk(cfg){
  document.querySelectorAll('[data-phrase]').forEach(btn=>btn.addEventListener('click',()=>{const pid=btn.dataset.phrase;if(isClipped(pid)){toast('이미 원고에 클립한 근거입니다.');return}const set=new Set(S.evidenceMarks);set.has(pid)?set.delete(pid):set.add(pid);S.evidenceMarks=[...set];save();render()}));
  document.getElementById('clipEvidence')?.addEventListener('click',()=>{const stageKey=activePhaseKey();const valid=S.evidenceMarks.filter(pid=>cfg.docs.some(sid=>SOURCES[sid].phrases?.some(([x])=>x===pid))&&!isClipped(pid));valid.forEach(pid=>{const p=phraseById(pid);S.evidenceAttachments.push({phraseId:pid,sourceId:p?.sourceId||'',stageKey,claimId:'main'})});S.evidenceMarks=S.evidenceMarks.filter(x=>!valid.includes(x));save();toast(`${valid.length}개 근거를 원고에 클립했습니다.`);render()});
  document.querySelectorAll('[data-action]').forEach(btn=>btn.addEventListener('click',()=>{const tag=btn.dataset.action;if(cfg.exclusive){S.selectedActions=S.selectedActions.includes(tag)?[]:[tag]}else{const set=new Set(S.selectedActions);set.has(tag)?set.delete(tag):set.add(tag);S.selectedActions=[...set]}save();render()}));
  document.querySelectorAll('[data-info]').forEach(btn=>btn.addEventListener('click',()=>openSourceInfo(btn.dataset.info)));
  document.getElementById('commitRevision')?.addEventListener('click',()=>commitStage(cfg));
}
function addQuestion(text,stageKey){if(!text)return;if(!S.openQuestions.some(q=>q.text===text))S.openQuestions.push({id:id('q'),text,stageKey})}
function removeQuestions(match){if(!match)return;S.openQuestions=S.openQuestions.filter(q=>!q.text.includes(match))}
function commitStage(cfg){
  const v=document.getElementById('deskValidation');const clips=phaseClips();if(!clips.length){v.textContent='먼저 자료에서 근거 구절을 하나 이상 밑줄 치고 원고에 클립하세요.';return}if(!S.selectedActions.length){v.textContent='현재 자료를 본 뒤 빨간펜 교정을 하나 이상 남기세요.';return}v.textContent='';
  const selected=cfg.actions.filter(a=>S.selectedActions.includes(a.tag));selected.forEach(a=>{if(a.question)addQuestion(a.question,activePhaseKey());if(a.removeQuestion)removeQuestions(a.removeQuestion);S.revisionHistory.push({id:id('rev'),scene:S.scene,phase:S.phase,stageKey:activePhaseKey(),tag:a.tag,summary:a.summary,hold:!!a.hold,withdraw:!!a.withdraw,timeScope:a.timeScope||'',evidenceIds:clips.map(x=>x.phraseId),at:new Date().toISOString()})});
  S.currentDraft=synthesizeDraft();S.selectedActions=[];save();const [scene,mode,phase]=cfg.next;setScene(scene,mode,phase)
}
function synthesizeDraft(){const latest=S.revisionHistory.filter(r=>!r.withdraw).slice(-4).map(r=>r.summary);return latest.length?`${S.initialLead} / ${latest.join(' / ')}`:S.initialLead}

function openSourceInfo(sourceId){const src=SOURCES[sourceId];if(!src)return;document.getElementById('sourceDialogTitle').textContent=src.title;document.getElementById('sourceDialogBody').innerHTML=`<p>${escapeHtml(src.info)}</p><p class="helper">게임 화면의 문장은 원문 인용이 아니라 DESIGN_LOCK에서 검증한 범위 안의 교육용 요약입니다.</p>`;const dlg=document.getElementById('sourceDialog');if(!dlg.open)dlg.showModal()}
document.getElementById('closeSourceDialog').addEventListener('click',()=>document.getElementById('sourceDialog').close());

function revisionGroup(scene){if(scene===2||scene===3)return'daejeon_gongju';if(scene===4||scene===5)return'iri_naju';if(scene===6)return'mokpo';return''}
function groupSummary(group){const rows=S.revisionHistory.filter(r=>revisionGroup(r.scene)===group);if(!rows.length)return'교정 기록 없음';return rows.map(r=>r.summary).join(' / ')}
function groupTags(group){return [...new Set(S.revisionHistory.filter(r=>revisionGroup(r.scene)===group).map(r=>r.tag))]}
function renderFinal(){
  const groups=[['대전·공주','daejeon_gongju'],['이리·나주','iri_naju'],['목포','mokpo']];
  APP.innerHTML=`<h1 class="scene-title">마감 — 처음 문장 다시 보기</h1><p class="scene-sub">점수 대신 원고가 어떻게 바뀌었는지 확인합니다.</p>
  <div class="result-grid"><article class="result-card"><h3>처음 원고</h3><div class="chapter-badge">조건 ${escapeHtml(S.initialPrediction||'—')}</div><div class="frozen-lead">${escapeHtml(S.initialLead||'—')}</div></article>
  <article class="result-card"><h3>교정 궤적</h3><div class="diff-list">${groups.map(([title,key])=>`<div class="diff-item"><b>${title}</b>${escapeHtml(groupSummary(key))}</div>`).join('')}</div><div class="final-area"><label for="finalModel"><strong>최종 원고 · 1~2문장</strong></label><textarea id="finalModel" maxlength="320" placeholder="세 도시 사례를 대조해, 도시 변화가 왜 하나의 규칙으로 설명되지 않는지 자신의 말로 정리하세요.">${escapeHtml(S.finalModel)}</textarea><div id="finalValidation" class="validation"></div></div></article>
  <article class="result-card"><h3>끝까지 남긴 ?</h3>${S.openQuestions.length?`<ul class="open-list">${S.openQuestions.map(q=>`<li>${escapeHtml(q.text)}</li>`).join('')}</ul>`:`<div class="empty-state">현재 남긴 유보 질문이 없습니다.</div>`}<div id="saveBox" class="save-box ${S.submitError?'error':S.submittedAt?'success':''}">${saveStatusText()}</div>${S.submitError?'<button id="retrySave" class="secondary-btn" type="button">같은 결과로 저장 재시도</button>':''}</article></div>
  <div class="scene-controls">${S.completedAt?'<button id="toPost" class="primary-btn" type="button">후속 질문으로</button>':'<button id="finishCore" class="primary-btn" type="button">최종 원고 제출</button>'}</div>`;
  document.getElementById('finalModel')?.addEventListener('input',e=>{S.finalModel=e.target.value;save()});
  document.getElementById('finishCore')?.addEventListener('click',finishCore);document.getElementById('retrySave')?.addEventListener('click',async()=>{await submitResult(true);render()});document.getElementById('toPost')?.addEventListener('click',()=>setScene(8,'vn',0));
}
function saveStatusText(){if(PREVIEW)return'검수 모드(preview=1): 결과를 production에 저장하지 않습니다.';if(S.submittedAt)return'✓ 결과 기록을 저장했습니다.';if(S.submitError)return'저장에 실패했습니다. 게임 완료에는 영향이 없습니다.';if(S.completedAt)return'결과 저장을 준비합니다.';return'최종 원고를 제출하면 결과 기록을 저장합니다.'}
async function finishCore(){const v=document.getElementById('finalValidation');if((S.finalModel||'').trim().length<30){v.textContent='최종 설명을 30자 이상으로 적어 주세요.';return}v.textContent='';tickGroup(7);S.completedAt=new Date().toISOString();save();render();await submitResult();render()}

function resultPayload(){
  const choices={version:'2.0',record_type:'result',result_id:S.resultId,initial_prediction:S.initialPrediction,initial_lead:S.initialLead,revisions:{daejeon_gongju:{summary:groupSummary('daejeon_gongju'),action_tags:groupTags('daejeon_gongju')},iri_naju:{summary:groupSummary('iri_naju'),action_tags:groupTags('iri_naju')},mokpo:{summary:groupSummary('mokpo'),action_tags:groupTags('mokpo')}},open_questions:S.openQuestions.map(q=>q.text),final_model:S.finalModel,durations_ms:{intro:S.durations.intro||0,daejeon_gongju:S.durations.daejeon_gongju||0,iri_naju:S.durations.iri_naju||0,mokpo:S.durations.mokpo||0},completed_at:S.completedAt};
  return {class:CLASS,game:GAME_ID,choices,comment:S.finalModel||'',timestamp:S.completedAt||new Date().toISOString()}
}
function publicHeaders(extra){const key=SUPABASE.supabasePublishableKey||'';const headers={apikey:key,...(extra||{})};if(key.startsWith('eyJ'))headers.Authorization=`Bearer ${key}`;return headers}
async function submitResult(force=false){
  if(S.submittedAt&&!force)return{ok:true,duplicateGuard:true};const body=resultPayload();if(PREVIEW){console.info('[preview save skipped]',body);return{ok:false,skipped:true}}const{ supabaseUrl:url,supabasePublishableKey:key}=SUPABASE;if(!url||!key||key.startsWith('__')){console.info('[save skipped]',body);return{ok:false,skipped:true}}
  try{const res=await fetch(`${url}/rest/v1/game_results`,{method:'POST',headers:publicHeaders({'Content-Type':'application/json',Prefer:'return=minimal'}),body:JSON.stringify(body),keepalive:true});if(!res.ok)throw new Error(`HTTP ${res.status}`);S.submittedAt=new Date().toISOString();S.submitError='';save();return{ok:true}}catch(err){console.warn('[save failed]',err);S.submitError=String(err?.message||err);save();return{ok:false,error:err}}
}

function renderPost(){
  APP.innerHTML=`<h1 class="scene-title">도시가 성장했다. 그런데 누구의 도시였을까?</h1><p class="scene-sub">Core 결과 저장과는 별도의 후속 발문입니다. 이 입력은 현재 결과 payload에 저장하지 않습니다.</p>
  <section class="post-panel"><h2>다음 수업으로 이어지는 두 흔적</h2><div class="post-docs"><div class="post-doc"><strong>경성의 도시 내부 격차</strong><span>같은 도시 안에서도 거주 공간과 생활 조건은 집단·지역에 따라 달랐습니다.</span></div><div class="post-doc"><strong>영산포의 식민지 경제 지배 흔적</strong><span>동척·식산은행·일본인 지주 가옥 등의 흔적은 도시 성장과 식민지 지배 구조를 함께 보게 합니다.</span></div></div><p><strong>도시의 성장은 그 안에 사는 모든 사람에게 같은 변화를 의미했을까요?</strong><br>다음 수업에서 더 확인하고 싶은 차이를 하나 적어 보세요.</p><textarea id="postInquiry" maxlength="220" placeholder="예: 같은 도시 안에서 조선인과 일본인의 주거·상업 공간은 어떻게 달랐는지 확인하고 싶다.">${escapeHtml(S.postInquiry)}</textarea></section>
  <div class="scene-controls"><button id="reviewResult" class="secondary-btn" type="button">결과 화면 다시 보기</button></div>`;
  document.getElementById('postInquiry').addEventListener('input',e=>{S.postInquiry=e.target.value;save()});document.getElementById('reviewResult').addEventListener('click',()=>{S.scene=7;S.mode='result';save();render()})
}

function bindGlobal(){document.getElementById('restartBtn').onclick=()=>{if(!confirm('첫 문장과 모든 교정 기록을 지우고 처음부터 다시 시작할까요?'))return;sessionStorage.removeItem(STORAGE_KEY);S=blankState();save();render()}}

load();
if(S.completedAt&&S.scene<7){S.scene=7;S.mode='result'}
render();
