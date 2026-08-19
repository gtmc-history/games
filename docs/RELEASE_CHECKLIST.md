# Release checklist

새 게임 또는 기존 게임의 큰 변경은 아래를 Definition of Done으로 사용한다.

- [ ] DESIGN_LOCK 또는 동등한 설계 확정 기록이 있다.
- [ ] canonical slug·title·`game_id`가 확정됐다.
- [ ] `games.manifest.json`에 현재 lifecycle 상태가 등록됐다.
- [ ] direct URL, 시작, 핵심 동선, 결과 화면을 확인했다.
- [ ] SAVE를 `required` / `optional` / `none`으로 판정했다.
- [ ] DASH를 A / B / C로 판정했다.
- [ ] production 오염 없이 저장 payload를 검사했다.
- [ ] DASH-A/B metadata와 generic/custom renderer mapping을 확인했다.
- [ ] `npm run audit:games -- --hub-repo <path>`가 PASS했다.
- [ ] Pages URL과 핵심 동일 출처 리소스가 정상이다.
- [ ] 공개 직전에 manifest를 `published`로 전환했다.
- [ ] `published` 게임만 허브에 공개됐다.
