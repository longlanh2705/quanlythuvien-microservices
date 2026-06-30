import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Type, AlertCircle, UserPlus, BookOpen, Loader, Eye, EyeOff } from 'lucide-react';

// ── Quy tắc validation (khớp với backend) ─────────────────────────────────────
const RULES = {
  username: {
    min: 3, max: 30,
    pattern: /^[a-zA-Z0-9_-]+$/,
    hint: 'Chỉ được dùng chữ cái, số, dấu _ hoặc -',
  },
  fullName: {
    min: 2, max: 100,
    pattern: /^[\p{L}\s'-]+$/u,
    hint: 'Chỉ được dùng chữ cái và khoảng trắng',
  },
  password: { min: 6, max: 128 },
};

const validateField = (name, value) => {
  const v = value?.trim() ?? '';
  switch (name) {
    case 'fullName':
      if (!v) return 'Họ tên không được để trống.';
      if (v.length < RULES.fullName.min) return `Họ tên phải có ít nhất ${RULES.fullName.min} ký tự.`;
      if (v.length > RULES.fullName.max) return `Họ tên không được vượt quá ${RULES.fullName.max} ký tự.`;
      if (!RULES.fullName.pattern.test(v)) return RULES.fullName.hint;
      return '';
    case 'username':
      if (!v) return 'Tên đăng nhập không được để trống.';
      if (v.length < RULES.username.min) return `Tối thiểu ${RULES.username.min} ký tự.`;
      if (v.length > RULES.username.max) return `Tối đa ${RULES.username.max} ký tự.`;
      if (!RULES.username.pattern.test(v)) return RULES.username.hint;
      return '';
    case 'password':
      if (!value) return 'Mật khẩu không được để trống.';
      if (value.length < RULES.password.min) return `Tối thiểu ${RULES.password.min} ký tự.`;
      if (value.length > RULES.password.max) return `Tối đa ${RULES.password.max} ký tự.`;
      return '';
    default:
      return '';
  }
};

const passwordStrength = (pw) => {
  if (!pw) return null;
  if (pw.length < 6)  return { pct: 25, color: '#ef4444', label: 'Quá ngắn' };
  if (pw.length < 8)  return { pct: 50, color: '#f59e0b', label: 'Yếu' };
  if (pw.length < 12) return { pct: 75, color: '#3b82f6', label: 'Trung bình' };
  return               { pct: 100, color: '#10b981', label: 'Mạnh' };
};

export default function Register() {
  const [form, setForm] = useState({ fullName: '', username: '', password: '', confirm: '' });
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [showPw, setShowPw]     = useState(false);
  const [showCfm, setShowCfm]   = useState(false);
  const [serverErr, setServerErr] = useState('');
  const [loading, setLoading]   = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();

  // Cập nhật field + validate realtime
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));

    if (touched[name]) {
      const err = name === 'confirm'
        ? (value !== form.password ? 'Mật khẩu xác nhận không khớp.' : '')
        : validateField(name, value);
      setErrors(ev => ({ ...ev, [name]: err }));
    }
  };

  // Đánh dấu đã chạm vào field → hiện lỗi
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
    const err = name === 'confirm'
      ? (value !== form.password ? 'Mật khẩu xác nhận không khớp.' : '')
      : validateField(name, value);
    setErrors(ev => ({ ...ev, [name]: err }));
  };

  const isFormValid = () => {
    const fields = ['fullName', 'username', 'password', 'confirm'];
    return fields.every(k => {
      if (k === 'confirm') return form.confirm === form.password && form.confirm !== '';
      return !validateField(k, form[k]);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErr('');

    // Validate tất cả trước khi submit
    const newErrors = {
      fullName: validateField('fullName', form.fullName),
      username: validateField('username', form.username),
      password: validateField('password', form.password),
      confirm:  form.confirm !== form.password ? 'Mật khẩu xác nhận không khớp.' : '',
    };
    setErrors(newErrors);
    setTouched({ fullName: true, username: true, password: true, confirm: true });

    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    const result = await register(form.username.trim(), form.password, form.fullName.trim());
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setServerErr(result.message);
    }
  };

  const strength = passwordStrength(form.password);

  // Helper render field
  const Field = ({ id, name, type = 'text', placeholder, icon: Icon, extra }) => (
    <div>
      <div style={{ position: 'relative' }}>
        <Icon size={16} style={{
          position: 'absolute', left: '0.9rem', top: '50%',
          transform: 'translateY(-50%)', color: errors[name] && touched[name] ? '#f87171' : 'var(--text-muted)',
          zIndex: 1,
        }} />
        <input
          id={id} name={name} type={type} placeholder={placeholder}
          className="input-field"
          value={form[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={RULES[name]?.max || 200}
          style={{
            paddingLeft: '2.5rem',
            paddingRight: extra ? '3rem' : undefined,
            borderColor: errors[name] && touched[name] ? 'rgba(239,68,68,0.6)' : undefined,
          }}
        />
        {extra}
      </div>
      {errors[name] && touched[name] && (
        <p style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <AlertCircle size={12} /> {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: '1rem', position: 'relative', overflow: 'hidden',
    }}>
      {/* BG orbs */}
      <div style={{ position: 'absolute', top: '-200px', right: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-150px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem', boxShadow: '0 0 30px rgba(59,130,246,0.4)',
          }}>
            <BookOpen size={30} color="white" />
          </div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>Tạo Tài Khoản</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tham gia Hệ Thống Thư Viện</p>
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

          {/* Họ tên */}
          <Field id="reg-fullname" name="fullName" placeholder="Họ và tên đầy đủ" icon={Type} />

          {/* Username */}
          <div>
            <Field id="reg-username" name="username" placeholder="Mã sinh viên (VD: SV2021001)" icon={User} />
            {!errors.username && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Chỉ dùng chữ cái, số, dấu _ hoặc - (3–30 ký tự)
              </p>
            )}
          </div>

          {/* Mật khẩu */}
          <div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute', left: '0.9rem', top: '50%',
                transform: 'translateY(-50%)', color: errors.password && touched.password ? '#f87171' : 'var(--text-muted)',
              }} />
              <input
                id="reg-password" name="password" type={showPw ? 'text' : 'password'}
                placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                className="input-field"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={128}
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
            {/* Strength bar */}
            {strength && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '2px', width: `${strength.pct}%`, background: strength.color, transition: 'width 0.3s, background 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: strength.color, fontWeight: '600', minWidth: '65px' }}>{strength.label}</span>
              </div>
            )}
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute', left: '0.9rem', top: '50%',
                transform: 'translateY(-50%)', color: errors.confirm && touched.confirm ? '#f87171' : 'var(--text-muted)',
              }} />
              <input
                id="reg-confirm" name="confirm" type={showCfm ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu"
                className="input-field"
                value={form.confirm}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={128}
                style={{ paddingLeft: '2.5rem', paddingRight: '3rem', borderColor: errors.confirm && touched.confirm ? 'rgba(239,68,68,0.6)' : undefined }}
              />
              <button type="button" onClick={() => setShowCfm(s => !s)}
                style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                {showCfm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirm && touched.confirm && (
              <p style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertCircle size={12} /> {errors.confirm}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            id="register-submit" type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem', opacity: loading ? 0.75 : 1 }}
          >
            {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <UserPlus size={18} />}
            {loading ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>Đăng nhập</Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { from { transform:rotate(0deg); }              to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}