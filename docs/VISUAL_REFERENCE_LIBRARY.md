# VISUAL REFERENCE LIBRARY v1.0

> **REFERENCE ONLY**
> 이 문서는 의무 규칙이 아니다.
> 기존 `gtmc-history-design SKILL v2.1`의 유용한 팔레트·마이크로인터랙션을 보존한 참고 라이브러리다.
> 실제 게임 디자인은 `VISUAL_DESIGN_RULES.md`가 우선한다.

## 1. 고려 계열 참고 팔레트

```css
--color-bg: #1a1208;
--color-surface: #2d1f0e;
--color-primary: #c8972a;
--color-accent: #6b9e8a;
--color-text: #f0e6d0;
--color-border: #8b6914;
```

참고 모티프:
- 청자 비색
- 금동
- 목판·종이 질감
- 인장

그 게임의 역할과 자료에 맞지 않으면 사용하지 않는다.

## 2. 조선 계열 참고 팔레트

```css
--color-bg: #f5f0e8;
--color-surface: #ede5d8;
--color-primary: #1a3a5c;
--color-accent: #8b1a1a;
--color-text: #1c1410;
--color-border: #8b7355;
```

참고:
- 문서형 Gameplay에 인주·도장 활용 가능
- 여백과 문서 위계 활용
- 세로쓰기 분위기는 실제 가독성을 해치지 않을 때만

## 3. 전쟁·위기 참고

```css
--color-bg: #0d0d0d;
--color-surface: #1a1a1a;
--color-primary: #cc3300;
--color-accent: #ff6600;
--color-text: #e8e0d0;
```

주의:
- 전쟁이라는 이유만으로 타이머·경고음·shake를 쓰지 않는다.
- 실제 피해·참극을 자극적 긴장으로 소비하지 않는다.
- 긴박감은 역사적 과업의 시간 제약이 실제로 있을 때만.

## 4. 근현대 자료 참고

```css
--color-bg: #f0ece4;
--color-surface: #e8e0d4;
--color-primary: #003087;
--color-accent: #cd2e3a;
--color-text: #1a1a1a;
--color-sepia: #8b7355;
```

세피아·사진 질감은 역사 자료 레이어에 제한적으로 사용 가능.
현대 조작부 전체를 낡은 종이로 만들 필요는 없다.

## 5. 마이크로인터랙션 참고

### 선택 확인

```css
.choice-card {
  border-left: 3px solid transparent;
  transition: border-color .2s, background .2s, transform .15s;
}
.choice-card:hover {
  border-left-color: var(--color-primary);
  transform: translateX(4px);
}
```

판단형 선택에 초록/빨강으로 정오를 암시하지 않는다.

### 화면 전환

```css
@keyframes scene-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.scene-enter { animation: scene-in .4s ease forwards; }
```

### 도장

```css
@keyframes stamp-in {
  0% { transform: scale(2) rotate(-5deg); opacity: 0; }
  60% { transform: scale(.95) rotate(1deg); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
```

도장 Gameplay에 실제 승인·결재 기능이 있을 때 우선 사용.

## 6. 폰트

추천 예시:
- Noto Sans KR
- Noto Serif KR
- Gowun Batang
- Black Han Sans

특정 폰트의 절대 금지/의무 사용이 목적은 아니다.
게임의 시점·자료·가독성에 맞는 폰트를 고른다.
