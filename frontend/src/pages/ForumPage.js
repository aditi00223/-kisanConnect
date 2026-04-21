import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

const ForumPage = ({ user, onBack }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });
  const [replyText, setReplyText] = useState({});
  const [expandedPost, setExpandedPost] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/forum`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      setError('Failed to load forum posts.');
    }
    setLoading(false);
  };

  const handleCreatePost = async () => {
    if (!form.title || !form.content) return setError('Please fill title and content');
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/forum`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); setSubmitting(false); return; }
      setSuccess('Post created! ✅');
      setForm({ title: '', content: '' });
      setShowForm(false);
      fetchPosts();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to create post.');
    }
    setSubmitting(false);
  };

  const handleReply = async (postId) => {
    const content = replyText[postId];
    if (!content?.trim()) return;
    try {
      const res = await fetch(`${API}/api/forum/${postId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setReplyText({ ...replyText, [postId]: '' });
        fetchPosts();
      }
    } catch {
      setError('Failed to add reply.');
    }
  };

  const handleUpvote = async (postId) => {
    try {
      const res = await fetch(`${API}/api/forum/${postId}/upvote`, {
        method: 'PUT',
        headers: authHeader,
      });
      if (res.ok) fetchPosts();
    } catch {
      setError('Failed to upvote.');
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="text-xl font-bold text-green-700">KisanConnect</span>
        </div>
        <button
          onClick={onBack}
          className="text-sm text-green-700 border border-green-300 px-3 py-1 rounded-lg"
        >
          ← Back
        </button>
      </nav>

      {/* Header */}
      <div className="bg-green-700 text-white px-6 py-6">
        <h1 className="text-2xl font-bold">Community Forum 💬</h1>
        <p className="text-green-200 text-sm mt-1">Ask questions, share knowledge with fellow farmers</p>
      </div>

      <div className="px-6 py-6 max-w-3xl mx-auto">

        {/* Success / Error */}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">{success}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">⚠️ {error}</div>}

        {/* Create Post Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full mb-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-sm"
        >
          {showForm ? '✕ Cancel' : '✍️ Ask a Question / Start Discussion'}
        </button>

        {/* Create Post Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6 border border-gray-100">
            <h2 className="text-lg font-bold text-green-700 mb-4">New Post</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Title (e.g. Best time to sow wheat in Punjab?)"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                placeholder="Describe your question or share your knowledge..."
                rows={4}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 resize-none"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              <button
                onClick={handleCreatePost}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold py-3 rounded-xl text-sm"
              >
                {submitting ? '⏳ Posting...' : '📤 Post'}
              </button>
            </div>
          </div>
        )}

        {/* Posts List */}
        {loading ? (
          <p className="text-center text-gray-400 text-sm py-8">⏳ Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-gray-400">No posts yet. Be the first to ask!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-2xl shadow border border-gray-100">

                {/* Post Header */}
                <div className="p-5">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-base">{post.title}</h3>
                      <p className="text-sm text-gray-600 mt-2">{post.content}</p>
                    </div>
                  </div>

                  {/* Author + Meta */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-sm">
                        {post.author?.role === 'farmer' ? '🧑‍🌾' : '🛒'}
                      </span>
                      <div>
                        <p className="text-xs font-medium text-gray-700">{post.author?.name || 'User'}</p>
                        <p className="text-xs text-gray-400">{post.author?.location || ''} · {timeAgo(post.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpvote(post._id)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition-colors"
                      >
                        👍 {post.upvotes?.length || 0}
                      </button>
                      <button
                        onClick={() => setExpandedPost(expandedPost === post._id ? null : post._id)}
                        className="text-xs text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-50"
                      >
                        💬 {post.replies?.length || 0} {expandedPost === post._id ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Replies Section */}
                {expandedPost === post._id && (
                  <div className="border-t border-gray-100 px-5 pb-5">

                    {/* Existing Replies */}
                    {post.replies?.length > 0 && (
                      <div className="pt-4 flex flex-col gap-3 mb-4">
                        {post.replies.map((reply, i) => (
                          <div key={i} className="bg-gray-50 rounded-xl p-3">
                            <p className="text-sm text-gray-700">{reply.content}</p>
                            <p className="text-xs text-gray-400 mt-1">{timeAgo(reply.createdAt)}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Reply */}
                    <div className="flex gap-2 mt-3">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400"
                        value={replyText[post._id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [post._id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleReply(post._id)}
                      />
                      <button
                        onClick={() => handleReply(post._id)}
                        className="bg-green-600 text-white text-sm px-4 py-2 rounded-xl font-medium hover:bg-green-700"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ForumPage;