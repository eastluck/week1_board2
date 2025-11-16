const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// 샘플 제목과 내용 템플릿
const titleTemplates = [
  'Next.js 개발 관련 질문입니다',
  'TypeScript 타입 에러 해결 방법',
  'React Hook 사용법 문의',
  'API 연동 중 CORS 에러',
  'CSS 레이아웃 관련 질문',
  'JavaScript 비동기 처리',
  'Node.js 서버 최적화',
  'Git 충돌 해결 방법',
  'Tailwind CSS 커스터마이징',
  'Vercel 배포 이슈',
  '데이터베이스 설계 고민',
  '웹 성능 최적화 팁',
  '프론트엔드 아키텍처',
  'REST API vs GraphQL',
  '보안 관련 질문',
  '테스트 코드 작성법',
  'Docker 컨테이너 설정',
  'CI/CD 파이프라인',
  '모바일 반응형 디자인',
  '사용자 인증 구현',
];

const contentTemplates = [
  '이 문제를 해결하기 위해 여러 방법을 시도해봤는데 잘 안되네요. 도움 부탁드립니다.',
  '공식 문서를 찾아봤지만 제 상황에 맞는 해결책을 찾지 못했습니다.',
  '초보 개발자인데 이 부분이 잘 이해가 안 갑니다. 설명 부탁드려요.',
  '프로젝트 진행 중 막혀서 질문 올립니다. 좋은 방법 있을까요?',
  '비슷한 문제를 겪으신 분들은 어떻게 해결하셨나요?',
  '이 코드가 왜 작동하지 않는지 모르겠어요. 검토 부탁드립니다.',
  '더 효율적인 방법이 있을까요? 피드백 환영합니다.',
  '베스트 프랙티스가 궁금합니다. 경험 공유 부탁드려요.',
  '이런 경우 어떤 접근 방식이 좋을까요?',
  '스택오버플로우에서도 답을 못 찾아서 여기 질문 올립니다.',
];

const replyTemplates = [
  '저도 비슷한 문제를 겪었는데, 이렇게 해결했습니다.',
  '공식 문서의 이 부분을 참고해보세요.',
  '제 경험상 이 방법이 가장 효과적이었습니다.',
  '이 라이브러리를 사용해보시는 건 어떨까요?',
  '코드를 이렇게 수정해보시면 될 것 같습니다.',
  '저는 다른 방식으로 접근했는데 잘 작동했습니다.',
  '이 부분은 이런 원리로 동작합니다.',
  '추가적으로 이 점도 고려해보세요.',
];

const authors = ['김개발', '이코딩', '박프론트', '최백엔드', '정풀스택', '익명', '개발자A', 'DevMaster', 'CodeNinja', '테크리더'];

// 날짜 생성 (최근 60일 이내)
function getRandomDate() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 60);
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString();
}

// 샘플 데이터 생성
const posts = [];
let postId = 1;

// 원글 70개 생성
for (let i = 0; i < 70; i++) {
  const title = `${titleTemplates[Math.floor(Math.random() * titleTemplates.length)]} #${i + 1}`;
  const content = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
  const author = authors[Math.floor(Math.random() * authors.length)];

  posts.push({
    id: postId++,
    title,
    content,
    author,
    createdAt: getRandomDate(),
    password: hashPassword('1234'), // 모든 샘플 데이터의 비밀번호는 '1234'
  });
}

// 답글 30개 생성 (원글에 랜덤으로 분배)
for (let i = 0; i < 30; i++) {
  const parentPost = posts[Math.floor(Math.random() * 70)]; // 원글 중 하나 선택
  const title = `Re: ${parentPost.title.substring(0, 30)}...`;
  const content = replyTemplates[Math.floor(Math.random() * replyTemplates.length)];
  const author = authors[Math.floor(Math.random() * authors.length)];

  posts.push({
    id: postId++,
    title,
    content,
    author,
    createdAt: getRandomDate(),
    password: hashPassword('1234'),
    parentId: parentPost.id,
  });
}

// ID 순으로 정렬
posts.sort((a, b) => a.id - b.id);

// 파일로 저장
const dataDir = path.join(__dirname, '../data');
const postsFile = path.join(dataDir, 'posts.json');

// data 디렉토리가 없으면 생성
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));

console.log(`✅ ${posts.length}개의 샘플 데이터가 생성되었습니다.`);
console.log(`📁 파일 위치: ${postsFile}`);
console.log(`🔑 모든 게시글의 비밀번호: 1234`);
