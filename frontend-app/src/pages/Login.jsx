import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Lock, User as UserIcon } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      if (result.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message || 'Tài khoản hoặc mật khẩu không đúng');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <BookOpen size={48} className="text-accent-blue" style={{ margin: '0 auto', marginBottom: '1rem', color: 'var(--accent-blue)' }} />
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Đăng nhập</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Hệ thống Quản lý Thư viện</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Mã Sinh Viên / Tên đăng nhập</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Ví dụ: SV2021001 hoặc admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <UserIcon size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div style={{ marginBottom: '2rem', position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="input-field"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}>
            Đăng nhập hệ thống
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
