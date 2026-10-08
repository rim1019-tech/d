# 🤝 디지털 동행

> **모르는 순간, 혼자 고민하지 않아도 괜찮아요.**

스마트폰과 디지털 기기가 어려운 어르신이 혼자 익히는 대신,
막히는 순간 **가족이나 사회복지사에게 바로 도움을 요청**할 수 있도록 돕는 웹앱 **시연용 프로토타입**입니다.

| 기능 | 내용 |
| --- | --- |
| 📚 배우기 | 무인 주문기(키오스크) 주문 연습, 기차·버스 예매 연습 |
| 🛡️ 지키기 | 오늘의 안심 퀴즈 5문항 (스미싱·사칭 대응 습관) |
| 💬 묻기 | 문자 사진 → AI가 쉬운 말로 풀이 + 조심할 부분 → 가족/사회복지사에게 확인 요청 |
| 👨‍👩‍👧 가족/복지사 화면 | 요청 확인 → "누르지 마세요 / 괜찮아요 / 전화드릴게요" → 어르신 화면에 큰 글씨 + 소리 안내 |

설치 없이, 웹주소만 열면 바로 사용할 수 있습니다. 회원가입은 없습니다.

---

## 1. 주소(URL) 구조

| 주소 | 화면 |
| --- | --- |
| `/` | 시작 화면 (어르신 / 가족 / 사회복지사 선택) |
| `/senior` | 어르신 홈 (`/senior/learn`, `/senior/quiz`, `/senior/ask` …) |
| `/family` | 가족 화면 (김민수) |
| `/welfare` | 사회복지사 화면 (박지영) |

- 화면 맨 위의 **"시연 화면" 바**로 한 브라우저에서 역할을 바로 바꿔 가며 시연할 수 있습니다.
- 주소 뒤에 `?demo=0` 을 붙이면 이 바가 숨겨집니다. (예: `https://내주소.vercel.app/?demo=0`)

## 2. 폴더 구조

```
digital-dongaeng/
├─ api/
│  └─ analyze.ts          # ★ 서버리스 함수: AI 문자 분석 (API 키는 여기서만 사용)
├─ public/favicon.svg
├─ src/
│  ├─ components/         # Btn, Header, Guide, Modal, Toast, Progress, SeniorMessage, Shell …
│  ├─ pages/              # Start, Home, Learn, Kiosk, Train, Quiz, Ask, Analyze, Answer, Guardian
│  ├─ data/               # 사용자, 키오스크 메뉴, 퀴즈, 예시 분석(fallback) 등 "내용" 데이터
│  ├─ hooks/useAppState.ts
│  ├─ services/
│  │  ├─ store.ts         # ★ 저장소 (지금은 localStorage) — 백엔드 교체 지점
│  │  ├─ requests.ts      # ★ 확인 요청 생성/답변/읽음 처리 — 백엔드 교체 지점
│  │  └─ aiClient.ts      # /api/analyze 호출 + 실패 시 fallback
│  ├─ utils/              # speak(음성), image(사진 축소), safety(확정 표현 차단)
│  ├─ __tests__/          # 화면 흐름 테스트 + API 함수 테스트
│  ├─ App.tsx  main.tsx  styles.css  types.ts
├─ index.html  vite.config.ts  tsconfig.json  vercel.json
├─ .env.example  .gitignore  package.json
```

## 3. 로컬에서 실행하기

필요한 것: **Node.js 20.19 이상** (22 권장)

```bash
npm install
npm run dev        # http://localhost:5173
```

