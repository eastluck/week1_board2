import { NextRequest, NextResponse } from 'next/server';
import { comments, saveComments } from '@/lib/data';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const commentIndex = comments.findIndex((c) => c.id === parseInt(params.id));

  if (commentIndex === -1) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }

  comments[commentIndex] = {
    ...comments[commentIndex],
    content: body.content,
  };
  saveComments(comments); // 파일에 저장

  return NextResponse.json(comments[commentIndex]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const commentIndex = comments.findIndex((c) => c.id === parseInt(params.id));

  if (commentIndex === -1) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }

  comments.splice(commentIndex, 1);
  saveComments(comments); // 파일에 저장
  return NextResponse.json({ message: 'Comment deleted' }, { status: 200 });
}
