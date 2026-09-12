const GAME = {
  order:["intro","s1","s2","s3","s4","s5","s6","result"],
  backgrounds:{
    intro:"assets/backgrounds/B1_S1_room_wide.webp",
    s1:"assets/backgrounds/B1_S1_room_wide.webp",
    s2:"assets/backgrounds/B2_S2_desk_near.webp",
    s3:"assets/backgrounds/B3_S3_board_full.webp",
    s4:"assets/backgrounds/B4_S4_board_gap.webp",
    s5:"assets/backgrounds/B5_S5_return_desk.webp",
    s6:"assets/backgrounds/B6_S6_final_compare.webp",
    result:"assets/backgrounds/B7_RESULT_room_wide.webp"
  },
  characters:{
    document:"assets/characters/P1_DOCUMENT.webp",
    guide:"assets/characters/P2_GUIDE.webp",
    compare:"assets/characters/P3_COMPARE.webp"
  },
  tooltips:{
    "부르주아 민주주의적 성질":"자본가 계급이 주도하는 민주주의 운동의 성격",
    "과정적 동맹자":"목표가 완전히 같지는 않지만 당분간 함께할 상대",
    "우경적 타협 운동":"일제와 타협해 권리를 얻으려는 쪽으로 기운 운동",
    "영도권":"운동을 이끄는 주도권",
    "소부르주아지":"자본가와 노동자 사이에 있는 중간 계층",
    "해당(解黨)":"조직을 스스로 해산하는 일",
    "기회주의":"원칙보다 당장의 유리함에 맞추어 태도를 바꾸는 경향",
    "통의문":"의견이나 결의 내용을 여러 곳에 알리는 문서"
  },
  s1:{
    platform:[
      "우리는 정치적·경제적 각성을 촉진한다.",
      "우리는 단결을 공고히 한다.",
      "우리는 기회주의를 일체 부인한다."
    ],
    cards:{
      A1:{
        meta:"정우회 선언 · 1926.11 · 정우회(사회주의 사상단체)",
        text:"민족주의적 세력에 대해서는 그 부르주아 민주주의적 성질을 명백하게 인식하는 한편, 우리와 과정적 동맹자가 될 수 있음을 충분히 인정하면서",
        expanded:"대중의 개량적인 이익을 위해서도 이전의 소극적인 태도를 버리고 분연히 싸워야 할 것이다."
      },
      A2:{
        meta:"정우회 선언 · 1926.11 · 정우회(사회주의 사상단체)",
        text:"그것이 타락한 형태로 나타나지 않는다면 적극적으로 제휴하여"
      },
      B1:{
        meta:"조선일보 사설 · 1927.2 · 조선일보(신문사) 사설",
        text:"타락을 의미하는 기회주의와 우경적 타협 운동이 대중의 목적의식을 마비시키고 대중의 투쟁력을 소모시켜서"
      },
      B2:{
        meta:"조선일보 사설 · 1927.2 · 조선일보(신문사) 사설",
        text:"공통의 투쟁 목표가 있는 한에는 반드시 연합할 필연성이 있는 것이다."
      }
    }
  },
  s5:{
    center:"신간 운동은 확고한 강령과 기본적인 정신이 엄연히 존재하는 이상 다시 이러한 비판을 용납할 수 없다.",
    gyeongseong:"새 중앙간부를 부인하고, 전국 각 지회에 그간의 사실을 알리기 위한 통의문을 발송하기로 했다."
  },
  s6:{
    A:[
      "신간회는 과거 4개년간 이렇다 할 업적이 없었다.",
      "이상의 이유에 의하여 우리 지회는 영도권이 소부르주아지에게 있는 신간회는 소부르주아지 집단이므로 해소하고자 한다."
    ],
    B:[
      "즉시 해체 혹은 해당(解黨)의 절차를 밟아야 할 것처럼 할 바 아니다.",
      "하물며 소위 소부르주아지·소시민 등 노동자·농민에 속하지 않은 과도적이라고 할 만한 중요 부분에게는 홀연히 어디로 가라고 할 것인가?"
    ],
    Bexpanded:"오히려 그들의 우연적 혹은 필연적 우경화를 객관적으로 조장하는 과오가 아니겠는가?"
  }
};

const VN = {
  intro:{
    type:"vn", pose:"document", side:"left", title:"프롤로그",
    lines:["오늘 읽어 둘 문서가 몇 장 있습니다.","서로 같은 말인지, 부딪히는 말인지 먼저 표시해 둡시다."]
  },
  s1s2:{
    type:"vn", pose:"guide", side:"right", title:"1927 · 지회 설립",
    lines:["읽은 문장은 벽에 그대로 남겨두죠.","이제 우리 지회가 ‘기회주의’를 어떤 경우로 볼지 기준을 한 줄 남깁시다."]
  },
  s2s3:{
    type:"vn", pose:"guide", side:"left", title:"1928~1929 상반기",
    lines:["시간이 지나자 여러 지역의 활동 소식이 들어오기 시작했습니다.","구체적인 지침이 보이지 않는 가운데, 이번 회의에서 무엇을 먼저 다룰지 정해야 합니다."]
  },
  s3s4:{
    type:"fact", title:"1929.11",
    lines:["11월 5일, 광주에서 학생 충돌이 있었다는 기사가 들어왔다.","그 뒤의 상황을 확인할 자료는 좀처럼 들어오지 않는다."]
  },
  s4s5facts:{
    type:"fact", title:"해가 바뀌는 사이 알려진 일들",
    lines:["광주 관련 신문 보도는 12월 하순 다시 풀렸다.","12월에는 신간회 간부들이 대거 검거되었다.","이후 본부 집행부가 새로 꾸려졌다."]
  },
  s4s5:{
    type:"vn", pose:"document", side:"right", title:"S5 진입",
    lines:["책상 위에 서로 다른 문서가 놓였습니다.","1927년에 적어 둔 기준도 함께 펼쳐두겠습니다."]
  },
  s5s6facts:{
    type:"fact", title:"1931.4",
    lines:["지난 12월, 경성지회 상무집행위원회는 해소 반대 성명을 결정했다.","4월 14일, 경성지회 임시대회에서는 회원 다수결로 해소가 가결되었다.","두 결정은 같은 회의체의 결정이 아니다."]
  },
  s5s6:{
    type:"vn", pose:"compare", side:"left", title:"S6 진입",
    lines:["이번에는 신간회를 계속 둘 것인지를 둘러싼 두 논리를 읽게 됩니다.","먼저 두 자료가 무엇을 주장하는지 확인합시다."]
  },
  s6result:{
    type:"vn", pose:"document", side:"right", title:"결과",
    lines:["우리 지회의 결의는 기록했습니다.","이제 실제 전체대회의 결과와 지금까지의 기록을 나란히 봅니다."]
  }
};
