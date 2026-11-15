# 1979: 지워진 목소리 — v0.7 검수본

> **교사 배포 미승인**. 기준: v0.6 커밋 `775f6571`. 기존 PR #12는 건드리지 않았습니다. 메인 병합 전 Claude·피클 재검수 필요.

## 소스 및 이미지

- [단일 HTML 코드와 게임](./index.html): WebP 장면 3장 내장, SVG 3종은 **판정과 보도 결정을 기록한 후 해설에서만** 노출
- [도입 원본 이미지 — 1972](./assets/intro_1972.webp): 인물·여의도 국회의사당·남산타워가 없는 새 AI 생성 편집실 장면
- [1975 원본](./assets/intro_1975.webp) / [1979 원본](./assets/intro_1979.webp): 기존 연출용 WebP 유지
- [노션 시범 05](https://app.notion.com/p/4183032e882f813799ccecc76fd9274f)

## v0.6에서 달라진 점

1. 문항 3·4, 5·6 순서 교환. 연도별 첫 문항에서 1975 **미확인 70% 주장**, 1979 **단독 소개문 누락**을 자료 전 판단으로 기록
2. 첫 문항 1·3·5의 자료 전/후 **확신도 3단계**, 짝수 후속 문항 2·4·6의 최종 확신도 기록
3. 각 문항에서 **보도 결정**(송고/수정 후 송고/보류)과 이유, 당대의 보도 통제 조건을 연결한 결과 제공. 역사적 희생·폭력을 게임 점수로 만들지 않음
4. 짝수 문항은 누를 수 없는 **정적 자료 카드**. 첫 판단이 수집되지 않았음을 데이터로 구분하고 학생 화면에서는 쉬운 말 사용
5. 역사 SVG 도식을 **피드백 단계**로 이동. 320~390px 모바일에서는 도식의 큰 글자 목록으로 대체. 1979 화살표 겹침 수정
6. 1972 연출 컷 교체(인물·시대착오 가능 건축물 제거), `unlock()` 포커스·손상된 저장 기록 정합성·1975 ‘금지’ 용어 통일
7. 결과 화면에서 Supabase REST `game_results`로 **익명 결과 한 번에 저장**; 저장 실패·오프라인에서도 학습 종료, 재시도 버튼, TXT 백업 유지. 키는 publishable 유형만 클라이언트에서 사용. 학생 성명·학번 수집 없음
8. `games.manifest.json`: canonical slug `democracy-1979`, status `tested`, save `required`, dashboard `A`, renderer `generic`. **허브 published 공개는 아직 하지 않음.**

## 검증과 제약

- GPT 테스트: `node --check` 통과; Chromium에서 6개 문항 완주, 원문 배포 아닌 재구성 카드 확인, 편집 결정, 확신도, TXT UTF-8 BOM·한글·KST 확인
- 320/390/768/1280px 넘침 0, 모바일 SVG 글자 목록, 키보드 포커스 확인
- **실제 production DB INSERT 0건**. 브라우저의 `fetch` 자체를 모의 객체로 바꿔 POST의 header/payload·class·result_id·재시도 HTTP 503→201을 확인함. 모의 실패 후 재시도에서도 같은 `result_id` 사용
- **유의:** 컨테이너에서는 localhost/file URL 접근 제한으로 HTML을 Chromium `set_content`로 로드. localStorage는 **모의 구현**, 실제 학교 크롬북·실제 Supabase RLS/권한·GitHub Pages 동작은 확인하지 못함.
- 기존 1979 v0.6까지의 원본 기획 및 검수 내용은 [Notion](https://app.notion.com/p/4183032e882f813799ccecc76fd9274f)에 보존.

## 다음 단계

Claude: 역사 자료·의사결정 결과의 사실관계·교차 문항·저장 계약 및 POST 중복 방지·RLS 설계 검토. 피클: Chrome/Chromebook 실기기, 출처 링크, UI·게임성 검수. 교사 승인 전 `main` 병합·학생 배포 금지.