- 이 상태에서는 `/api/analyze` 가 없으므로 AI 분석이 자동으로 **시연용 예시 분석(fallback)** 으로 동작합니다. 앱 전체는 정상 작동합니다.
- 실제 AI까지 로컬에서 확인하려면 [Vercel CLI](https://vercel.com/docs/cli)를 쓰세요:

```bash
npm i -g vercel
cp .env.example .env      # 그리고 .env 안의 GEMINI_API_KEY 를 실제 값으로 바꿉니다
vercel dev                # 화면 + /api/analyze 가 함께 실행됩니다
```

기타 명령어

```bash
npm test           # 화면 흐름 + API 함수 테스트 (13개)
npm run typecheck  # 타입 검사
npm run build      # 배포용 빌드 (dist/)
```

## 3-1. 파일 하나로 만들기 (설치·서버 없이 더블클릭)

```bash
npm run build:single      # → dist-single/index.html (파일 1개, 약 300KB)
```

- 이 파일은 **인터넷 없이** 더블클릭만으로 열립니다. USB·메신저로 전달해도 됩니다. (주소는 `#/senior` 처럼 `#` 방식으로 동작)
- 서버가 없으므로 AI 분석은 **시연용 예시 분석**으로 동작합니다. 실제 AI는 Vercel 배포본에서만 연결됩니다.
- 한 PC의 같은 브라우저 안에서 어르신↔가족 화면이 연결됩니다.

## 4. 필요한 환경변수

| 이름 | 필수 | 설명 |
| --- | --- | --- |
| `GEMINI_API_KEY` | 선택 (없으면 예시 분석으로 동작) | Google AI Studio에서 발급한 키 |
| `GEMINI_MODEL` | 선택 | 기본값 `gemini-2.5-flash`. 모델 이름이 바뀌었거나 다른 모델을 쓰고 싶으면 [Google AI Studio](https://aistudio.google.com/)에서 현재 사용 가능한 이름을 확인해 넣으세요. |

> ⚠️ **`VITE_` 로 시작하는 이름으로 비밀키를 만들지 마세요.** `VITE_` 변수는 빌드 때 브라우저 코드에 그대로 들어가 누구나 볼 수 있습니다.
> 이 프로젝트의 키는 서버리스 함수(`api/analyze.ts`)만 읽습니다.

## 5. AI API 연결 방법

흐름: `브라우저 → /api/analyze (Vercel 서버리스 함수) → Gemini API`

1. [Google AI Studio](https://aistudio.google.com/)에서 API 키를 발급합니다.
2. Vercel 프로젝트 **Settings → Environment Variables** 에 `GEMINI_API_KEY` 를 추가합니다. (Production / Preview 모두 체크)
3. **Redeploy** 합니다. (환경변수는 새 배포부터 적용됩니다.)
4. `묻기 → 예시 문자로 해보기` 를 눌러, 분석 결과 아래에 **"(시연용 예시 분석)" 이 보이지 않으면** 실제 AI가 연결된 것입니다.

안전장치

- AI가 `사기입니다`, `100%`, `안전합니다` 같은 **확정 표현**을 쓰면 결과를 버리고 예시 분석으로 대신 보여줍니다. (서버와 브라우저 양쪽에서 검사)
- 키가 없거나, 시간 초과(25초), 오류, 형식 오류 → 모두 **예시 분석으로 자동 대체**되어 화면이 끊기지 않습니다.
- 서버 함수는 사진·문자 내용을 로그에 남기지 않고, 기기별 간단한 호출 제한(분당 15회, 최선의 노력)을 둡니다.
- 다른 AI(예: Claude)로 바꾸려면 `api/analyze.ts` 의 `callModel()` 만 수정하면 됩니다.

## 6. Vercel 배포 방법

1. GitHub에 새 Repository를 만들고 이 폴더를 올립니다.
   ```bash
   git init
   git add .
   git commit -m "디지털 동행 프로토타입"
   git branch -M main
   git remote add origin https://github.com/내아이디/digital-dongaeng.git
   git push -u origin main
   ```
   (`.env` 는 `.gitignore` 에 들어 있어 올라가지 않습니다. 키는 절대 커밋하지 마세요.)
2. [vercel.com](https://vercel.com) 에 GitHub 계정으로 로그인 → **Add New… → Project** → 방금 만든 Repository **Import**.
3. 설정은 자동 인식됩니다. (Framework: **Vite**, Build: `npm run build`, Output: `dist`)
4. **Environment Variables** 에 `GEMINI_API_KEY` 를 입력합니다. (없어도 배포는 되고 예시 분석으로 동작)
5. **Deploy** → 완료되면 `https://프로젝트이름.vercel.app` 주소가 생깁니다. 이 주소를 공유하면 됩니다.
6. 이후 `git push` 할 때마다 자동으로 다시 배포됩니다.

`vercel.json` 이 `/senior`, `/family` 같은 주소로 직접 접속하거나 새로고침해도 화면이 열리도록 처리합니다.

## 7. 데모 사용자 (가상)

| 역할 | 이름 |
| --- | --- |
| 어르신 | 김순자 |
| 가족 | 김민수 |
| 사회복지사 | 박지영 |

실제 회원이 아닌 시연용 이름입니다.

## 8. 시연 방법과 주의사항

**권장 시연 순서** — 한 브라우저(탭 1개)에서:
`어르신 → 묻기 → 예시 문자로 해보기 → 가족에게 물어보기 → 보내기` → 위쪽 **가족** 탭 → `누르지 마세요` → 위쪽 **어르신** 탭 → `💌 답이 도착했어요` → `🔊 소리로 듣기`

**꼭 알아두세요**

- 🔁 **지금은 "같은 브라우저" 안에서만 어르신↔가족이 연결됩니다.** 요청/답변이 브라우저 저장소(localStorage)에 있기 때문입니다.
  어르신은 폰, 가족은 PC처럼 **서로 다른 기기끼리는 연결되지 않습니다.** (같은 브라우저의 다른 탭끼리는 연결됩니다.) 기기 간 연결은 아래 10번(Supabase)에서 다룹니다.
- 🔒 **개인정보**: 시연용입니다. 실제 이름·전화번호·계좌번호·주민등록번호가 보이는 사진은 올리지 마세요. 앱은 이런 정보를 입력받지 않습니다.
  - 올린 사진은 **브라우저 안에서 작게 줄인 뒤**, 분석을 위해 AI 서버 함수로 보내지고(서버에 저장하지 않음), 확인 요청이 있는 동안 **내 브라우저에만** 보관됩니다. 2시간 뒤 자동 삭제되며, 시작 화면의 **"시연 기록 지우기"** 로 바로 지울 수 있습니다.
  - 사진 분석은 외부 AI(Gemini)로 전송됩니다. 이 점을 시연 참가자에게 알려 주세요.
- 💳 결제·예매·문자 전송은 모두 **연습용**이며 실제로 일어나지 않습니다.
- 🔊 **소리 안내**는 브라우저/기기의 기본 음성(Web Speech API)을 씁니다. 기기에 한국어 음성이 없거나 무음 모드이면 들리지 않을 수 있습니다. (발표 전 실제 기기에서 볼륨과 함께 확인하세요.)
- 🤖 AI는 사기 여부를 **확정하지 않고** "확인이 필요해요"로 안내하는 보조 도구입니다.

## 9. 배포 후 체크리스트

배포된 주소에서 **스마트폰 실제 기기**로 확인하세요.

- [ ] `/` 접속 → 시작 화면 3개 버튼이 크게 보인다 (작은 글씨 안내문 포함)
- [ ] `/senior`, `/family` 주소로 **직접 접속·새로고침**해도 화면이 열린다
- [ ] 어르신 → 배우기 → 무인 주문기: 불고기버거 → 콜라 → 장바구니 → 주문하기 → 카드(연습) → 완료
- [ ] 잘못 눌렀을 때 "괜찮아요. 천천히 다시 찾아볼까요?" 가 나온다
- [ ] 배우기 → 기차·버스: 출발지 → 도착지 → 날짜 → 시간 → 좌석 → 확인 → 완료
- [ ] 지키기: 퀴즈 5개 → 완료, 홈의 "안심 퀴즈 5/5" 반영
- [ ] 묻기 → **갤러리에서 문자 캡처 사진 선택** → 3개 구역(무슨 내용 / 조심할 부분 / 어떻게 하면)이 나온다
- [ ] AI 연결 시 "(시연용 예시 분석)" 문구가 **없다** / 미연결 시 문구가 있고 화면은 정상이다
- [ ] 가족에게 물어보기 → 보내기 → (가족 탭) 사진과 요약이 보인다 → 답변 → (어르신 탭) 큰 글씨 답변
- [ ] 🔊 소리로 듣기 → 실제 음성이 재생된다 (iPhone Safari / Android Chrome 각각)
- [ ] 뒤로가기와 🏠 홈 버튼이 모든 하위 화면에서 보인다
- [ ] 사진에 `API 키`·개인정보가 노출되지 않고, 브라우저 개발자도구 → Network 에서 **키가 보이지 않는다**
- [ ] PC 브라우저에서 스마트폰 크기 화면이 중앙에 표시된다

## 10. 실제 서비스로 발전시키려면 (Supabase 등 백엔드 연결)

지금 **바꿔야 하는 곳은 딱 두 파일**입니다 — `src/services/store.ts`, `src/services/requests.ts`.
화면 코드는 이 함수들만 쓰므로 거의 수정이 필요 없습니다.

| 지금(데모) | 실제 서비스 |
| --- | --- |
| 같은 브라우저 localStorage | **Supabase Postgres + Realtime** (기기 간 실시간 전달) |
| `createRequest()` | `insert into help_requests` |
| `answerRequest()` / `markSeen()` | `update help_requests …` |
| `useAppState()` 의 저장소 구독 | Supabase Realtime 구독 (`postgres_changes`) |
| 사진을 data URL 로 보관 | **Supabase Storage (비공개 버킷)** + 만료되는 서명 URL |
| 고정된 가상 사용자 | **가족 연결**: 어르신-가족-복지사를 잇는 연결 코드/초대 + 인증 |
| 호출 제한(메모리) | 서버 측 영구 호출 제한(예: Upstash Redis) |

권장 테이블 예시

```sql
create table help_requests (
  id uuid primary key default gen_random_uuid(),
  senior_id uuid not null,         -- 요청한 어르신
  responder_id uuid not null,      -- 답할 가족/복지사
  image_path text,                 -- Storage 경로 (비공개 버킷)
  analysis jsonb not null,         -- { easy, level, signs, actions }
  answer text check (answer in ('no','ok','call')),
  seen boolean not null default false,
  created_at timestamptz not null default now()
);
-- RLS: 요청한 어르신과 지정된 답변자 본인만 읽기/쓰기
```

실제 서비스 전에 반드시 검토할 것

1. **개인정보 동의와 처리방침** — 문자 캡처에는 타인의 번호·이름이 포함될 수 있습니다. 수집 항목·보관 기간·AI 전송 사실을 명시하고 동의를 받으세요.
2. **인증과 권한(RLS)** — 요청을 본인과 연결된 가족/복지사만 볼 수 있도록 제한하세요.
3. **보관 기간 정책** — 사진은 짧게 보관 후 자동 삭제(예: 24시간)하는 것을 권장합니다.
4. **AI 오답 대응** — AI는 보조 도구입니다. "확정하지 않음" 원칙과 가족·복지사 확인 흐름을 유지하세요.
5. **접근성 검증** — 실제 70~80대 어르신과 현장 사용성 테스트를 진행하세요.
6. **알림** — 요청이 왔을 때 가족에게 푸시/문자 알림이 가도록(예: 웹푸시, 카카오 알림톡) 추가하세요.

---

시연용 프로토타입입니다. 실제 개인정보를 입력하지 마세요.
