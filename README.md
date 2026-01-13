# TikTok Admin - 사용자 관리 시스템

TikTok Scout의 사용자 관리를 위한 독립적인 관리자 대시보드입니다.

## 기능

- ✅ **사용자 목록 조회**: 전체 사용자 목록을 테이블 형식으로 조회
- ✅ **검색 및 필터**: 이름, 이메일, 전화번호로 검색 가능
- ✅ **상태 필터**: 활성/비활성/차단 상태별로 필터
- ✅ **사용자 차단/해제**: 문제 사용자를 차단하거나 차단 해제
- ✅ **사용자 승인**: 가입 신청 사용자를 승인/거절
- ✅ **활성화/비활성화**: 사용자 계정 활성화 상태 관리
- ✅ **사용자 상세 정보**: 모달을 통해 개별 사용자의 상세 정보 확인

## 시작하기

### 설치

```bash
cd tiktok-admin
npm install
```

### 환경 변수 설정

`.env.local` 파일 생성 및 설정:

```
MONGODB_URI=mongodb://localhost:27017/tiktok-scout
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
```

### 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3001`에서 서버가 실행됩니다.

### 프로덕션 빌드

```bash
npm run build
npm run start
```

## 사용 방법

1. **로그인**: 관리자 계정으로 로그인 (`/login`)
2. **사용자 목록**: `/users` 페이지에서 모든 사용자 조회
3. **검색 및 필터**: 검색바와 필터를 사용하여 원하는 사용자 찾기
4. **액션 수행**: 각 사용자 행의 액션 버튼으로 차단, 승인, 활성화 등의 작업 수행

## API 엔드포인트

### 사용자 관리

- **GET** `/api/admin/users/list` - 사용자 목록 조회
  ```
  Query Parameters:
  - search: 검색어 (이름, 이메일, 전화번호)
  - status: all | active | inactive | banned
  - role: all | admin | user
  - approved: all | approved | pending
  - page: 페이지 번호 (기본값: 1)
  - limit: 한 페이지당 항목 수 (기본값: 20)
  ```

- **POST** `/api/admin/users/ban` - 사용자 차단
  ```json
  {
    "userId": "user_id",
    "reason": "차단 사유"
  }
  ```

- **POST** `/api/admin/users/unban` - 차단 해제
  ```json
  {
    "userId": "user_id"
  }
  ```

- **POST** `/api/admin/users/toggle-active` - 활성화/비활성화
  ```json
  {
    "userId": "user_id",
    "isActive": true
  }
  ```

- **POST** `/api/admin/users/approve` - 사용자 승인
  ```json
  {
    "userId": "user_id"
  }
  ```

- **POST** `/api/admin/users/reject` - 사용자 거절
  ```json
  {
    "userId": "user_id",
    "reason": "거절 사유"
  }
  ```

## 프로젝트 구조

```
tiktok-admin/
├── app/
│   ├── api/
│   │   └── admin/
│   │       └── users/
│   │           ├── list/route.ts
│   │           ├── ban/route.ts
│   │           ├── unban/route.ts
│   │           ├── toggle-active/route.ts
│   │           ├── approve/route.ts
│   │           └── reject/route.ts
│   ├── users/
│   │   ├── page.tsx
│   │   └── users.css
│   ├── login/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Header.tsx
│   ├── Header.css
│   ├── UserFilters.tsx
│   ├── UserFilters.css
│   ├── UserTable.tsx
│   ├── UserTable.css
│   └── modals/
│       ├── UserModal.tsx
│       ├── BanModal.tsx
│       ├── ApproveModal.tsx
│       └── Modal.css
├── lib/
│   ├── auth.ts
│   ├── auth/
│   │   ├── password.ts
│   │   └── getUserById.ts
│   ├── mongodb.ts
│   └── userManager.ts
├── .env.local
├── .gitignore
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── postcss.config.js
├── package.json
└── README.md
```

## 보안 정책

- 🔒 관리자만 접근 가능
- 🔐 NextAuth를 사용한 세션 기반 인증
- 🛡️ 본인 차단/권한 제거 방지
- 📝 모든 관리 작업 로깅

## 참고사항

- 이 애플리케이션은 `tik-tok-scout`의 MongoDB를 공유합니다
- 관리자 계정이 필요합니다 (isAdmin: true)
- 포트 3001에서 실행되도록 설정 (필요시 변경 가능)
