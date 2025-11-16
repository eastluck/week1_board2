'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Post, Comment } from '@/types';

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Post[]>([]);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedAuthor, setEditedAuthor] = useState('');
  const [password, setPassword] = useState('');

  // 게시글 삭제 관련
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [deletePostPassword, setDeletePostPassword] = useState('');

  // 답변 작성 관련
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyTitle, setReplyTitle] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyPassword, setReplyPassword] = useState('');

  // 답변 수정 관련
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editedReplyTitle, setEditedReplyTitle] = useState('');
  const [editedReplyContent, setEditedReplyContent] = useState('');
  const [editedReplyAuthor, setEditedReplyAuthor] = useState('');
  const [editReplyPassword, setEditReplyPassword] = useState('');

  // 답변 삭제 관련
  const [deletingReplyId, setDeletingReplyId] = useState<number | null>(null);
  const [deleteReplyPassword, setDeleteReplyPassword] = useState('');

  useEffect(() => {
    fetchPost();
    fetchReplies();
  }, []);

  const fetchPost = async () => {
    const res = await fetch(`/api/posts/${params.id}`);
    if (res.ok) {
      const data = await res.json();
      setPost(data);
    }
  };

  const fetchReplies = async () => {
    const res = await fetch(`/api/posts?parentId=${params.id}`);
    const data = await res.json();
    setReplies(data);
  };

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: replyTitle,
        content: replyContent,
        author: replyAuthor,
        password: replyPassword,
        parentId: parseInt(params.id as string),
      }),
    });

    setReplyTitle('');
    setReplyContent('');
    setReplyAuthor('');
    setReplyPassword('');
    setShowReplyForm(false);
    fetchReplies();
  };

  const handleEditReply = (reply: Post) => {
    setEditingReplyId(reply.id);
    setEditedReplyTitle(reply.title);
    setEditedReplyContent(reply.content);
    setEditedReplyAuthor(reply.author);
    setEditReplyPassword('');
  };

  const handleUpdateReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReplyId) return;

    const res = await fetch(`/api/posts/${editingReplyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editedReplyTitle,
        content: editedReplyContent,
        author: editedReplyAuthor,
        password: editReplyPassword,
      }),
    });

    if (res.ok) {
      setEditingReplyId(null);
      setEditReplyPassword('');
      fetchReplies();
    } else {
      const error = await res.json();
      alert(error.error === 'Invalid password' ? '비밀번호가 일치하지 않습니다.' : '오류가 발생했습니다.');
    }
  };

  const handleDeleteReply = (replyId: number) => {
    setDeletingReplyId(replyId);
    setDeleteReplyPassword('');
  };

  const handleConfirmDeleteReply = async (e: React.FormEvent, replyId: number) => {
    e.preventDefault();

    const res = await fetch(`/api/posts/${replyId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: deleteReplyPassword }),
    });

    if (res.ok) {
      setDeletingReplyId(null);
      setDeleteReplyPassword('');
      fetchReplies();
    } else {
      const error = await res.json();
      alert(error.error === 'Invalid password' ? '비밀번호가 일치하지 않습니다.' : '오류가 발생했습니다.');
    }
  };

  const handleCancelDeleteReply = () => {
    setDeletingReplyId(null);
    setDeleteReplyPassword('');
  };

  const handleCancelEditReply = () => {
    setEditingReplyId(null);
    setEditReplyPassword('');
  };

  const handleEditPost = () => {
    if (post) {
      setIsEditingPost(true);
      setEditedTitle(post.title);
      setEditedContent(post.content);
      setEditedAuthor(post.author);
      setPassword('');
    }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/posts/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editedTitle,
        content: editedContent,
        author: editedAuthor,
        password,
      }),
    });

    if (res.ok) {
      setIsEditingPost(false);
      setPassword('');
      fetchPost();
    } else {
      const error = await res.json();
      alert(error.error === 'Invalid password' ? '비밀번호가 일치하지 않습니다.' : '오류가 발생했습니다.');
    }
  };

  const handleCancelEditPost = () => {
    setIsEditingPost(false);
    setPassword('');
  };

  const handleDeletePost = () => {
    setIsDeletingPost(true);
    setDeletePostPassword('');
  };

  const handleConfirmDeletePost = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/posts/${params.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: deletePostPassword }),
    });

    if (res.ok) {
      alert('게시글이 삭제되었습니다.');
      router.push('/');
    } else {
      const error = await res.json();
      alert(error.error === 'Invalid password' ? '비밀번호가 일치하지 않습니다.' : '오류가 발생했습니다.');
    }
  };

  const handleCancelDeletePost = () => {
    setIsDeletingPost(false);
    setDeletePostPassword('');
  };

  if (!post) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  return (
    <div>
      <button
        onClick={() => {
          const returnPage = searchParams.get('returnPage') || '1';
          router.push(`/?page=${returnPage}`);
        }}
        className="mb-4 text-blue-500 hover:text-blue-700"
      >
        ← 목록으로
      </button>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {isEditingPost ? (
          <form onSubmit={handleUpdatePost}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">제목</label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">내용</label>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full px-3 py-2 border rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">작성자</label>
              <input
                type="text"
                value={editedAuthor}
                onChange={(e) => setEditedAuthor(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                저장
              </button>
              <button
                type="button"
                onClick={handleCancelEditPost}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </form>
        ) : isDeletingPost ? (
          <form onSubmit={handleConfirmDeletePost}>
            <h2 className="text-2xl font-bold mb-4 text-red-600">게시글 삭제</h2>
            <p className="mb-4 text-gray-700">정말로 이 게시글을 삭제하시겠습니까?</p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">비밀번호</label>
              <input
                type="password"
                value={deletePostPassword}
                onChange={(e) => setDeletePostPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="비밀번호를 입력하세요"
                required
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                삭제 확인
              </button>
              <button
                type="button"
                onClick={handleCancelDeletePost}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
            <div className="flex justify-between text-sm text-gray-500 mb-4 pb-4 border-b">
              <span>작성자: {post.author}</span>
              <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
            <div className="text-gray-800 whitespace-pre-wrap mb-4">{post.content}</div>
            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={handleEditPost}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                수정
              </button>
              <button
                onClick={handleDeletePost}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            댓글 ({replies.length})
          </h3>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showReplyForm ? '취소' : '댓글 작성'}
          </button>
        </div>

        {showReplyForm && (
          <form onSubmit={handleAddReply} className="mb-6 p-4 bg-gray-50 rounded">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">제목</label>
              <input
                type="text"
                value={replyTitle}
                onChange={(e) => setReplyTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="댓글 제목"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">내용</label>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
                placeholder="댓글 내용"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">작성자</label>
              <input
                type="text"
                value={replyAuthor}
                onChange={(e) => setReplyAuthor(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="익명"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">비밀번호</label>
              <input
                type="password"
                value={replyPassword}
                onChange={(e) => setReplyPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="댓글 수정/삭제 시 필요합니다"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              댓글 등록
            </button>
          </form>
        )}

        <div className="space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="border-t pt-4 pl-4 border-l-4 border-l-blue-200">
              {editingReplyId === reply.id ? (
                <form onSubmit={handleUpdateReply}>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-2">제목</label>
                    <input
                      type="text"
                      value={editedReplyTitle}
                      onChange={(e) => setEditedReplyTitle(e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-2">내용</label>
                    <textarea
                      value={editedReplyContent}
                      onChange={(e) => setEditedReplyContent(e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-2">작성자</label>
                    <input
                      type="text"
                      value={editedReplyAuthor}
                      onChange={(e) => setEditedReplyAuthor(e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-2">비밀번호</label>
                    <input
                      type="password"
                      value={editReplyPassword}
                      onChange={(e) => setEditReplyPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="비밀번호를 입력하세요"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEditReply}
                      className="px-4 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                    >
                      취소
                    </button>
                  </div>
                </form>
              ) : deletingReplyId === reply.id ? (
                <form onSubmit={(e) => handleConfirmDeleteReply(e, reply.id)}>
                  <h4 className="text-lg font-semibold mb-2 text-red-600">댓글 삭제</h4>
                  <p className="mb-3 text-gray-700">정말로 이 댓글을 삭제하시겠습니까?</p>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-2">비밀번호</label>
                    <input
                      type="password"
                      value={deleteReplyPassword}
                      onChange={(e) => setDeleteReplyPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="비밀번호를 입력하세요"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      삭제 확인
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelDeleteReply}
                      className="px-4 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                    >
                      취소
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h4 className="text-lg font-semibold mb-2">{reply.title}</h4>
                  <p className="text-gray-800 mb-2 whitespace-pre-wrap">{reply.content}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <span className="mr-4">작성자: {reply.author}</span>
                      <span>
                        {new Date(reply.createdAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditReply(reply)}
                        className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteReply(reply.id)}
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

          {replies.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              첫 번째 댓글을 작성해보세요!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
