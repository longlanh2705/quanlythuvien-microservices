import React, { useState, useEffect } from 'react';
import { Search, UserX, UserCheck, Edit2, CheckCircle, History, X } from 'lucide-react';
import { getUsers, toggleLockUser, approveUser, updateUser } from '../../services/userService';
import { getLoansByUser } from '../../services/circulationService';

const StudentManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ fullName: '' });
  const [loanHistory, setLoanHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data || []);
    } catch (err) {
      alert('Lỗi tải danh sách người dùng');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleLock = async (id) => {
    if (window.confirm('Bạn có chắc muốn đổi trạng thái tài khoản này?')) {
      try {
        await toggleLockUser(id);
        alert('Cập nhật trạng thái thành công!');
        fetchUsers();
      } catch (err) {
        alert('Lỗi cập nhật');
      }
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Duyệt cấp thẻ cho sinh viên này?')) {
      try {
        await approveUser(id);
        alert('Đã duyệt thành công!');
        fetchUsers();
      } catch (err) {
        alert('Lỗi duyệt: ' + err.message);
      }
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditFormData({ fullName: user.fullName || '' });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(selectedUser.id, editFormData);
      alert('Cập nhật thông tin thành công!');
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      alert('Lỗi cập nhật: ' + err.message);
    }
  };

  const openHistoryModal = async (user) => {
    setSelectedUser(user);
    setShowHistoryModal(true);
    setLoadingHistory(true);
    try {
      const res = await getLoansByUser(user.id);
      setLoanHistory(res.data || []);
    } catch (err) {
      alert('Lỗi tải lịch sử: ' + err.message);
    }
    setLoadingHistory(false);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'ACTIVE': return <span style={{ padding: '4px 8px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-green)', borderRadius: '4px' }}>Hoạt động</span>;
      case 'LOCKED': return <span style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-red)', borderRadius: '4px' }}>Đã khóa</span>;
      case 'PENDING': return <span style={{ padding: '4px 8px', background: 'rgba(234, 179, 8, 0.2)', color: 'var(--accent-yellow)', borderRadius: '4px' }}>Chờ duyệt</span>;
      default: return <span>{status || 'ACTIVE'}</span>;
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Quản lý Độc giả</h1>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Tìm kiếm tài khoản..." 
            className="input-field"
            style={{ paddingLeft: '2.5rem', width: '300px' }}
          />
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--glass-border)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Mã Độc Giả</th>
              <th style={{ padding: '1rem' }}>Họ Tên</th>
              <th style={{ padding: '1rem' }}>Trạng Thái</th>
              <th style={{ padding: '1rem' }}>Ngày Tham Gia</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</td></tr>
            ) : (
              users.filter(u => u.role !== 'ADMIN').map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--glass-border)' }} className="table-row-hover">
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{user.username}</td>
                  <td style={{ padding: '1rem' }}>{user.fullName || 'Chưa cập nhật'}</td>
                  <td style={{ padding: '1rem' }}>{getStatusBadge(user.status)}</td>
                  <td style={{ padding: '1rem' }}>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    {user.status === 'PENDING' && (
                      <button onClick={() => handleApprove(user.id)} className="btn btn-primary" style={{ padding: '0.4rem 0.6rem', fontSize: '0.9rem' }}>
                        <CheckCircle size={16} /> Duyệt
                      </button>
                    )}
                    <button onClick={() => openEditModal(user)} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', fontSize: '0.9rem' }}>
                      <Edit2 size={16} /> Sửa
                    </button>
                    <button onClick={() => openHistoryModal(user)} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', fontSize: '0.9rem' }}>
                      <History size={16} /> Lịch sử
                    </button>
                    <button onClick={() => handleToggleLock(user.id)} className="btn" style={{ padding: '0.4rem 0.6rem', fontSize: '0.9rem', background: 'transparent', color: user.status === 'LOCKED' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                      {user.status === 'LOCKED' ? <UserCheck size={16} /> : <UserX size={16} />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showEditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '400px', maxWidth: '90%', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowEditModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
            <h2 style={{ marginBottom: '1.5rem' }}>Cập nhật thông tin</h2>
            <form onSubmit={handleUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Họ tên sinh viên</label>
                <input required type="text" value={editFormData.fullName} onChange={e => setEditFormData({ fullName: e.target.value })} className="input-field" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '800px', maxWidth: '95%', maxHeight: '90vh', padding: '2rem', position: 'relative', overflowY: 'auto' }}>
            <button onClick={() => setShowHistoryModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
            <h2 style={{ marginBottom: '1.5rem' }}>Lịch sử mượn trả: {selectedUser?.fullName || selectedUser?.username}</h2>
            
            {loadingHistory ? (
              <p>Đang tải lịch sử...</p>
            ) : loanHistory.length === 0 ? (
              <p>Sinh viên này chưa mượn sách nào.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--glass-border)' }}>
                  <tr>
                    <th style={{ padding: '0.8rem' }}>Tên Sách</th>
                    <th style={{ padding: '0.8rem' }}>Ngày Mượn</th>
                    <th style={{ padding: '0.8rem' }}>Hạn Trả</th>
                    <th style={{ padding: '0.8rem' }}>Ngày Trả</th>
                    <th style={{ padding: '0.8rem' }}>Trạng Thái</th>
                    <th style={{ padding: '0.8rem' }}>Tiền Phạt</th>
                  </tr>
                </thead>
                <tbody>
                  {loanHistory.map(loan => (
                    <tr key={loan.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '0.8rem', color: 'var(--accent-purple)' }}>{loan.bookTitle}</td>
                      <td style={{ padding: '0.8rem' }}>{loan.borrowDate ? new Date(loan.borrowDate).toLocaleDateString('vi-VN') : '-'}</td>
                      <td style={{ padding: '0.8rem' }}>{loan.dueDate ? new Date(loan.dueDate).toLocaleDateString('vi-VN') : '-'}</td>
                      <td style={{ padding: '0.8rem' }}>{loan.returnDate ? new Date(loan.returnDate).toLocaleDateString('vi-VN') : '-'}</td>
                      <td style={{ padding: '0.8rem' }}>
                        {loan.status === 'PENDING' && 'Đang chờ'}
                        {loan.status === 'BORROWED' && <span style={{ color: 'var(--accent-blue)' }}>Đang mượn</span>}
                        {loan.status === 'RETURNED' && <span style={{ color: 'var(--accent-green)' }}>Đã trả</span>}
                      </td>
                      <td style={{ padding: '0.8rem', color: loan.fineAmount > 0 ? 'var(--accent-red)' : 'inherit' }}>
                        {loan.fineAmount > 0 ? `${loan.fineAmount} đ` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManager;
