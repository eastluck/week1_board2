import { NextRequest, NextResponse } from 'next/server';
import { posts, getNextPostId } from '@/lib/data';

export async function GET() {
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newPost = {
    id: getNextPostId(),
    title: body.title,
    content: body.content,
    author: body.author || '익명',
    createdAt: new Date().toISOString(),
  };
  posts.push(newPost);
  return NextResponse.json(newPost, { status: 201 });
}
