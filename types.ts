export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  password?: string; // 해싱된 비밀번호 (선택적)
  parentId?: number; // 답변글인 경우 원글의 ID
}

export interface Comment {
  id: number;
  postId: number;
  content: string;
  author: string;
  createdAt: string;
}
