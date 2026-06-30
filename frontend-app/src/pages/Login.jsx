import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, AlertCircle, LogIn, BookOpen, Loader, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [errors, setErrors]       = useState({ username: '', password: '' });
  const [touched, setTouched]     = useState({ username: false, password: false });
  const [serverErr, setServerErr] = useState('');
  const [loading, setLoading]     = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const validate = (field, value) => {
    if (field === 'username') return !value.trim() ? 'Tên đăng nhập không được để trống.' : '';
    if (field === 'password') return !value       ? 'Mật khẩu không được để trống.'      : '';
    return '';
  };

  const handleChange = (field, value) => {
    field === 'username' ? setUsername(value) : setPassword(value);
    if (touched[field]) setErrors(e => ({ ...e, [field]: validate(field, value) }));
  };

  const handleBlur = (field, value) => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(e => ({ ...e, [field]: validate(field, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErr('');

    const uErr = validate('username', username);
    const pErr = validate('password', password);
    setErrors({ username: uErr, password: pErr });
    setTouched({ username: true, password: true });
    if (uErr || pErr) return;

    setLoading(true);
    const result = await login(username.trim(), password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setServerErr(result.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: '1rem', position: 'relative', overflow: 'hidden',
    }}>
      {/* BG orbs */}
      <div style={{ position: 'absolute', top: '-150px', left: '-150px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-150px', right: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem', boxShadow: '0 0 30px rgba(139,92,246,0.4)',
          }}>
            <BookOpen size={30} color="white" />
          </div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>Chào mừng trở lại</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Đăng nhập vào Hệ Thống Thư Viện</p>
        </div>

        {/* Server error */}
        {serverErr && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem',
            fontSize: '0.9rem', animation: 'fadeIn 0.2s ease-in-out',
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            {serverErr}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Username */}
          <div>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{
                position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                color: errors.username && touched.username ? '#f87171' : 'var(--text-muted)',
              }} />
              <input
                id="login-username" type="text" placeholder="Tên đăng nhập"
                className="input-field"
                value={username}
                onChange={e => handleChange('username', e.target.value)}
                onBlur={e  => handleBlur('username', e.target.value)}
                maxLength={100}
                style={{ paddingLeft: '2.5rem', borderColor: errors.username && touched.username ? 'rgba(239,68,68,0.6)' : undefined }}
              />
            </div>
            {errors.username && touched.username && (
              <p style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertCircle size={12} /> {errors.username}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                color: errors.password && touched.password ? '#f87171' : 'var(--text-muted)',
              }} />
              <input
                id="login-password" type={showPw ? 'text' : 'password'} placeholder="Mật khẩu"
                className="input-field"
                value={password}
                onChange={e => handleChange('password', e.target.value)}
                onBlur={e  => handleBlur('password', e.target.value)}
                maxLength={256}
                style={{ paddingLeft: '2.5rem', paddingRight: '3rem', borderColor: errors.password && touched.password ? 'rgba(239,68,68,0.6)' : undefined }}
              />
              <button type="button" onClick={() => setShowPw(s => !s)}
                style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && touched.password && (
              <p style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertCircle size={12} /> {errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            id="login-submit" type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem', opacity: loading ? 0.75 : 1 }}
          >
            {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <LogIn size={18} />}
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: 'var(--accent-purple)', fontWeight: '600' }}>Đăng ký ngay</Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { from { transform:rotate(0deg); }              to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}