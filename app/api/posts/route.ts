import { NextRequest, NextResponse } from 'next/server';
import { posts, getNextPostId, savePosts } from '@/lib/data';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parentId = searchParams.get('parentId');

  let filteredPosts = posts;

  // parentId가 지정된 경우 해당 답변글만 반환
  if (parentId) {
    filteredPosts = posts.filter((p) => p.parentId === parseInt(parentId));
  }

  // 비밀번호는 클라이언트에 반환하지 않음
  const postsWithoutPassword = filteredPosts.map(({ password, ...post }) => post);
  return NextResponse.json(postsWithoutPassword);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newPost = {
    id: getNextPostId(),
    title: body.title,
    content: body.content,
    author: body.author || '익명',
    createdAt: new Date().toISOString(),
    password: body.password ? hashPassword(body.password) : undefined,
    parentId: body.parentId || undefined, // 답변글인 경우 원글 ID
  };
  posts.push(newPost);
  savePosts(posts); // 파일에 저장

  // 비밀번호 제외하고 반환
  const { password, ...postWithoutPassword } = newPost;
  return NextResponse.json(postWithoutPassword, { status: 201 });
}
