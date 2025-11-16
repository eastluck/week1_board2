import { Post, Comment } from '@/types';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');

// 데이터 디렉토리 생성
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 초기 데이터
const initialPosts: Post[] = [
  {
    id: 1,
    title: '첫 번째 게시글입니다',
    content: '안녕하세요! 게시판에 오신 것을 환영합니다. 이것은 첫 번째 테스트 게시글입니다.',
    author: '관리자',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 2,
    title: 'Next.js 게시판 만들기',
    content: 'Next.js로 간단한 게시판을 만들어봤습니다. 댓글 기능과 수정 기능도 포함되어 있습니다.',
    author: '개발자',
    createdAt: new Date('2024-01-16').toISOString(),
  },
];

const initialComments: Comment[] = [
  {
    id: 1,
    postId: 1,
    content: '첫 번째 댓글입니다!',
    author: '사용자1',
    createdAt: new Date('2024-01-15T10:00:00').toISOString(),
  },
  {
    id: 2,
    postId: 1,
    content: '좋은 게시글이네요.',
    author: '사용자2',
    createdAt: new Date('2024-01-15T11:00:00').toISOString(),
  },
];

// 파일에서 데이터 읽기
function readPosts(): Post[] {
  try {
    if (fs.existsSync(POSTS_FILE)) {
      const data = fs.readFileSync(POSTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading posts file:', error);
  }
  return initialPosts;
}

function readComments(): Comment[] {
  try {
    if (fs.existsSync(COMMENTS_FILE)) {
      const data = fs.readFileSync(COMMENTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading comments file:', error);
  }
  return initialComments;
}

// 파일에 데이터 쓰기
export function savePosts(posts: Post[]): void {
  try {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving posts file:', error);
  }
}

export function saveComments(comments: Comment[]): void {
  try {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving comments file:', error);
  }
}

// 초기화
let postsData = readPosts();
let commentsData = readComments();

// 초기 파일이 없으면 생성
if (!fs.existsSync(POSTS_FILE)) {
  savePosts(postsData);
}
if (!fs.existsSync(COMMENTS_FILE)) {
  saveComments(commentsData);
}

// Export
export const posts = postsData;
export const comments = commentsData;

export function getNextPostId(): number {
  const maxId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) : 0;
  return maxId + 1;
}

export function getNextCommentId(): number {
  const maxId = comments.length > 0 ? Math.max(...comments.map(c => c.id)) : 0;
  return maxId + 1;
}
