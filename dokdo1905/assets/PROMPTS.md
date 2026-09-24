# 독도연구소: 1905 파일 — 장면 삽화 교체 안내

지금 이 폴더의 그림은 **임시 삽화**(SVG로 그린 자리 표시)입니다.
AI로 만든 삽화를 **같은 파일 이름으로 덮어쓰면** 코드 수정 없이 바로 바뀝니다. 일부만 바꿔도 됩니다.

## 교체 현황

| 파일 | 상태 | 검토 메모 |
|---|---|---|
| `scene-title.jpg` | AI 삽화 적용 (2026-09-24) | 원칙 위반 없음 |
| `scene-s0.jpg` | AI 삽화 적용 (2026-09-24) | 원칙 위반 없음 |
| `scene-s1.jpg` | AI 삽화 적용 (2026-09-24) | 사람·국기 없음 |
| `scene-s2.jpg` | AI 삽화 적용 (2026-09-24) | 펼친 책의 섬 지도는 장식용 — 게임 속 기죽도약도(도식)와 별개 |
| `scene-s3.jpg` | AI 삽화 적용 (2026-09-24) | 전각 앞 석등이 일본식 석등(도로)에 가까워 보임 — 재생성 고려(선택) |
| `scene-s4.jpg` | 임시 삽화 | — |
| `scene-s5.jpg` | 임시 삽화 | — |
| `scene-s6.jpg` | 임시 삽화 | — |
| `yoon.jpg` | 임시 삽화 | — |

## 파일 규격

| 파일 | 장면 | 크기 | 쓰이는 곳 |
|---|---|---|---|
| `scene-title.jpg` | 타이틀 | 1600×900 | 첫 화면 사진 액자(세피아 필터가 자동으로 씌워짐) |
| `scene-s0.jpg` | 현재 · 연구소 전시실(밤) | 1600×900 | S0 도입, 사료 책상 위 띠 |
| `scene-s1.jpg` | 1905 · 도쿄 관청 집무실 | 1600×900 | S1 |
| `scene-s2.jpg` | 1877 · 문서 보관실 | 1600×900 | S2 |
| `scene-s3.jpg` | 1900 · 한성 관아와 관보 | 1600×900 | S3 |
| `scene-s4.jpg` | 1904 · 동해 해상 | 1600×900 | S4 |
| `scene-s5.jpg` | 1906 · 울도군 도동 포구 | 1600×900 | S5 |
| `scene-s6.jpg` | 현재 · 전시 개막 아침 | 1600×900 | S6 |
| `yoon.jpg` | 윤 연구원(가공 인물) 초상 | 480×480 | 대화창 초상, 작업판 말풍선 |

- 형식: JPG(또는 이름을 유지한 채 JPG로 변환), 장당 250KB 이하 권장.
- 가로 16:9. 사료 책상 위 띠에서는 가운데 부분이 가로로 잘려 보이므로, **중요한 대상은 화면 가운데 높이**에 두세요.
- 그림 안에 **글자를 넣지 마세요**(한자·한글 모두). 생성형 AI는 글자를 틀리게 그립니다.

## 반드시 지킬 것 (DESIGN_LOCK §5)

- **실존 인물의 얼굴을 그리지 않는다.** 심흥택·박제순·나카이 등은 문서의 작성·언급 주체로만 다룹니다.
- **일본 관리·군인을 인물로 그리지 않는다.** 관청·군함은 사람 없이, 또는 아주 멀리 있는 작은 실루엣으로만.
- **국기·군기(욱일기 포함)·문장을 그리지 않는다.**
- 폭력·전투 장면, 과장된 적대 연출을 넣지 않는다.
- 사료 원본(태정관 지령, 관보, 보고서)을 그대로 그린 것처럼 보이게 하지 않는다. 문서는 "글씨가 흐릿한 종이" 정도로만.

## 공통 스타일 문구 (모든 프롬프트 끝에 붙이기)

```
semi-realistic Korean historical illustration, painterly digital art, muted cinematic palette of deep navy, sea teal and warm lamp light, soft film grain, gentle vignette, no text, no letters, no flags, no identifiable real people, 16:9 wide composition
```

## 장면별 프롬프트

### scene-title.jpg — 새벽 동해의 두 섬
```
Dawn over the East Sea, two steep volcanic rock islets (a larger eastern islet and a taller western islet) silhouetted against a golden sunrise, calm sea with light reflections, a few seagulls, vast quiet atmosphere, no boats, no people
```

### scene-s0.jpg — 현재, 연구소 전시실(개막 전날 밤)
```
A modern small history museum exhibition room at night, one spotlight on an unfinished exhibition panel on an easel with a yellow sticky note, glass display cases in shadow, a desk lamp and scattered archival folders, quiet late-night work atmosphere, no people
```

### scene-s1.jpg — 1905, 도쿄 관청 집무실
```
Interior of a Meiji-era government office at night in 1905, a heavy wooden desk with stacked paper documents, an inkstone and brush, a red seal ink pad, a window showing a dark city with Western-style brick buildings and a few gas lamps, cold and formal atmosphere, empty room, no people
```

### scene-s2.jpg — 1877, 문서 보관실
```
A 19th-century archive room with wooden shelves full of bound Japanese document volumes tied with string, an open document file on a desk with faded handwriting and a small hand-drawn sketch map of two islands, an oil lamp casting warm light, dust in the air, no people
```

### scene-s3.jpg — 1900, 한성 관아와 관보
```
Seoul in autumn 1900, a traditional Korean government office building with a curved tiled roof and red wooden pillars, mountains in soft morning haze behind, in the foreground a wooden table with a freshly printed official gazette sheet with blurred unreadable print, calm dignified atmosphere, no people
```

### scene-s4.jpg — 1904, 동해 해상
```
Night on the East Sea in 1904, a dark silhouette of an early 20th-century steam warship with two funnels and smoke, a faint searchlight beam over the water, two small rocky islets far on the horizon, cold blue moonlight, tense but quiet mood, no visible crew, no flags or insignia
```

### scene-s5.jpg — 1906, 울도군 도동 포구
```
A narrow harbor cove on Ulleungdo island in early spring 1906, steep green cliffs on both sides, morning sea mist, a small steamship anchored in the cove, a few traditional Korean thatched and tiled houses on the shore, fishing boats pulled up on the pebble beach, quiet and remote, no people in close view
```

### scene-s6.jpg — 현재, 전시 개막 아침
```
A bright modern history museum exhibition hall on opening morning, three clean exhibition panels with blank placeholder blocks instead of text, a small illustration of two rocky islets on the central panel, a red ribbon on a stand, soft daylight, hopeful mood, no people
```

### yoon.jpg — 윤 연구원(가공 인물) 초상
```
Portrait of a fictional Korean museum researcher in their thirties, friendly and calm expression, round glasses, simple shirt with a lanyard ID card, soft studio light, teal background, bust shot, square composition, illustration style, not resembling any real person
```

## 교체 후 확인

1. 게임을 열어 각 장면 도입 화면과 사료 책상 위 띠에서 그림이 잘리지 않는지 봅니다.
2. 위 "반드시 지킬 것"을 다시 확인합니다.
3. 기관 게재 전, 사용한 이미지 생성 도구의 이용 조건(교육·공개 게시 가능 여부)을 확인합니다.
