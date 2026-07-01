import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getLoans, extendLoan } from '../../services/circulationService';
import { useNavigate } from 'react-router-dom';
import { Clock, RefreshCw } from 'lucide-react';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [actionError, setActionError] = useState('');

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

  useEffect(() => {
    if (user) fetchUserLoans();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExtend = async (loanId, dueDate) => {
    setActionMsg('');
    setActionError('');
    
    // Kiểm tra nếu sách đã quá hạn
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today) {
      setActionError('Sách đã quá hạn mượn, không thể tự gia hạn. Vui lòng liên hệ thủ thư!');
      return;
    }

    try {
      const res = await extendLoan(loanId);
      setActionMsg(res.message || 'Gia hạn thành công!');
      fetchUserLoans();
    } catch (err) {
      setActionError(err.message || 'Lỗi gia hạn sách');
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'PENDING': return <span style={{ color: 'var(--accent-yellow)', fontWeight: 'bold' }}>Đang chờ duyệt</span>;
      case 'BORROWED': return <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>Đang mượn</span>;
      case 'RETURNED': return <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>Đã trả</span>;
      case 'REJECTED': return <span style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>Từ chối</span>;
      default: return status;
    }
  };

  if (!user) return null;

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Tài khoản của tôi</h1>

      {actionMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          {actionMsg}
        </div>
      )}

      {actionError && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          {actionError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Cột thông tin cá nhân */}
        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
          <h3>Thông tin cá nhân</h3>
          <div style={{ marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '1rem' }}><strong>Mã Độc Giả:</strong> {user.username}</p>
            <p style={{ marginBottom: '1rem' }}><strong>Họ Tên:</strong> {user.fullName || 'Chưa cập nhật'}</p>
            <p style={{ marginBottom: '1rem' }}><strong>Phân quyền:</strong> {user.role === 'ADMIN' ? 'Quản trị viên' : 'Sinh viên'}</p>
            
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {user.role === 'ADMIN' && (
                <button onClick={() => navigate('/admin')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Vào trang Admin
                </button>
              )}
              <button onClick={() => navigate('/profile')} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Chỉnh sửa thông tin
              </button>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', color: 'var(--accent-red)' }}>
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
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <tr>
                      <th style={{ padding: '1rem' }}>Tên Sách</th>
                      <th style={{ padding: '1rem' }}>Trạng Thái</th>
                      <th style={{ padding: '1rem' }}>Hạn Trả</th>
                      <th style={{ padding: '1rem' }}>Tiền Phạt</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map(loan => {
                      const isBorrowed = loan.status === 'BORROWED';
                      return (
                        <tr key={loan.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '1rem', fontWeight: '500', color: 'var(--accent-purple)' }}>{loan.bookTitle}</td>
                          <td style={{ padding: '1rem' }}>{getStatusText(loan.status)}</td>
                          <td style={{ padding: '1rem' }}>{loan.dueDate ? new Date(loan.dueDate).toLocaleDateString('vi-VN') : '-'}</td>
                          <td style={{ padding: '1rem', color: loan.fineAmount > 0 ? 'var(--accent-red)' : 'inherit' }}>
                            {loan.fineAmount > 0 ? `${loan.fineAmount.toLocaleString()} VNĐ` : '0 VNĐ'}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            {isBorrowed && (
                              <button 
                                onClick={() => handleExtend(loan.id, loan.dueDate)}
                                className="btn btn-secondary" 
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', gap: '0.3rem' }}
                                title="Gia hạn thêm 7 ngày"
                              >
                                <RefreshCw size={12} /> Gia hạn
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default UserDashboard;
