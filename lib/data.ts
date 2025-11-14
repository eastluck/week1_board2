import { Post, Comment } from '@/types';

// 인메모리 데이터 저장소
export let posts: Post[] = [
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

export let comments: Comment[] = [
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

let nextPostId = 3;
let nextCommentId = 3;

export function getNextPostId() {
  return nextPostId++;
}

export function getNextCommentId() {
  return nextCommentId++;
}
