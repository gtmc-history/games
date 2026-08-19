# Repository knowledge map

이 디렉터리는 운영 계약과 그 이유를 설명한다. 현재 게임 목록과 상태는 문서가 아니라 루트 `games.manifest.json`을 기준으로 한다.

| 작업 | 먼저 읽을 문서 | 내용 |
|---|---|---|
| 새 게임 생성·상태 변경 | `GAME_CONTRACT.md` | canonical identity, lifecycle, SAVE/DASH 판정, 완료 기준 |
| 역사 콘텐츠·사료·판정 수정 | `DESIGN_PRINCIPLES.md` | 역사 설계의 안전선과 근거 원칙 |
| Supabase 결과 저장 | `DATA_CONTRACT.md` | 실제 공통 payload와 호환성 규칙 |
| 배포 준비 | `RELEASE_CHECKLIST.md` | 새 게임·큰 변경의 Definition of Done |
| 키·RLS·운영 DB | `SECURITY.md` | client 권한, 데이터 보호, 정책 변경 원칙 |
| 미해결 문제 확인 | `TECH_DEBT.md` | RLS, migration history, stale test, architecture 부채 |

추가 참고 자료:

- 마지막 전수 baseline: `../AUDIT_GAMES_20260819.md`

문서와 실제 상태가 다르면 filesystem과 코드 확인 후 manifest와 문서를 함께 고친다. 과거 목록 문서를 registry로 사용하지 않는다.
