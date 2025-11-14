# 게시판 사이트

Next.js로 만든 간단한 게시판 사이트입니다. 댓글 작성, 수정, 삭제 기능이 포함되어 있습니다.

## 주요 기능

- 게시글 목록 조회
- 게시글 작성
- 게시글 상세 보기
- 댓글 작성
- 댓글 수정
- 댓글 삭제

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
board-app/
├── app/
│   ├── api/
│   │   ├── posts/          # 게시글 API
│   │   └── comments/       # 댓글 API
│   ├── posts/
│   │   └── [id]/          # 게시글 상세 페이지
│   ├── layout.tsx         # 레이아웃
│   ├── page.tsx           # 메인 페이지
│   └── globals.css        # 글로벌 스타일
├── lib/
│   └── data.ts            # 인메모리 데이터 저장소
└── types.ts               # TypeScript 타입 정의
```

## 참고사항

- 데이터는 인메모리로 저장되므로 서버를 재시작하면 초기화됩니다.
- 실제 프로덕션 환경에서는 데이터베이스를 사용하세요.
