# 1979 게임: 크롬 로컬 기록 복구 (2026-11-16)

## 목적
2026-11-16 수업에서 완료했지만 Supabase `game_results`에 등록되지 않은 「1979: 지워진 목소리」 판단 기록을 **재플레이 없이** 전송한다.

- 공개 주소: https://gtmc-history.github.io/games/democracy-1979/recover.html
- 원래 게임: https://gtmc-history.github.io/games/democracy-1979/
- 반드시 같은 Chrome 프로필, 같은 웹사이트 원본(origin)에서 열어야 한다.
- 저장 키: `history-1979-v07-draft`; 복구 페이지는 **해당 키를 읽기만** 한다.
- 데이터가 지워진 게스트/시크릿 세션이나 Chrome 프로필에서는 복구할 수 없다.

## 학생 안내
1. 지난 시간과 같은 Chromebook/Chrome 프로필로 **복구 페이지**를 연다.
2. **완료한 판단 6개 발견**이라는 문구를 확인한다.
3. 본인 **학급만** 고른다. 성명·학번은 입력하지 않는다.
4. **기존 기록을 서버에 다시 제출**을 누른다.
5. **서버 저장 성공** 또는 **이미 서버에 접수**라는 표시가 나오면 완료.
6. 전송이 안 되면 **기록 JSON 백업**을 누르고 학교에서 지정한 안전한 경로로 교사에게 제출한다.

## 기술 검증 / 설계
- v0.7 `buildPayload()`와 동일한 `class/game/timestamp/choices/comment` 구조로 전송한다.
- 완료 기록이 아닌 경우 서버로 전송하지 않는다. 미완료 시 원래 게임의 이어하기로 안내한다.
- 기존 `resultId`가 있으면 그대로 사용한다. 비어 있으면 원본 저장 문자열의 SHA-256을 이용해 안정적인 복구용 ID를 생성한다.
- `class`는 로컬 상태에 저장되지 않으므로 학생이 직접 선택해야 한다.
- `submissionStatus='saved'`여도 서버 실제 저장 여부가 확인된 것은 아니다. 복구용 버튼은 전송을 허용한다.
- Supabase에는 `game_results_democracy1979_result_id_uq` 부분 고유 인덱스를 적용했다. 동일 `choices.result_id`를 가진 1979 결과는 중복 INSERT할 수 없다.
- HTTP 201/204 성공은 신규 접수, `23505`와 해당 인덱스 이름의 HTTP 409는 기존 접수로 처리한다. 권한/RLS·네트워크 오류는 저장 완료로 처리하지 않는다.
- 원래 게임 코드와 `localStorage['history-1979-v07-draft']`는 절대 삭제하거나 수정하지 않는다.
- JSON 백업에는 학생이 입력한 서술문이 있으므로 공유/보관 권한을 제한한다.
- 학생 화면에서 바로 서버 기록을 조회하지 않는다. `game_results`의 읽기 권한을 익명에게 열지 않기 위해서다.
- 개발용 모의 테스트: 신규 저장, 고유 인덱스 충돌, 미완료 방지, 원본 저장값 불변 확인. **실제 학생 Chromebook의 데이터 존재 및 실제 POST 성공은 학생 접속 시 확인 필요.**

## 운영 후 확인
- 관리자 권한으로 Supabase에서 다음 조회를 실행한다.
```sql
select "class", count(*) as students
from public.game_results
where game='democracy-1979'
group by "class"
order by "class";
```
- 데이터 없는 학생이 있다면 다른 Chrome 프로필 사용, 로컬 기록 삭제, 미완료 여부를 먼저 확인한다.
- **재시험 없이 기록을 복구할 수 있는 것은 로컬에 남아 있는 경우뿐**이다.

## 복구 기능 해제
- 복구 기간이 끝나면 `recover.html` 파일만 삭제하거나 페이지를 접근 제한할 수 있다. 기존 `index.html`은 영향이 없다.
- DB 고유 인덱스는 향후에도 중복 방지를 위해 유지하는 것이 바람직하다.
