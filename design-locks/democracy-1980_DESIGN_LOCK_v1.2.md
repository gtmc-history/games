### DESIGN\_LOCK v1.2 — 「1980: 광주의 기록을 복원하라」 최종 잠금용 통합안 (GPT, 2026.11.16.)

<callout icon="🔒" color="blue_bg">
<b>상태: 교사 최종 잠금 승인(O, 2026.11.16.) 완료 · BUILD 인계서 작성 완료.</b> 이 문서는 노션 내 <b>DESIGN\_LOCK v1.2 정본 후보</b>이며, 기존 v1.1을 대체하는 최신 설계 참조본이다. <b>코드 작성, GitHub 설계 파일/manifest 생성·수정, DB 쓰기, 대시보드 변경, 배포는 하지 않았다.</b> BUILD 단계는 교사 최종 잠금 승인 이후 별도 지시로만 시작한다.
</callout>

#### §0 기본 메타

| 항목 | v1.2 확정 설계 |
| --- | --- |
| 시리즈 / 편명 | 민주주의 기록실 1972\~1987 / EP.02 「1980: 광주의 기록을 복원하라」 |
| 단원 / 대상 | 고1 한국사2 · 5·18 민주화운동 · 개인용 Chromebook/태블릿 · 로그인 없음 |
| 학습 목표 | 생산자가 다른 기록을 대조해 국가폭력의 행위 주체·시간 순서·시민 자치와 봉쇄의 맥락을 근거와 함께 복원 |
| canonical slug | <code>democracy-1980</code> (현재 manifest 미등록; 나중에 폴더·URL·저장 game 값과 동일하게 함) |
| 작업 상태 / 라이프사이클 | <b>DESIGN, 최종 잠금 검토 대기</b>. 실제 manifest에 <code>draft</code> 등록조차 아직 하지 않음. <code>design-locked</code> 전환 및 BUILD 별도 지시 필요 |
| 목표 플레이 시간 | <b>15\~18분 목표, 실측 전</b>: S1 1.5분 / A 3.5분 / B 4분 / C 5분(2단계 포함) / S5·저장 1.5분 |
| 필수 입력 | ORDER-01 전·후 동일 문항 각 1회, A·B·C 근거 연결, 미션 C의 최종 한 문장 1회(권장 20\~45자, 공백만 금지) |
| SAVE | <b>required</b> — 전후 판단, 근거 선택, 최종 복원 문장이 후속 한국사 수업과 분석에 필요 |
| DASH | <b>A</b> — 초기 오개념, 동일 문항의 즉시 재판단, 근거 연결·수정 경로, 반별 수업 피드백을 확인해야 함 |
| renderer | <b><code>democracy-1980</code></b><b> 전용 renderer 채택(설계 판정)</b>. 현재 sibling 허브 <code>dashboard/index.html</code>의 generic 차트는 <code>meta.axes/scenes/final_key</code> 중심이며 <code>choices.pre_post</code>와 <code>missions[].mechanic_output</code>의 중첩 지표를 직접 요약하지 못함. DASH-A 목적상 전용 분석 카드가 필요. <code>democracy-1979</code> renderer 재사용은 데이터 구조가 달라 불가. 실제 renderer 개발·mapping 등록은 BUILD 승인 후 별도 범위 |
| 결과 저장 | 공통 <code>game_results</code> 최상위 5키(<code>class, game, choices, comment, timestamp</code>) 유지, 완주 후 단일 자동 POST · 실패 시 같은 <code>result_id</code> 재시도/TXT |
| 기준 | [PROJECT\_INSTRUCTIONS](https://github.com/gtmc-history/games/blob/main/PROJECT_INSTRUCTIONS.md) · [DESIGN\_WORKFLOW](https://github.com/gtmc-history/games/blob/main/docs/DESIGN_WORKFLOW.md) · [DESIGN\_LOCK\_TEMPLATE](https://github.com/gtmc-history/games/blob/main/templates/DESIGN_LOCK_TEMPLATE.md) · [GAME\_CONTRACT](https://github.com/gtmc-history/games/blob/main/docs/GAME_CONTRACT.md) · [DATA\_CONTRACT](https://github.com/gtmc-history/games/blob/main/docs/DATA_CONTRACT.md) · [SENSITIVE\_HISTORY\_RULES](https://github.com/gtmc-history/games/blob/main/docs/SENSITIVE_HISTORY_RULES.md) |

#### §1 GAME DESIGN LOCK

<b>Historical Discovery</b> — 「자료를 생산한 주체가 다르면 기록된 내용과 빠진 내용이 달라진다. 서로 다른 기록을 연결하면 국가폭력의 행위 주체·발포와 본격 무장의 순서·시민 생활의 맥락을 복원할 수 있다.」

<b>3행 설계 게이트</b>

1. 발견 한 문장: 같은 1980년 5월이라도 당시 발표·시민 기록·후대 조사에는 서로 다른 생산 목적과 검증 가능성이 있다.
2. 플레이 동사: <b>대조한다 → 연결한다 → 복원한다</b>. ‘카드 클릭’은 수단이지 목적이 아님.
3. 행동의 이유: 원인·주체·시민 생활이 지워진 기록철의 빈칸을 한 자료만으로는 복구할 수 없기 때문.

<b>Game Fit</b>

- 이 주제를 게임으로 만드는 이유: 훼손된 기록을 직접 고치면서 출처 선택·연결·수정의 결과가 눈에 보이는 <b>조사자 행동</b>을 경험하게 할 수 있다.
- 토론·활동지보다 적합한 이유: 서로 다른 생산자의 근거를 누적 연결하고 오연결을 바로 수정하며, 처음·복원 기록을 즉시 비교하는 <b>상태 변화를 학생 각자가 조작</b>할 수 있다. 토론은 게임 후 해석 확장으로 유지한다.

<b>Core Sequence</b> — 손상 기록철 → A 배경·시간 복원 → B 발포·본격 무장·검열 주체 복원 → C-1 동시대 기록 생산자 대조 → C-2 후대 검증으로 3축 복원·최종 한 문장 작성 → S5 첫 기록과 복원 기록철 나란히 확인. 별도 반복 객관식과 불필요한 대사 넘김 금지.

<b>Mechanic 후보 비교 및 선택</b>

| 후보 | 학생 행동·역사 구조 | 강점/위험 | 결론 |
| --- | --- | --- | --- |
| 문서·증거 기반 조사 복원 | 사료의 시점·생산자·누락된 주어와 사실을 연결 | 기록의 차이를 직접 다룸; 사료 길이를 관리해야 함 | <b>주 메커닉 채택</b> |
| 단순 팩트체크 3지선다 | 설명을 읽고 정답 선택 | 쉽게 채점 가능하지만 사료 연결 없이 통과할 위험, EP.01과 중복 | 기각 |
| 역사적 진압·생존 역할 시뮬레이션 | 실제 피해·진압의 대체 선택을 학생에게 맡김 | 국가폭력·피해의 오락화 및 인과 왜곡 | 기각 |

- Secondary: A 사건 배열·교란 제거, B 블라인드 해제+근거 연결, C 생산자별 역할 분류와 3축 근거 보드. Presentation: 짧은 비주얼 노벨풍 기록실(시각 25% 이내, 조작 75% 중심).
- Engagement Hook: 근거를 바로잡을 때 훼손 기록철이 누적 복구되고 마지막에 최초 3문장과 최종 3문장을 비교함.
- State: <code>scene</code>, <code>mission_stage</code>(C 1·2단계), <code>pre_post</code>, <code>archive.background</code>, <code>archive.actor_sequence</code>, <code>archive.citizen_context</code>, <code>evidence_links</code>, <code>mislink_revisions</code>, <code>final_reconstruction_text</code>, <code>submissionStatus</code>.
- Meaningful Choice: A·B는 근거를 연결하는 객관적 복원, C는 출처의 주장을 실제 사실로 오인하지 않고 어떤 축을 최종 한 문장에서 앞세울지 선택. 후자가 주관적이라는 이유로 사실 정오 판정을 임의 변경하지 않는다.
- Consequence: 잘못 연결하면 1줄 힌트로 근거 수정; 올바르게 연결하면 해당 문장을 아카이브에 누적; S5에 처음 기록과 복원 기록을 비교. 실제 1980년 사건은 학생 선택으로 변하지 않음.
- Replayability: 필수 아님. 사실층 결론은 유지하면서 증거 우선순위·최종 문장은 달라질 수 있음.
- 기존 게임 차이: 「1979」의 기사별 판정 → <b>1980은 사료 생산자·본문 누락·증거 보드가 이어지는 문서 복원</b>. 「어느 기관의 일입니까?」의 단순 분류, 「대한신문 1907」의 기사 편집과도 과제의 핵심이 다름.

#### §2 역사적 불변 원칙

1. 교육용 기준 순서: <b>5·19 광주고등학교 앞 계엄군 발포 → 5·20 밤 광주역 발포 → 5·21 도청·전남대 일대 집단 발포 → 이후 시민군의 본격적 조직적 자위 무장</b>. 5·19\~20 산발적 무기 탈취 사례를 “무장이 전혀 없었다”로 지워서는 안 됨.
2. 계엄사 발표는 <b>당시 권력의 주장</b>을 입증하는 자료이지, 발표의 약탈 주장 자체가 검증된 역사적 사실이라는 증거가 아님.
3. 5·22 선언문은 당시 시민 측의 <b>진상보도·왜곡보도 중단 요구</b>를 보여줄 뿐, 시민 자치 운영을 단독 증명하지 않음.
4. 5·25 계엄사 발표·시민군 궐기문의 생산자에게 5·27 결과를 미리 알게 하지 않는다. 5·27은 후대 해설 <code>C-G1c</code>에만 표시.
5. 폭력의 피해·희생·사망을 게임 승패, 점수, 콤보, 자극적 이미지로 소비하지 않는다. 학생은 <b>2026년의 기록 조사자</b>이며 실존 피해자·가해자의 역할을 연기하지 않음.
6. 학생 행동으로 변화하는 것은 자기 근거 연결과 완성 기록철뿐; 원사료·확립된 역사와 사건 인과는 고정.

#### §3 사실 / 해석 / 평가

| 장면·행동 | 층위 | 허용 피드백·한계 |
| --- | --- | --- |
| A 신군부 권력 장악·서울의 봄·5·17·5·18 기본 선후 | 사실·설명 | 배열·실제 근거에 한정하여 정오 판별 |
| B 발포 순서·본격적 시민군 무장·보도통제지침 | 사실 | 산발적 초기 사례와 본격 무장을 구별하여 정오 판별 |
| C-1 계엄사 발표·시민군 궐기문·5·22 선언문의 생산자와 의도 | 당시 주장·요구 | 출처 역할 분류에만 정오, 주장 내용의 사실성은 자동 승인하지 않음 |
| C-2 시민 자치·외곽 봉쇄·협상/항전·5·27 진압 | 후대 검증 사실 | 공식 해설 카드와 보드 축의 근거 연결 여부 판별 |
| C-2 최종 한 문장·강조 순서 | 학생 해석·서술 | 근거·시대 구분 도움말만 제공, AI 의미 점수 부여 금지 |
| S1/S5 ORDER-01 | 사전 인식·즉각 재판단 | 같은 문항의 응답 차이만 제시. 독립적 학습 효과 입증 표현 금지 |

#### §4 사료·근거 LOCK

<b>등급 규칙:</b> A=동시대 문서의 확인된 짧은 원문 발췌(<b>그 내용 전체가 사실임을 뜻하지 않음</b>), B=후대 공식 조사·공신력 있는 해설 또는 이를 명시적으로 인용한 보도, C=학습용 재구성·당시 취합 증언(검증 한계 별도 표시). 등급은 진실성 점수가 아니다.

| ID | 게임 역할·도장 | 검증용 출처 / 등급 | 과잉해석 금지·안전 |
| --- | --- | --- | --- |
| A-S1 | 12·12 이후 권력 장악과 서울의 봄 \[후대 해설\] | [우리역사넷](https://contents.history.go.kr/mobile/kc/view.do?levelId=kc_i501000) / B | 특정 개인의 내면·의도 창작 금지 |
| A-S2 | 5·17 계엄 전국 확대 \[후대 해설\] | 우리역사넷 위 링크 / B | 후대 설명을 1980년 당대 일지 원문처럼 표시 금지 |
| A-S3 | 5·18 전남대 앞 시위·계엄군 강경 진압 \[후대 해설\] | 우리역사넷 위 링크 / B | 시민 시위를 폭력 진압의 정당화 근거로 서술 금지 |
| B-S1 | 5·17 보도검열 방침·계엄 확대 비판 제한 \[당시 문건 발췌\] | [오픈아카이브 00859054](https://archives.kdemo.or.kr/isad/view/00859054) / A | 「삭제된 부분의 공백」 조항만 단독으로 제시하지 않고 상위 방침과 문맥 포함 |
| B-S2 | 5·19 광주고 앞 첫 발포·5·20\~21 계엄군 발포 \[후대 조사 요약\] | 조사위 발표 보도: [연합뉴스 2023.5.17.](https://www.yna.co.kr/view/MYH20230517000700641), [연합뉴스 2024.6.24.](https://www.yna.co.kr/view/AKR20240624121151004) / B | 두 보도는 <b>조사위 결과를 전한 기사</b>이지 조사위 종합보고서 원문이 아님. 발포 위치·시점과 확인 범위 구별 |
| B-S3 | 월요모임 Fact Sheet #59, 발포 후 본격 무장 서술 \[당시 취합기록·요약\] | [오픈아카이브 #59](https://archives.kdemo.or.kr/contents/view/422) / A(존재)·C(내용 검증 한계) | “only then”은 당시 보고의 표현; 모든 초기 산발적 무장 사례가 없었다는 증명으로 쓰지 않음 |
| C-S1 | 5·25 계엄사 발표 약탈 주장 \[당시 권력 주장\] | <b>주 출처</b> [오픈아카이브 전시](https://archives.kdemo.or.kr/display2/sub07/sub07_04.html) / [대체 경로](https://contents.kdemo.or.kr/sub07/sub07_04.html) / A(발표 존재) | 주장 존재 증명만 가능, 실제 시민 상황에 대한 검증 결과로 쓰지 않음; 외부 사이트 간헐 404·504 주의 |
| C-S2 | 5·25 광주시민군 궐기문 안전·시민 보호 호소 \[당시 시민군 입장\] | <b>교사용 원문 검증 링크</b> [국사편찬위원회](https://contents.history.go.kr/front/hm/view.do?levelId=hm_151_0010) / A(문서 존재) | <b>안전 발췌문만 노출, 원문 전문 학생 미제시.</b> 원문 전체에는 잔혹한 신체 훼손 묘사와 당시 미확인 소문(제7공수 관련)이 포함. 이를 수업용으로 재인용·사실화 금지 |
| C-S3 | <b>5·22</b> 시민 측의 진상 보도·왜곡보도 중단 요구 \[당시 시민 선언문\] | <b>주 출처</b> [오픈아카이브 전시](https://archives.kdemo.or.kr/display2/sub07/sub07_04.html) / [대체 경로](https://contents.kdemo.or.kr/sub07/sub07_04.html) / A | 5·26 결의문의 검증되지 않은 소문을 혼합하지 않음. 사료의 생산일 5·22 명기 |
| C-G1a | 5·22\~26 시민 자치·생필품 나눔 \[후대 공식 해설\] | [국가기록원](https://theme.archives.go.kr/next/518/sub3.do) / B | 당시 궐기문이나 5·22 요구문 하나로 생활상의 실재를 입증하지 않음 |
| C-G1b | 광주 외곽 봉쇄·민간인 피해 \[후대 공식 해설\] | [우리역사넷](https://contents.history.go.kr/mobile/kc/view.do?levelId=kc_i501000) / B | 봉쇄·피해의 책임 주체를 모호하게 하지 않음 |
| C-G1c | 무기 반납·협상과 항전의 차이·5·27 진압 \[후대 공식 해설\] | [국가기록원](https://theme.archives.go.kr/next/518/sub3.do) / B | 5·25 기록이 5·27 결과를 안 것처럼 표현하지 않음 |

<b>학생 화면 발췌와 접근 경계</b>

- B-S1은 검열 실시 방침+비판 제한 조항을 묶어 짧게 제시, B-S2는 원문이 아닌 조사 결과의 후대 요약, B-S3은 취합 사료의 한계까지 짧게 설명.
- C-S1은 ‘계엄사가 약탈을 주장했다’는 사실만, C-S2는 시민 안전을 지키겠다는 <b>안전한 짧은 호소</b>만, C-S3은 언론의 진상 보도와 왜곡 중단을 요구한 대목만 학생에게 제공.
- <b>특히 C-S2: 안전 발췌문만 노출, 원문 전문 학생 미제시.</b> 전문 URL은 <b>교사 검증 문서에서만 유지</b>하고 게임의 학생 화면에는 전문으로 바로 이동하는 버튼·미리보기·전체 인용을 제공하지 않는다.
- <b>외부 링크 신뢰성 경고:</b> 오픈아카이브 전시의 <code>archives.kdemo.or.kr/display2</code>가 접근 가능하다는 피클 실측이 있었으나 웹 재조회에서는 404가 나타났고 <code>contents.kdemo.or.kr</code>도 504 이력이 있다. 두 주소는 주·대체 출처 <b>서지 URL</b>로 유지하되 실시간 연결 성공을 보장하지 않음. 학생에게 필요한 자료 요약과 출처 정보는 정적 게임에 안전하게 포함하여 링크 오류가 플레이를 막지 않도록 한다.
- 원문·그림·지면 스캔을 재배포할 수 있는지는 출처 확인과 별개의 저작물 이용 문제이며, 안전 발췌와 자체 제작 SVG 프레임을 우선 사용.

<b>기각/유보 자료</b>

| 자료 | 이유 |
| --- | --- |
| 5·26 「80만 민주시민의 결의」 전체 | 당시 미확인 소문을 포함. 교사 승인에 따라 5·22 선언문 선택 |
| C-S2 5·25 시민군 궐기문 전체 | 잔혹한 신체 훼손 서술·당시 미확인 소문 포함. <b>안전 발췌만</b> 사용 |
| 1980.6.4 신문 제작 대장 | 사건 이후 자료로서 B의 정답·동시대 핵심 증거로 사용 불가(교란 선택지의 시기 대비에만 사용) |
| 개인 일기·취재수첩의 미확보 인용문 | 직접 인용 가능한 문장 미검증 |
| 피해 사진·신문 스캔·가상 원문 기사 | 정서 안전·권리 미확인 / 실제 원문으로 오인 위험 |

#### §5 민감 주제 체크

- 대상: <b>국가폭력·실존 피해를 다루는 민감 역사</b>. 학생의 Agency는 조사·해석·편집의 선택권으로만 확보하며, 당대 피해자·계엄군을 역할극으로 재현하지 않는다.
- 도입부 주제 고지: 「이 게임에는 국가폭력과 기록 통제에 관한 역사 자료가 포함됩니다. 개인이나 가족의 경험을 이야기할 필요는 없습니다.」
- <b>C-S2 안전 규칙: 안전 발췌문만 노출, 원문 전문 학생 미제시.</b> 국사편찬위 전문에 포함된 잔혹한 신체 훼손 묘사·제7공수 관련 당시 미확인 소문은 화면·힌트·TXT·대시보드 미리보기에서도 노출하지 않는다. 전문 URL은 교사 검증용으로만 보관.
- 유혈·희생자 시신·피해 경험의 시각 재현, 충격음, 피해 규모의 게임 점수화, 실존 인물의 생성형 자유대화, 가공된 희생자 내면 대사 금지.
- '폭도' 등 역사적 멸칭은 당시 계엄사 원문 표지 안에만 제한적으로 노출하고 <b>\[당시 권력의 주장 / 사실 확정 아님\]</b> 경고 부착.
- 5·25 시민군 기록의 주장·호소와 5·22 시민 선언문의 요구, 후대 검증 기록의 사실성은 서로 다른 층위로 표시. 반별 소표본 공개에 따른 학생 역추적 주의.
- 가공 요소의 범위: 훼손 원고, 빈칸, 보드, 서고 내레이션은 <b>\[학습용 재구성, 1980년 실제 원문 아님\]</b>을 상시 표시. 실존 인물 심리·발언을 창작하지 않는다.

#### §6 5컷 씬 구조 / 화면 문구·조작 규칙

| 씬 | 수행 목표 | 화면/상태 변화 | 시간 |
| --- | --- | --- | --- |
| S1 프롤로그 | 동일 ORDER-01 사전 판단 | 주제 고지·반 배지 / <code>pre_post.before</code> | 1.5분 |
| S2 A 찢어진 일지 | 3사건 배열·2교란 제외·근거 연결 | <code>archive.background</code> 누적 | 3.5분 |
| S3 B 검열된 원고 | 3빈칸 답+근거 1:1 연결 | <code>archive.actor_sequence</code> 누적 | 4분 |
| S4 C 증거 보드 | <b>1단계 당시 출처 역할 → 2단계 3축 보드+한 문장</b> | <code>archive.citizen_context</code>, <code>final_reconstruction_text</code> | <b>합계 5분</b> |
| S5 에필로그 | 최초·복원 기록 대조+동일 사후 판단·자동 저장 | <code>pre_post.after</code> / 서버 저장 상태 | 1.5분 |

<b>S1 프롤로그</b>

- 제목 「1980: 광주의 기록을 복원하라」. 2줄 브리핑 「1980년 5월의 기록에는 서로 다른 설명이 남았습니다. 누가 무엇을 기록하고 빠뜨렸는지 자료를 대조해 복원하세요.」
- 주제 고지(§5), 배지 <code>수업 반: 1-3</code> 또는 <code>수업 반: 미입력 ⚠️ — 선생님께 링크 확인</code>.
- 동일 문항 <code>ORDER-01</code>: 「계엄군의 발포와 시민군의 <b>조직적인 무장</b> 가운데, 어느 일이 먼저였을까요?」 보기는 동일 순서 <code>fire_first</code>=「계엄군의 발포가 먼저」 / <code>armed_first</code>=「시민군의 조직적인 무장이 먼저」 / <code>unsure</code>=「아직 모르겠다」. 사전 정답 공개 금지. CTA 「기록 복원 시작」.

<b>S2 미션 A — 「광주의 5월은 어디서 시작됐나」</b>

- 브리핑 「5월 이전의 맥락이 지워진 일지를 복원해 보세요. 세 사건을 잇고 두 왜곡 설명을 제외한 뒤, 근거를 연결하세요.」
- 사료 칩 \[후대 해설\] A-S1「신군부가 군 지휘권을 장악하고 민주화 요구가 커졌다」, A-S2「비상계엄을 전국으로 확대했다」, A-S3「전남대 앞 시위에 계엄군이 강경 진압으로 대응했다」. 날짜는 출처 설명에서 확인 가능하나 <b>문제 조각 표면에는 쓰지 않는다</b>.
- 사건 조각 정답 ID(정답 구조이며 화면 순서를 뜻하지 않음): <code>A-E1</code>「신군부 권력 장악과 민주화 요구 확산」 → <code>A-E2</code>「비상계엄 전국 확대」 → <code>A-E3</code>「전남대 앞 시위와 강경 진압」.
- 교란 ID: <code>A-D1</code>「시민군의 조직적 무장이 먼저이므로 초기 진압이 시작됐다」 / <code>A-D2</code>「서울의 민주화 요구와 무관한 광주만의 지역 소요였다」. 두 교란은 <b>\[실제 사료가 아닌 학습용 왜곡 재구성\]</b> 표시.
- <b>v1.2 초기 셔플 규칙:</b> 총 5조각(A-E1/E2/E3, A-D1/D2)을 최초 입장 시 섞어 보여 준다. 설계 문서의 E1→E2→E3 표기는 내부 정답 순서일 뿐 최초 화면 순서가 아님. 우연히 정답 3장이 1→2→3으로 정돈되어 제시되면 다시 섞음. 재시작·이어하기 때 같은 시도의 배열 순서는 <code>localStorage</code>에 보존해 갑자기 재배열하지 않는다. 시각적 순서와 카드 ID·정답 판정을 분리.
- 완료 조건: 정답 3개 배열 + 교란 2개 제외 + 적어도 두 사건에 근거 칩 연결. 정답 선택만으로 통과 금지, 오답 후 한 줄 근거 힌트. 아카이브 배경 한 문장 적층.

<b>S3 미션 B — 「'충돌'이라는 말에 가려진 순서」</b>

- 브리핑 「‘충돌’이라는 말만 남은 원고에서 누가 발포했는지, 시민군의 본격적 무장은 언제 이어졌는지, 검열이 어떻게 기록을 가렸는지 확인하세요.」
- 프레임 도장: <b>\[학습용 재구성·실제 당시 기사 원본 아님\]</b>.
- 원고: 「시민군의 본격적 무장보다 먼저 확인되는 것은 \[①\]이다. 이후 시민들은 \[②\]에 나섰다. 당시 보도 통제를 보여 주는 문서는 \[③\]이다.」
- B-S1 \[5·17 보도통제지침 당시 원문·보도검열 방침+비판 제한\], B-S2 \[5·18진상규명조사위 발표를 전한 후대 보도·발포 선후\], B-S3 \[Fact Sheet #59 당시 목격 취합 보고·무장 순서\]를 확인하고 답+근거를 각각 연결.

| 빈칸 | 정답 ID / 화면 문구 | 교란 2개 ID / 화면 문구 | 필수 근거 |
| --- | --- | --- | --- |
| ① | <code>military_fired</code> / 계엄군의 발포 | <code>militia_first_shots</code> / 시민군의 선제 사격 · <code>accidental_discharge</code> / 우발적 총기 오발 | <code>B-S2</code> |
| ② | <code>citizen_self_defense_armed</code> / 자위적 무장 | <code>premeditated_uprising</code> / 사전 계획된 무장 봉기 · <code>complete_disbandment</code> / 전원 자진 해산 | <code>B-S3</code> |
| ③ | <code>censorship_0517</code> / 5·17 보도통제지침 | <code>media_merger_late1980</code> / 하반기 언론 통폐합 · <code>press_ledger_0604</code> / 6·4 신문 제작 대장 | <code>B-S1</code> |

- <b>v1.2 보기 배치 분산:</b> ①②③ 각각 보기 위치를 바꿔 보여주며, <b>한 시도에서 세 정답이 1·2·3번 위치에 각 한 번씩 등장하도록</b> 정답 위치 순열을 섞는다. 나머지 교란도 섞는다. 선택지 ID와 근거 정답은 표시 위치와 무관하게 불변. 완료·오답 후 재시도·이어하기 동안 현재 시도의 배열은 바뀌지 않고 새 시도에서만 다시 섞는다.
- 검은 띠는 <b>보기 정답+올바른 사료 칩 연결</b>을 함께 충족해야 해제. 근거를 잘못 연결하면 「그 내용을 확인할 수 있는 자료를 다시 연결하세요」만 제시. 완료 후 공통 시간축(5·19 광주고 → 5·20 광주역 → 5·21 도청·전남대 → 이후 본격 무장) 확인. B-S3의 “only then”은 당시 기록 표현의 한계를 해설로 별도 표시.
- 문항별 교란은 <b>역사적 왜곡 학습용 보기</b>로만 노출. 출처 인용문으로 오인하지 않도록 디자인 구분.

<b>S4 미션 C — 「기록에서 사라진 광주의 일상」 (v1.2 크롬북 2단계 구성)</b>

- 전체 S4는 <b>하나의 씬</b>이며 내부에 2단계 탭/패널 전환만 존재한다. 세로 긴 페이지로 6사료·3축 보드·글쓰기를 동시에 쌓지 않는다. 총 5분 예산은 <b>1단계 약 2분 + 2단계 약 3분</b>; 실측에 따라 조절.
- 공통 브리핑 「같은 1980년 5월에도 계엄사와 시민 측이 남긴 기록은 달랐습니다. 기록이 말한 것과 말하지 않은 것을 구별해 광주의 모습을 복원하세요.」

<b>C-1단계 — 동시대 출처 역할 대조 (약 2분)</b>

- 화면에는 <b>당시 기록 3장만</b> 노출: C-S1 \[5·25 계엄사 발표·권력 주장\], C-S2 \[5·25 시민군 궐기문·안전 호소\], C-S3 \[5·22 선언문·진상보도 요구\]. 제목, 작성일, 생산자, 출처 도장을 짧게 제시하고 문장 자세히 보기는 자율.
- 학생은 기록 각각의 기능을 <code>claim_origin</code>(C-S1: 당시 계엄사 주장의 존재), <code>citizen_stance</code>(C-S2: 당시 시민군 입장), <code>reporting_demand</code>(C-S3: 보도 요구)에 연결한다. 당시 주장과 사실 검증을 뒤섞으면 한 줄 피드백, 분류 완료 시 「다음: 다른 자료로 실제 모습을 검증하기」 버튼 활성화.
- <b>C-S2는 안전 발췌만 보여주고 원문 전문·전문 링크는 학생에게 제공하지 않음.</b> C-S1 주장은 계엄군 주장 내용이 역사적으로 맞다는 뜻이 아님.
- C-1의 답과 선택 이력은 C-2로 이어지고 다음 단계에서 작은 <b>‘확인한 당시 기록’ 접이식 요약</b>으로 남는다. 긴 원문 카드·3축 보드 동시 표시 금지.

<b>C-2단계 — 3축 보드와 한 문장 복원 (약 3분)</b>

- 화면을 <b>후대 검증용 카드 3장(C-G1a/b/c) + 3축 보드 + 최종 1문장 입력</b>으로 전환. C-1 원문 카드 3장은 기본 숨김, 소형 출처 요약만 필요 시 펼침. 크롬북 한 화면에서 주 작업이 보이도록 보드+하단 입력을 간결하게 배치.
- C-G1a \[후대 해설\] 시민의 나눔·질서 유지 → 축 <code>citizen_self_government</code> 「시민 자치」. C-G1b \[후대 해설\] 계엄군의 외곽 봉쇄와 시민 피해 → 축 <code>military_blockade</code> 「봉쇄·피해」. C-G1c \[후대 해설\] 협상/항전 논의와 5·27 진압 → 축 <code>negotiation_resistance_suppression</code> 「협상·항전·진압」.
- C-S2는 당시 시민군의 호소라는 관점 태그에만 병기할 수 있으며 시민 자치 사실을 단독 입증하지 않는다. C-S3은 왜곡 보도 중단을 요구했다는 사실에 한정. 3축 사실 판단에는 후대 검증 카드 필수.
- 학생은 세 축 중 <b>최종 기록의 첫머리에 둘 축</b>을 보드 배치로 표시(<code>lead_axis</code>; 도덕적 정오 판정 아님)하고, 마지막 필수 입력을 정확히 한 번 작성한다. 제목: 「기록에서 누락된 5월의 모습을 한 문장으로 복원하세요.」 도움말: 「시민의 행동과 군의 행동 또는 이후 변화 하나를 함께 적어 보세요.」 권장 20\~45자, trim 후 공백만 금지, 자동 의미 채점 없음.
- 단계 이동은 진행률 <code>1/2 → 2/2</code>로 표현, 화면 전환 시 1단계 판정·열람 기록 보존, 2단계에서 이전 단계 다시 열어 확인할 수 있으나 같은 사실을 반복 입력하지 않음. <code>wrong_attempts</code>는 S4 두 단계를 합산.

<b>S5 에필로그 — 「처음 기록과 내가 복원한 기록을 비교하세요」</b>

- 초기 훼손 문장(모두 <b>\[학습용 재구성·당시 실제 기사 원본 아님\]</b>): ①「광주에서 갑자기 시위가 시작됐다」 ②「광주에서는 충돌이 벌어졌다」 ③「광주는 무질서했다」.
- 복원 기록철 자동 3줄: ① 신군부 권력 장악·5·17 계엄 확대·5·18 시위 맥락(A) ② 계엄군 발포 → 시민군 본격적 자위적 무장 및 검열(B) ③ 자치·봉쇄·협상과 항전·5·27 진압, 학생 한 문장(C). 학생이 실제 연결한 출처, 수정 흔적, 강조한 축 표시.
- S1과 <b>완전히 동일한 ORDER-01</b> 질문·보기 순서 1회 응답 후, 완주 조건을 확인해 <b>서버에 자동 1회 POST</b>. 사전·사후 변화는 즉각 재응답이지 독립 효과성 검증 결과라고 하지 않음.
- 상태 문구: 「서버 저장 중…」 / 실제 2xx 확인 후 「서버 저장 완료 ✓」 / 실패·응답 유실 시 「저장 여부를 확인하지 못했습니다 ⚠️ 재시도하거나 TXT 백업을 저장하세요」. 실패해도 게임 종료와 기록철 열람은 가능.

#### §7 UI / Presentation

- 5컷 상단 160\~190px 배너 + 1\~2줄 안내 + 주 조작판(시각 25%/조작 75% 중심). 모바일/크롬북 대응 세로 흐름형, 고정 16:9 무대 위 텍스트 겹침 금지.
- Chromebook 터치/키보드 양쪽 지원. 드래그 앤 드롭만 강제하지 않고 <b>카드 선택 → 위치/근거칩 선택</b> 버튼 대체. 색 외에 텍스트·아이콘으로 정오 전달. 보통 터치 타깃 약 48px 이상, 본문 최소 16px.
- 출처 칩은 기본 제목·작성 주체·120자 이내 안전 요약, ‘더 보기’ 비강제, 별도 학생용 원문 전문 링크 금지(C-S2). C-S1/C-S3 출처 링크 오류 시 화면 본문은 계속 사용 가능.
- S4-1은 동시대 칩 3개와 생산자 역할 판, S4-2는 후대 근거 3개와 3축 보드·한 문장. 두 단계를 동시에 펼친 긴 스크롤 금지.
- Visual Novel 연출은 장면 분위기 전달만, 실존 가상 대사 클릭 연속 반복 금지. 자료가 완성되는 시각 변화는 플레이의 근거 연결 상태에서 발생.

#### §8 학습지 / API 의존성

- Worksheet: <b>기본 플레이 불필요</b>. 게임 후 발문은 교사가 별도로 수업에 활용.
- External API: <b>결과 전송 보조</b>. 정적 게임은 오프라인·서버 장애 상황에서도 로컬 진행 가능; 게임 본체는 외부 AI 호출·유료 분석 서비스에 의존하지 않음.
- 외부 사이트의 원문 전문 열람을 진행 필수 요건으로 삼지 않고, 안전한 원문 발췌와 후대 요약만 게임 정적 콘텐츠로 제공. C-S2 전문 URL은 학생 화면 노출 금지.
- 네트워크 오류: 게임 결과는 로컬에 보존, TXT/복사 백업 지원. DB에 기록되지 않았는데 저장 성공으로 안내하는 행위 금지.

#### §9 결과 화면

- 처음 훼손된 기록 3문장 ↔ 근거와 함께 복원된 기록 3문장을 나란히, 미션 A/B/C 실제 근거 연결·수정 이력·C의 강조축·한 문장 표기.
- ORDER-01 동일 질문 전후 응답 변화는 학생 본인의 바로 전후 판단 변화일 뿐 <b>교육 효과의 인과적 증거가 아니다</b>. DASH-A는 반별 사전 오개념 분포·근거 연결 이력·수정 횟수·완주 시간 및 데이터 결측을 우선 제시.
- 점수는 기계적 사실·연결 검증에만 제한적으로 사용. 사망·피해의 규모나 도덕성, 개인 감정을 점수화하지 않음.
- 결과 완료 여부와 서버 저장 완료 여부를 독립적으로 표시. TXT 백업은 언제든 가능.

#### §10 게임 후 발문 (게임 필수 입력 아님)

1. 「5월 25일 계엄사 발표와 시민군 궐기문은 같은 날 작성됐는데 무엇을 다르게 강조했을까?」
2. 「‘충돌’이라는 말에서 행위 주체가 빠지면 사건 순서를 어떻게 잘못 이해할 수 있을까?」
3. 「5월 22일 시민 측의 요구와 후대 조사 결과를 구분해 볼 때, 한 사실을 확인하려면 어떤 다른 근거가 필요할까?」

#### §11 데이터 수집 및 저장 계약 — choices v1.2

<b>공통 저장 계약</b>

| 항목 | 의미·분석·금지선 |
| --- | --- |
| 최상위 5키 | <code>class</code>, <code>game</code>, <code>choices</code>, <code>comment</code>, <code>timestamp</code> 유지. 기존 <code>democracy-1979</code> 저장 계약 수정 금지 |
| <code>game</code> | <b>democracy-1980</b> 고정; folder·manifest slug·저장 game 동일, 새 게임은 나중에 manifest <code>draft</code>부터 시작 |
| <code>choices.version</code> | <code>1.2.0</code>: 본 결과 페이로드의 구조 버전 |
| <code>choices.evidence_version</code> | <b><code>1980-evidence-v1.2</code></b>: 이번 게임의 <b>사료 카드·안전 발췌문 판본</b>. 저장소 파일 <code>games.manifest.json</code>의 schemaVersion/registry 판본과 <b>무관</b>. 구 필드 <code>source_manifest_version</code> 사용하지 않음 |
| <code>choices.result_id</code> | 완주 시도별 불변 UUID형 식별자; 실패 재시도에서 재사용, 대시보드 중복 시도 묶기용. 학생 개인 식별자 아님 |
| <code>choices.pre_post</code> | ORDER-01 <code>before/after</code>는 동일 <code>fire_first/armed_first/unsure</code>; 사후 ‘확신도’ 필드·다른 문항으로 혼용 금지 |
| <code>choices.started_at/completed_at</code> | UTC ISO 시각, 게임 시작과 S5 필수 완료 시점. 오프라인 시간·이탈 시간 고려하지 않은 단순 차이는 활성 플레이 시간과 다를 수 있음 |
| <code>missions[].duration_sec</code> | 각 미션의 전경 활성 체류 초; 탭 숨김/휴지 시 정지하고 복귀 후 재개, S4의 1·2단계는 합산; 실측 검토 목적 |
| <code>missions[].wrong_attempts</code> | 확정된 잘못된 근거·배치 후 수정으로 돌아간 횟수. 능력·집중도를 직접 뜻하지 않음 |
| <code>opened_source_ids</code> | 안전 상세보기 패널을 실제 확장한 자료 ID만 기록. 카드 상단의 1줄 요약만 읽은 경우 포함하지 않음 |
| <code>cited_source_ids</code> | 정답·보드에 실제로 연결한 자료 ID. 열람 없이 직접 연결할 수도 있어 <code>opened_source_ids</code>와 다를 수 있음. 열람=이해라고 해석하지 않음 |
| <code>missions[].mechanic_output</code> | A의 배열·교란·근거, B의 빈칸 답+근거, C의 당시 기록 역할·후대 3축 근거·강조축. 화면 셔플 순서가 정답·데이터 ID를 바꾸지 않음 |
| <code>final_reconstruction_text</code> | C의 필수 한 문장, 공백 제거 후 비어 있으면 미완료. AI 자동 의미 평가·감정 점수화 금지 |
| <code>comment</code> | 최상위 필드는 유지, 선택 소감은 빈 문자열 가능 |
| 개인정보 | 이름·학번·기기 식별자·IP·개인/가족의 실제 피해 경험 입력 요구·저장 금지 |

<b>localStorage — 1979와 충돌하지 않는 전용 키 잠금</b>

- <b><code>democracy-1980-v1-draft</code></b>만 본 게임 진행 상태의 기본 localStorage 키로 사용. 기존 <code>democracy-1979</code>의 <code>history-1979-v07-draft</code>와 절대 공유하지 않는다. 게임 URL origin이 같더라도 저장 상태 충돌하지 않도록 별도 키.
- 로컬 초안에는 씬/미션 단계, 선택·근거·수정 이력, 현재 화면 셔플 배열, 해당 시도 <code>result_id</code>, 반 정보, 활성 체류시간, 전송 상태를 유지. 새로고침·탭 복귀 시 같은 시도·같은 보기 배열로 이어하기.
- 공동 기기에서 기존 초안의 반 정보가 현재 <code>?class=</code>와 다르면 <b>이전 기록 자동 이어하기 금지</b>, 새 기록 시작 또는 교사에게 링크 확인 안내. 진행 초기화/새 시도 버튼 제공. 저장 완료된 결과를 자동 재전송하지 않고 저장 완료 화면만 재표시.
- 모든 미션의 중간 변경은 localStorage 저장만 실행; <b>중간 서버 POST 금지</b>. S5 완료 후 단일 자동 POST. 2xx를 받은 때만 <code>submissionStatus='saved'</code>; 오류·응답 소실이면 <code>unknown/failed</code> 상태로 남기고 같은 <code>result_id</code>와 payload로 재시도 및 TXT 백업.
- 클라이언트 전송 잠금은 이중 클릭을 줄이는 장치이지 서버의 <b>exactly-once / UNIQUE 보장</b>이 아니다. 서버 ID 유일성을 추가하려면 별도 DB 승인 필요.
- DASH-A 전용 renderer(향후): 반별 표본 수·사전 분포, 사후 동일 문항 응답 이동표, 미션별 잘못 연결 후 수정 비율, 열람/인용 차이, 활성 소요시간과 결측, 학생 복원 문장 요약. 소표본 보호·익명성 유지. B-S2 보도 출처와 학생 증거를 뒤섞지 않는다.

<b>가상 JSON 페이로드 예시 — 운영 DB 미기록</b>

```json
{
  "class": "1-3",
  "game": "democracy-1980",
  "choices": {
    "version": "1.2.0",
    "result_id": "democracy-1980-11111111-1111-4111-8111-111111111111",
    "record_type": "result",
    "mode": "archive-reconstruction",
    "question_id": "ORDER-01",
    "evidence_version": "1980-evidence-v1.2",
    "started_at": "2026-11-16T10:13:00.000Z",
    "completed_at": "2026-11-16T10:30:00.000Z",
    "pre_post": {
      "before": "unsure",
      "after": "fire_first"
    },
    "missions": [
      {
        "id": "A",
        "duration_sec": 210,
        "wrong_attempts": 1,
        "opened_source_ids": [
          "A-S1",
          "A-S2"
        ],
        "cited_source_ids": [
          "A-S1",
          "A-S2"
        ],
        "mechanic_output": {
          "ordered_event_ids": [
            "A-E1",
            "A-E2",
            "A-E3"
          ],
          "excluded_distractor_ids": [
            "A-D1",
            "A-D2"
          ],
          "evidence_links": [
            {
              "source_id": "A-S1",
              "target_id": "A-E1"
            },
            {
              "source_id": "A-S2",
              "target_id": "A-E2"
            }
          ]
        },
        "accuracy_flags": {
          "chronology_correct": true,
          "distractor_avoided": true,
          "evidence_supported": true
        }
      },
      {
        "id": "B",
        "duration_sec": 240,
        "wrong_attempts": 1,
        "opened_source_ids": [
          "B-S1",
          "B-S2"
        ],
        "cited_source_ids": [
          "B-S1",
          "B-S2",
          "B-S3"
        ],
        "mechanic_output": {
          "blanks": {
            "B-B1": {
              "answer_id": "military_fired",
              "source_id": "B-S2"
            },
            "B-B2": {
              "answer_id": "citizen_self_defense_armed",
              "source_id": "B-S3"
            },
            "B-B3": {
              "answer_id": "censorship_0517",
              "source_id": "B-S1"
            }
          }
        },
        "accuracy_flags": {
          "actor_restored": true,
          "sequence_correct": true,
          "censorship_identified": true
        }
      },
      {
        "id": "C",
        "duration_sec": 300,
        "wrong_attempts": 0,
        "opened_source_ids": [
          "C-S1",
          "C-S2",
          "C-G1a"
        ],
        "cited_source_ids": [
          "C-S1",
          "C-S2",
          "C-S3",
          "C-G1a",
          "C-G1b",
          "C-G1c"
        ],
        "mechanic_output": {
          "claim_comparison": [
            {
              "source_id": "C-S1",
              "role": "claim_origin"
            },
            {
              "source_id": "C-S2",
              "role": "citizen_stance"
            },
            {
              "source_id": "C-S3",
              "role": "reporting_demand"
            }
          ],
          "board_links": {
            "citizen_self_government": [
              {
                "source_id": "C-G1a",
                "role": "verified_context"
              },
              {
                "source_id": "C-S2",
                "role": "contemporary_stance"
              }
            ],
            "military_blockade": [
              {
                "source_id": "C-G1b",
                "role": "verified_context"
              }
            ],
            "negotiation_resistance_suppression": [
              {
                "source_id": "C-G1c",
                "role": "verified_context"
              },
              {
                "source_id": "C-S2",
                "role": "contemporary_stance"
              }
            ]
          },
          "lead_axis": "citizen_self_government"
        },
        "accuracy_flags": {
          "source_roles_distinguished": true,
          "three_axes_supported": true
        }
      }
    ],
    "final_reconstruction_text": "광주 시민은 자치 질서를 지켰고 계엄군의 봉쇄 속에서 협상과 항전을 고민했다."
  },
  "comment": "",
  "timestamp": "2026-11-16T10:30:00.000Z"
}
```

<b>v1.2 검증 계약:</b> top-level 5키만 유지, <code>choices.evidence_version</code> 존재 및 구 필드 <code>source_manifest_version</code> 부재, 각 미션 <code>duration_sec/wrong_attempts</code> 0 이상, B 3개 빈칸은 <code>answer_id + source_id</code>, C-1은 <code>claim_origin/citizen_stance/reporting_demand</code>, C-2는 3축 각각 공식 해설 근거 포함. <code>result_id</code> 안정성, JSON 직렬화와 UTF-8 한글, 익명성, 사료 링크 실패 독립성을 mock으로 검증.

#### §12 구현 금지 / 변경 금지 / 향후 BUILD 게이트

<b>이번 라운드에서 금지:</b> 새 게임 폴더/소스 파일 생성, GitHub <code>design-locks</code> 파일 생성·수정, <code>games.manifest.json</code> 수정, sibling 허브 <code>dashboard/index.html</code> 수정, Supabase DB 읽기·쓰기/마이그레이션, Pages 배포, 운영 학생 데이터에 시험 INSERT. <b>오직 노션 설계 문서 v1.2 정리·검수만 진행.</b>

<b>최종 잠금 승인 이후 별도 BUILD 지시를 받았을 때의 배포 차단 게이트</b>

1. <b>ID/registry:</b> <code>const GAME_SLUG = 'democracy-1980'</code> 선언, <code>buildPayload()</code>에 <code>game: 'democracy-1980'</code> 리터럴, manifest <code>draft</code>부터 시작, 폴더·공개 URL·저장 ID 일치 및 <code>npm run audit:games</code> PASS.
2. <b>반:</b> 모든 진입점에 <code>?class=</code> 표시, 프롤로그 반 배지와 실제 payload <code>class</code> 일치 확인. 누락 시 <code>미입력</code> 경고·교사 확인.
3. <b>실제 저장:</b> Chromebook 완료→최종 자동 POST→정상 HTTP 2xx(현행 API 성공 기준은 실제 구현 시 확인, 관례상 201)→<code>game_results</code>와 DASH-A 반별 집계 일치. production 오염 없이 mock/test부터 확인.
4. <b>renderer:</b> games manifest의 <code>renderer: democracy-1980</code>, sibling dashboard custom mapping, 교사 집계 화면과 허브 projection 일치. <code>democracy-1979</code>와 generic renderer 회귀 테스트.
5. <b>안전·접근성:</b> C-S2 전문/잔혹 묘사/미확인 소문 유입 없음, C-S1/C-S3 외부 링크 404/504에도 플레이 가능, A/B 셔플·이어하기 안정, S4 2단계 UX와 15\~18분 파일럿, 오프라인·재시도·TXT·중복 전송 테스트.

#### §13 검수·의사결정 이력 및 잠금 상태

| 버전 | 검토·결정 | v1.2 반영 |
| --- | --- | --- |
| GPT v1.0 | 5컷 A/B/C, 원사료 및 JSON 1차 계약 | 방향·서사·기록철 누적 보존 |
| Claude 독립 검토·Gate 감사 | B 위장 객관식 위험, C 출처 집중, DESIGN\_LOCK 누락 | B 답+근거, C 3축 검증, §0\~13 보완 |
| 피클 v0.5 / GPT v0.6 | 원문 확인·15\~18분·발포/무장 정밀화 | 안전 발췌·시간 목표·사실/주장 분리 |
| 피클 v0.7 / GPT v0.8 | B 9개 보기, C-S3 5·22, 비강제 열람, 교사 4선택 | 모두 반영 |
| 교사 승인 2026.11.16 | <b>O / 5·22 / O / O</b> | 설계 방향과 문서 작업만 승인; BUILD 승인 아님 |
| DESIGN\_LOCK v1.1 | 전체 §0\~13 초안, choices v1.1 | 최신 근거 위에서 설계 갱신 |
| <b>피클 검수 v0.8</b> | C-S2 학생 안전, §4 URL, SAVE·DASH·renderer/Game Fit/localStorage/evidence\_version, A/B 셔플, C 2단계 | <b>요청한 다섯 묶음 모두 반영</b> |
| <b>본 v1.2</b> | <b>최종 잠금용 노션 정본 후보</b> | 노션 기록·문서 검증 단계, 실제 구현/운영 변경 없음 |

<b>잠금 상태:</b> v1.2 본문 §0\~13 최종 승인 완료. 다만 이는 노션 설계 잠금이며 GitHub manifest lifecycle 등록과 실제 BUILD는 아직 실행하지 않았다. 원사료 출처 링크의 학생 기기 접근성과 수업 완주시간은 뒤따르는 파일럿·배포 게이트에서 실제 확인한다.

<b>최종 잠금 체크 — 교사 O 승인 완료:</b> renderer=democracy-1980 전용, C-S2 전문 미노출, S4 2단계, A/B 셔플 확정.
