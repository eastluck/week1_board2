'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Post, Comment } from '@/types';

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

  const fetchPost = async () => {
    const res = await fetch(`/api/posts/${params.id}`);
    if (res.ok) {
      const data = await res.json();
      setPost(data);
    }
  };

  const fetchComments = async () => {
    const res = await fetch(`/api/comments?postId=${params.id}`);
    const data = await res.json();
    setComments(data);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId: parseInt(params.id as string),
        content: newComment,
        author: commentAuthor,
      }),
    });

    setNewComment('');
    setCommentAuthor('');
    fetchComments();
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = async (commentId: number) => {
    await fetch(`/api/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editContent }),
    });

    setEditingCommentId(null);
    setEditContent('');
    fetchComments();
  };

  const handleDeleteComment = async (commentId: number) => {
    if (confirm('댓글을 삭제하시겠습니까?')) {
      await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      fetchComments();
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  if (!post) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  return (
    <div>
      <button
        onClick={() => router.push('/')}
        className="mb-4 text-blue-500 hover:text-blue-700"
      >
        ← 목록으로
      </button>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
        <div className="flex justify-between text-sm text-gray-500 mb-4 pb-4 border-b">
          <span>작성자: {post.author}</span>
          <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
        </div>
        <div className="text-gray-800 whitespace-pre-wrap">{post.content}</div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">
          댓글 ({comments.length})
        </h3>

        <form onSubmit={handleAddComment} className="mb-6">
          <div className="mb-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              placeholder="작성자 (익명)"
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              댓글 작성
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-t pt-4">
              {editingCommentId === comment.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateComment(comment.id)}
                      className="px-4 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-800 mb-2">{comment.content}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <span className="mr-4">{comment.author}</span>
                      <span>
                        {new Date(comment.createdAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditComment(comment)}
                        className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          {comments.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              첫 댓글을 작성해보세요!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
