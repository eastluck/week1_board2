'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Post } from '@/types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    const data = await res.json();
    // 원글만 표시 (parentId가 없는 글)
    const originalPosts = data.filter((post: Post) => !post.parentId);

    // 각 원글의 답변 개수 계산
    const postsWithReplyCount = originalPosts.map((post: Post) => ({
      ...post,
      replyCount: data.filter((p: Post) => p.parentId === post.id).length,
    }));

    setPosts(postsWithReplyCount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author, password }),
    });

    setTitle('');
    setContent('');
    setAuthor('');
    setPassword('');
    setShowForm(false);
    fetchPosts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">게시글 목록</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showForm ? '취소' : '글쓰기'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">새 게시글 작성</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">작성자</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="익명"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="글 수정/삭제 시 필요합니다"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              작성하기
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {posts.map((post: any) => (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold flex-1">{post.title}</h3>
                {post.replyCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                    답변 {post.replyCount}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-2 line-clamp-2">{post.content}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>작성자: {post.author}</span>
                <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
