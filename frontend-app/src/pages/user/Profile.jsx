import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User, Shield, BookOpen, Clock, Calendar, AlertTriangle,
  CheckCircle, Edit2, Save, X, Loader, BarChart3,
} from 'lucide-react';
import Pagination from '../../components/Pagination';

// Skeleton row cho bảng history
const SkeletonRow = () => (
  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
    {[80, 60, 60, 40].map((w, i) => (
      <td key={i} style={{ padding: '1rem' }}>
        <div style={{
          height: '0.875rem', width: `${w}%`, borderRadius: '4px',
          background: 'var(--bg-tertiary)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      </td>
    ))}
  </tr>
);

const getStatusStyle = (status) => {
  switch (status) {
    case 'BORROWED': return { color: '#60a5fa', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)',  text: 'Đang mượn', icon: <Clock size={13} /> };
    case 'RETURNED': return { color: '#6ee7b7', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', text: 'Đã trả',     icon: <CheckCircle size={13} /> };
    case 'OVERDUE':  return { color: '#fca5a5', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  text: 'Quá hạn',   icon: <AlertTriangle size={13} /> };
    default:         return { color: 'var(--text-secondary)', bg: 'rgba(0,0,0,0.1)', border: 'rgba(255,255,255,0.1)', text: status, icon: null };
  }
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="glass-panel" style={{
    padding: '1.25rem',
    display: 'flex', alignItems: 'center', gap: '1rem',
    borderLeft: `3px solid ${color}`,
  }}>
    <div style={{
      width: '44px', height: '44px', borderRadius: 'var(--radius-sm)',
      background: `${color}20`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {React.cloneElement(icon, { size: 22, color })}
    </div>
    <div>
      <div style={{ fontSize: '1.6rem', fontWeight: '700', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{label}</div>
    </div>
  </div>
);

const Profile = () => {
  const { user, logout } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [stats, setStats]             = useState({ BORROWED: 0, RETURNED: 0, OVERDUE: 0, total: 0 });
  const [historyData, setHistoryData] = useState([]);
  const [pagination, setPagination]   = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage]               = useState(1);
  const [loading, setLoading]         = useState(true);
  const [histLoading, setHistLoading] = useState(false);

  // Edit profile state
  const [editing, setEditing]           = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [saving, setSaving]             = useState(false);
  const [saveMsg, setSaveMsg]           = useState('');

  // --- Fetch profile + stats once ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');

        const [resProfile, resStats] = await Promise.all([
          fetch('http://localhost:5002/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5003/api/circulation/stats', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const dataProfile = await resProfile.json();
        if (dataProfile.success) setProfileData(dataProfile.data);

        const dataStats = await resStats.json();
        if (dataStats.success) setStats(dataStats.data);
      } catch (err) {
        console.error('Lỗi khi tải profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- Fetch history (paginated) ---
  const fetchHistory = useCallback(async () => {
    setHistLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`http://localhost:5003/api/circulation/history?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      if (data.success) {
        setHistoryData(data.data);
        setPagination(data.pagination || { page, totalPages: 1, total: data.data.length });
      }
    } catch (err) {
      console.error('Lỗi khi tải lịch sử:', err);
    } finally {
      setHistLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  // --- Save profile ---
  const handleSaveProfile = async () => {
    const trimmed = editFullName.trim();

    // Validate trên frontend (khớp với backend)
    if (!trimmed) {
      setSaveMsg('Họ tên không được để trống.');
      return;
    }
    if (trimmed.length < 2) {
      setSaveMsg('Họ tên phải có ít nhất 2 ký tự.');
      return;
    }
    if (trimmed.length > 100) {
      setSaveMsg('Họ tên không được vượt quá 100 ký tự.');
      return;
    }
    const namePattern = /^[\p{L}\s'-]+$/u;
    if (!namePattern.test(trimmed)) {
      setSaveMsg('Họ tên chỉ được chứa chữ cái và khoảng trắng.');
      return;
    }

    setSaving(true);
    setSaveMsg('');
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch('http://localhost:5002/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fullName: trimmed }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setProfileData(data.data.user);
        setSaveMsg('✓ Đã cập nhật thành công');
        setTimeout(() => { setEditing(false); setSaveMsg(''); }, 1500);
      } else {
        setSaveMsg(data.message || 'Cập nhật thất bại');
      }
    } catch {
      setSaveMsg('Lỗi kết nối máy chủ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '0.75rem', color: 'var(--text-muted)' }}>
        <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
        Đang tải hồ sơ...
      </div>
    );
  }

  const displayUser = profileData || user;
  const avatarChar  = displayUser?.fullName?.charAt(0) || displayUser?.username?.charAt(0) || 'U';

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <User size={28} color="var(--accent-blue)" /> Hồ Sơ Cá Nhân
        </h1>
        <button
          id="logout-btn"
          onClick={logout}
          className="btn"
          style={{ border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', background: 'rgba(239,68,68,0.08)' }}
        >
          Đăng xuất
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>

        {/* ---- Profile Card ---- */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>

            {/* Avatar */}
            <div style={{
              width: '96px', height: '96px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', fontWeight: '700',
              boxShadow: '0 0 30px rgba(139,92,246,0.4)',
            }}>
              {avatarChar}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              {!editing ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>{displayUser?.fullName}</h2>
                    <button
                      id="edit-profile-btn"
                      onClick={() => { setEditing(true); setEditFullName(displayUser?.fullName || ''); }}
                      className="btn"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', border: '1px solid var(--glass-border)', background: 'transparent' }}
                    >
                      <Edit2 size={13} /> Chỉnh sửa
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                      <User size={14} /> {displayUser?.username}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                      <Shield size={14} /> {displayUser?.role === 'ADMIN' ? 'Quản Trị Viên' : 'Sinh Viên'}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle size={14} /> Tài khoản hoạt động
                    </span>
                  </div>
                </>
              ) : (
                /* Edit form */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '360px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Họ và tên</label>
                  <input
                    id="edit-fullname-input"
                    type="text"
                    className="input-field"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    placeholder="Nhập họ tên mới..."
                    autoFocus
                  />
                  {saveMsg && (
                    <span style={{ fontSize: '0.85rem', color: saveMsg.startsWith('✓') ? 'var(--accent-green)' : '#fca5a5' }}>
                      {saveMsg}
                    </span>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      id="save-profile-btn"
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                      {saving ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
                      {saving ? 'Đang lưu...' : 'Lưu'}
                    </button>
                    <button
                      onClick={() => { setEditing(false); setSaveMsg(''); }}
                      className="btn"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', border: '1px solid var(--glass-border)', background: 'transparent' }}
                    >
                      <X size={14} /> Huỷ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---- Stats Cards ---- */}
        <div>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} /> Thống Kê Mượn Trả
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            <StatCard icon={<Clock />}          label="Đang mượn"  value={stats.BORROWED}  color="#60a5fa" />
            <StatCard icon={<CheckCircle />}    label="Đã trả"     value={stats.RETURNED}  color="#6ee7b7" />
            <StatCard icon={<AlertTriangle />}  label="Quá hạn"    value={stats.OVERDUE}   color="#fca5a5" />
            <StatCard icon={<BookOpen />}        label="Tổng phiếu" value={stats.total}     color="var(--accent-purple)" />
          </div>
        </div>

        {/* ---- History Table ---- */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen color="var(--accent-purple)" size={22} /> Lịch Sử Mượn Trả
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {['Tên Sách', 'Ngày Mượn', 'Hạn Trả', 'Trạng Thái'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {histLoading
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                  : historyData.map(item => {
                      const s = getStatusStyle(item.status);
                      return (
                        <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '1rem', fontWeight: '500' }}>
                            <div>{item.bookTitle}</div>
                            {item.bookAuthor && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{item.bookAuthor}</div>}
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Calendar size={13} />
                              {new Date(item.borrowDate).toLocaleDateString('vi-VN')}
                            </div>
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Calendar size={13} />
                              {new Date(item.dueDate).toLocaleDateString('vi-VN')}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                              background: s.bg, color: s.color,
                              border: `1px solid ${s.border}`,
                              padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)',
                              fontSize: '0.8rem', fontWeight: '600',
                            }}>
                              {s.icon} {s.text}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                }
                {!histLoading && historyData.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <BookOpen size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4, display: 'block' }} />
                      Bạn chưa có lịch sử mượn sách nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages || 1}
            onPageChange={setPage}
          />
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Profile;
