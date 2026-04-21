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

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/forum`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch { setError('Failed to load forum posts.'); }
    setLoading(false);
  };

  const handleCreatePost = async () => {
    if (!form.title || !form.content) return setError('Please fill title and content');
    setSubmitting(true); setError('');
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
    } catch { setError('Failed to create post.'); }
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
      if (res.ok) { setReplyText({ ...replyText, [postId]: '' }); fetchPosts(); }
    } catch { setError('Failed to add reply.'); }
  };

  const handleUpvote = async (postId) => {
    try {
      const res = await fetch(`${API}/api/forum/${postId}/upvote`, { method: 'PUT', headers: authHeader });
      if (res.ok) fetchPosts();
    } catch { setError('Failed to upvote.'); }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const inputStyle = { border: '1px solid #d4e8b0', background: '#f9fdf4', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#27500a', outline: 'none', width: '100%', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0f7e6 0%, #fffbf2 60%, #fff4ec 100%)' }}>

      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e2f0cc', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 12px #3B6D1110' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #eaf3de, #fef9ec)', border: '1px solid #c0dd97', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌾</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#27500a' }}>KisanConnect</span>
        </div>
        <button onClick={onBack} style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 8, border: '1px solid #c0dd97', background: '#f0f7e6', color: '#3B6D11', cursor: 'pointer' }}>
          ← Back
        </button>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #27500a 0%, #3B6D11 50%, #639922 100%)', padding: '32px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 80% 50%, #f59e0b, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 768, margin: '0 auto', position: 'relative' }}>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Community Forum 💬</h1>
          <p style={{ color: '#c0dd97', fontSize: 13, marginTop: 4 }}>Ask questions, share knowledge with fellow farmers</p>
        </div>
      </div>

      <div style={{ maxWidth: 768, margin: '0 auto', padding: '24px' }}>

        {/* Alerts */}
        {success && <div style={{ background: '#eaf3de', border: '1px solid #c0dd97', color: '#3B6D11', fontSize: 13, borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>✅ {success}</div>}
        {error && <div style={{ background: '#faece7', border: '1px solid #f5c4b3', color: '#993c1d', fontSize: 13, borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>⚠️ {error}</div>}

        {/* Create Post Button */}
        <button onClick={() => { setShowForm(!showForm); setError(''); }}
          style={{ width: '100%', marginBottom: 20, padding: '13px', borderRadius: 14, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, color: '#fff', background: showForm ? 'linear-gradient(135deg, #993c1d, #e05a20)' : 'linear-gradient(135deg, #d97706, #f59e0b)', boxShadow: showForm ? '0 4px 14px #993c1d40' : '0 4px 14px #d9770640' }}>
          {showForm ? '✕ Cancel' : '✍️ Ask a Question / Start Discussion'}
        </button>

        {/* Create Post Form */}
        {showForm && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, marginBottom: 20, border: '1px solid #e2f0cc', boxShadow: '0 2px 16px #3B6D1108' }}>
            <h2 style={{ color: '#27500a', fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>New Post</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="text" placeholder="Title (e.g. Best time to sow wheat in Punjab?)"
                style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <textarea placeholder="Describe your question or share your knowledge..." rows={4}
                style={{ ...inputStyle, resize: 'none' }} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              <button onClick={handleCreatePost} disabled={submitting}
                style={{ padding: '13px', borderRadius: 12, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 13, color: '#fff', background: submitting ? '#9aab87' : 'linear-gradient(135deg, #3B6D11, #639922)', boxShadow: submitting ? 'none' : '0 4px 14px #3B6D1140' }}>
                {submitting ? '⏳ Posting...' : '📤 Post'}
              </button>
            </div>
          </div>
        )}

        {/* Posts List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
            <p style={{ color: '#9aab87', fontSize: 13 }}>Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ fontSize: 40, marginBottom: 8 }}>💬</p>
            <p style={{ fontWeight: 600, color: '#3B6D11', fontSize: 15 }}>No posts yet</p>
            <p style={{ color: '#9aab87', fontSize: 13, marginTop: 4 }}>Be the first to ask!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {posts.map((post) => (
              <div key={post._id} style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2f0cc', boxShadow: '0 2px 12px #3B6D1108', overflow: 'hidden' }}>

                {/* Post Header */}
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontWeight: 700, color: '#27500a', fontSize: 15, margin: '0 0 8px' }}>{post.title}</h3>
                  <p style={{ fontSize: 13, color: '#5F5E5A', margin: 0, lineHeight: 1.5 }}>{post.content}</p>

                  {/* Author + Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTop: '1px solid #f0f7e6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#eaf3de', border: '1px solid #c0dd97', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                        {post.author?.role === 'farmer' ? '🧑‍🌾' : '🛒'}
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#27500a', margin: 0 }}>{post.author?.name || 'User'}</p>
                        <p style={{ fontSize: 11, color: '#9aab87', margin: 0 }}>{post.author?.location || ''}{post.author?.location ? ' · ' : ''}{timeAgo(post.createdAt)}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => handleUpvote(post._id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 8, border: '1px solid #c0dd97', background: '#f0f7e6', color: '#3B6D11', cursor: 'pointer' }}>
                        👍 {post.upvotes?.length || 0}
                      </button>
                      <button onClick={() => setExpandedPost(expandedPost === post._id ? null : post._id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 8, border: '1px solid #fac775', background: '#faeeda', color: '#854f0b', cursor: 'pointer' }}>
                        💬 {post.replies?.length || 0} {expandedPost === post._id ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {expandedPost === post._id && (
                  <div style={{ borderTop: '1px solid #f0f7e6', padding: '16px 20px 20px', background: '#fafdf6' }}>
                    {post.replies?.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                        {post.replies.map((reply, i) => (
                          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '10px 14px', border: '1px solid #e2f0cc' }}>
                            <p style={{ fontSize: 13, color: '#27500a', margin: 0 }}>{reply.content}</p>
                            <p style={{ fontSize: 11, color: '#9aab87', marginTop: 4 }}>{timeAgo(reply.createdAt)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input type="text" placeholder="Write a reply..."
                        style={{ ...inputStyle, flex: 1 }}
                        value={replyText[post._id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [post._id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleReply(post._id)} />
                      <button onClick={() => handleReply(post._id)}
                        style={{ padding: '10px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, color: '#fff', background: 'linear-gradient(135deg, #3B6D11, #639922)', whiteSpace: 'nowrap' }}>
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