import { NextRequest, NextResponse } from 'next/server';
import { comments, getNextCommentId, saveComments } from '@/lib/data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const postId = searchParams.get('postId');

  if (postId) {
    const postComments = comments.filter((c) => c.postId === parseInt(postId));
    return NextResponse.json(postComments);
  }

  return NextResponse.json(comments);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newComment = {
    id: getNextCommentId(),
    postId: body.postId,
    content: body.content,
    author: body.author || '익명',
    createdAt: new Date().toISOString(),
  };
  comments.push(newComment);
  saveComments(comments); // 파일에 저장
  return NextResponse.json(newComment, { status: 201 });
}
