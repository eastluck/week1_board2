import { NextRequest, NextResponse } from 'next/server';
import { posts, savePosts } from '@/lib/data';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = posts.find((p) => p.id === parseInt(params.id));
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  // 비밀번호 제외하고 반환
  const { password, ...postWithoutPassword } = post;
  return NextResponse.json(postWithoutPassword);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const postIndex = posts.findIndex((p) => p.id === parseInt(params.id));

  if (postIndex === -1) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const post = posts[postIndex];

  // 비밀번호 확인
  if (post.password && body.password) {
    const hashedInputPassword = hashPassword(body.password);
    if (post.password !== hashedInputPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
    }
  } else if (post.password && !body.password) {
    return NextResponse.json({ error: 'Password required' }, { status: 403 });
  }

  // 게시글 업데이트
  posts[postIndex] = {
    ...post,
    title: body.title || post.title,
    content: body.content || post.content,
    author: body.author || post.author,
  };
  savePosts(posts); // 파일에 저장

  const { password, ...postWithoutPassword } = posts[postIndex];
  return NextResponse.json(postWithoutPassword);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const postIndex = posts.findIndex((p) => p.id === parseInt(params.id));

  if (postIndex === -1) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const post = posts[postIndex];

  // 비밀번호 확인
  if (post.password && body.password) {
    const hashedInputPassword = hashPassword(body.password);
    if (post.password !== hashedInputPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
    }
  } else if (post.password && !body.password) {
    return NextResponse.json({ error: 'Password required' }, { status: 403 });
  }

  // 게시글 삭제
  posts.splice(postIndex, 1);
  savePosts(posts); // 파일에 저장
  return NextResponse.json({ message: 'Post deleted successfully' });
}
