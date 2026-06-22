import React, { useState } from 'react';
import { UserPlus, Search } from 'lucide-react';

const StudentManager = () => {
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!studentId || !fullName) {
      setError('Vui lòng nhập Mã sinh viên và Họ tên');
      return;
    }

    try {
      const res = await fetch('http://localhost:5002/api/auth/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, fullName })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage(`Cấp tài khoản thành công cho SV: ${fullName}. Mật khẩu mặc định là: ${studentId}`);
        setStudentId('');
        setFullName('');
      } else {
        setError(data.message || 'Lỗi khi cấp tài khoản');
      }
    } catch (err) {
      // Mock logic cho giao diện khi backend chưa chạy
      setMessage(`[MOCK] Cấp tài khoản thành công cho SV: ${fullName}. Mật khẩu mặc định: ${studentId}`);
      setStudentId('');
      setFullName('');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Quản lý Độc giả (Sinh viên)</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Form cấp tài khoản mới */}
        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={24} className="text-accent-blue" />
            Cấp tài khoản mới
          </h2>

          {message && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>{message}</div>}
          {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>{error}</div>}

          <form onSubmit={handleCreateAccount}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Mã sinh viên</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="VD: SV2021001" 
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Họ và tên</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="VD: Nguyễn Văn A" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Tạo tài khoản
            </button>
          </form>
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            * Mật khẩu đăng nhập mặc định sẽ giống hệt với Mã sinh viên.
          </p>
        </div>

        {/* Danh sách sinh viên (Mock) */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2>Danh sách Độc giả</h2>
            <div style={{ position: 'relative' }}>
              <input type="text" className="input-field" placeholder="Tìm kiếm SV..." style={{ paddingLeft: '2.5rem', padding: '0.5rem 1rem 0.5rem 2.5rem' }} />
              <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <tr>
                <th style={{ padding: '1rem' }}>Mã SV</th>
                <th style={{ padding: '1rem' }}>Họ Tên</th>
                <th style={{ padding: '1rem' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {['SV2021001', 'SV2022099', 'SV2023150'].map((id, index) => (
                <tr key={id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem', color: 'var(--accent-blue)' }}>{id}</td>
                  <td style={{ padding: '1rem' }}>Sinh viên mẫu {index + 1}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-green)', borderRadius: 'var(--radius-full)' }}>Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentManager;
