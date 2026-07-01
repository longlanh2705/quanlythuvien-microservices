import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getLoans } from '../../services/circulationService';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserLoans = async () => {
      try {
        const res = await getLoans();
        // Lọc phiếu mượn của user hiện tại
        const myLoans = res.data.filter(loan => loan.userId === user.username);
        setLoans(myLoans);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchUserLoans();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'PENDING': return <span style={{ color: 'var(--accent-yellow)' }}>Đang chờ duyệt</span>;
      case 'BORROWED': return <span style={{ color: 'var(--accent-blue)' }}>Đang mượn</span>;
      case 'RETURNED': return <span style={{ color: 'var(--accent-green)' }}>Đã trả</span>;
      default: return status;
    }
  };

  if (!user) return null;

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Tài khoản của tôi</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Cột thông tin cá nhân */}
        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
          <h3>Thông tin cá nhân</h3>
          <div style={{ marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '1rem' }}><strong>Mã Độc Giả:</strong> {user.username}</p>
            <p style={{ marginBottom: '1rem' }}><strong>Họ Tên:</strong> {user.fullName || 'Chưa cập nhật'}</p>
            <p style={{ marginBottom: '1rem' }}><strong>Phân quyền:</strong> {user.role === 'ADMIN' ? 'Quản trị viên' : 'Sinh viên'}</p>
            
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {user.role === 'ADMIN' && (
                <button onClick={() => navigate('/admin')} className="btn btn-primary" style={{ width: '100%' }}>
                  Vào trang Admin
                </button>
              )}
              <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%' }}>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Cột lịch sử mượn trả */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3>Lịch sử Mượn / Trả Sách</h3>
          <div style={{ marginTop: '1.5rem' }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải...</p>
            ) : loans.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                Bạn chưa mượn cuốn sách nào.
              </p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <tr>
                    <th style={{ padding: '1rem' }}>Tên Sách</th>
                    <th style={{ padding: '1rem' }}>Trạng Thái</th>
                    <th style={{ padding: '1rem' }}>Hạn Trả</th>
                    <th style={{ padding: '1rem' }}>Tiền Phạt</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map(loan => (
                    <tr key={loan.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', fontWeight: '500', color: 'var(--accent-purple)' }}>{loan.bookTitle}</td>
                      <td style={{ padding: '1rem' }}>{getStatusText(loan.status)}</td>
                      <td style={{ padding: '1rem' }}>{loan.dueDate ? new Date(loan.dueDate).toLocaleDateString('vi-VN') : '-'}</td>
                      <td style={{ padding: '1rem', color: loan.fineAmount > 0 ? 'var(--accent-red)' : 'inherit' }}>
                        {loan.fineAmount > 0 ? `${loan.fineAmount} VNĐ` : '0 VNĐ'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default UserDashboard;
