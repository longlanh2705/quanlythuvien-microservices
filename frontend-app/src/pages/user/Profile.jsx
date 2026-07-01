import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import { User, Award, Shield, Save } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users/${user.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ fullName })
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage('Cập nhật thông tin thành công!');
        // Update user data in local storage
        const updatedUser = { ...user, fullName };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setError(data.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      setError('Lỗi kết nối tới máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Hồ sơ độc giả</h1>
      
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            👤
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{user?.fullName || 'Độc giả'}</h2>
            <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Mã: {user?.username}</p>
          </div>
        </div>

        {message && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', textAlign: 'center' }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Mã Độc Giả (Tên đăng nhập)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="input-field" 
                value={user?.username || ''} 
                disabled 
                style={{ paddingLeft: '2.5rem', opacity: 0.6, cursor: 'not-allowed' }}
              />
              <User size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Họ và tên</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="input-field" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <Award size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Vai trò tài khoản</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="input-field" 
                value={user?.role === 'ADMIN' ? 'Quản Trị Viên' : 'Sinh viên / Độc giả'} 
                disabled 
                style={{ paddingLeft: '2.5rem', opacity: 0.6, cursor: 'not-allowed' }}
              />
              <Shield size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')} 
              className="btn btn-secondary" 
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Xem lịch sử mượn
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ flex: 1, justifyContent: 'center', gap: '0.5rem' }}
              disabled={loading}
            >
              <Save size={18} />
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
