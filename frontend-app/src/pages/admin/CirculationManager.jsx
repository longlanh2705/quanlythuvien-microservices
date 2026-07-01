import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, RotateCcw, AlertTriangle, Clock, Plus, X } from 'lucide-react';
import { getLoans, approveLoan, returnBook, extendLoan, createDirectLoan } from '../../services/circulationService';

const CirculationManager = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, PENDING, BORROWED, OVERDUE

  // Direct Loan Modal States
  const [showDirectLoanModal, setShowDirectLoanModal] = useState(false);
  const [directLoanData, setDirectLoanData] = useState({ userId: '', userName: '', bookId: '', bookTitle: '' });

  // Return Modal States
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedReturnLoan, setSelectedReturnLoan] = useState(null);
  const [returnFormData, setReturnFormData] = useState({ damageFee: '', damageNote: '' });

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const data = await getLoans();
      setLoans(data.data || []);
    } catch (err) {
      alert('Lỗi tải danh sách mượn trả: ' + (err.message || ''));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleApprove = async (id) => {
    if (window.confirm('Xác nhận cho mượn sách này?')) {
      try {
        await approveLoan(id);
        alert('Đã duyệt thành công!');
        fetchLoans();
      } catch (err) {
        alert('Lỗi duyệt: ' + (err.message || ''));
      }
    }
  };

  const openReturnModal = (loan) => {
    setSelectedReturnLoan(loan);
    setReturnFormData({ damageFee: '', damageNote: '' });
    setShowReturnModal(true);
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        damageFee: returnFormData.damageFee ? parseInt(returnFormData.damageFee) : 0,
        damageNote: returnFormData.damageNote
      };
      const res = await returnBook(selectedReturnLoan.id, data);
      if (res.data && res.data.fineAmount > 0) {
        alert(`Đã nhận trả sách. Phát sinh phạt: ${res.data.fineAmount.toLocaleString()} VNĐ!`);
      } else {
        alert('Đã nhận trả sách an toàn!');
      }
      setShowReturnModal(false);
      fetchLoans();
    } catch (err) {
      alert('Lỗi trả sách: ' + (err.message || ''));
    }
  };

  const handleExtend = async (id) => {
    if (window.confirm('Xác nhận gia hạn sách này thêm 14 ngày?')) {
      try {
        await extendLoan(id);
        alert('Đã gia hạn thành công!');
        fetchLoans();
      } catch (err) {
        alert('Lỗi gia hạn: ' + (err.message || ''));
      }
    }
  };

  const handleCreateDirectLoan = async (e) => {
    e.preventDefault();
    try {
      await createDirectLoan(directLoanData);
      alert('Tạo phiếu mượn thành công!');
      setShowDirectLoanModal(false);
      setDirectLoanData({ userId: '', userName: '', bookId: '', bookTitle: '' });
      fetchLoans();
      setActiveTab('BORROWED');
    } catch (err) {
      alert('Lỗi tạo phiếu mượn: ' + (err.message || ''));
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getFilteredLoans = () => {
    if (activeTab === 'ALL') return loans;
    if (activeTab === 'PENDING') return loans.filter(l => l.status === 'PENDING');
    if (activeTab === 'BORROWED') return loans.filter(l => l.status === 'BORROWED' && !isOverdue(l.dueDate));
    if (activeTab === 'OVERDUE') return loans.filter(l => l.status === 'BORROWED' && isOverdue(l.dueDate));
    return loans;
  };

  const filteredLoans = getFilteredLoans();

  const getStatusBadge = (loan) => {
    if (loan.status === 'PENDING') return <span style={{ padding: '4px 8px', background: 'rgba(234, 179, 8, 0.2)', color: 'var(--accent-yellow)', borderRadius: '4px' }}>Chờ duyệt</span>;
    if (loan.status === 'RETURNED') return <span style={{ padding: '4px 8px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-green)', borderRadius: '4px' }}>Đã trả</span>;
    if (loan.status === 'BORROWED') {
      if (isOverdue(loan.dueDate)) {
        return <span style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-red)', borderRadius: '4px' }}><AlertTriangle size={14} style={{display:'inline', marginBottom:'-2px'}}/> Quá hạn</span>;
      }
      return <span style={{ padding: '4px 8px', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)', borderRadius: '4px' }}>Đang mượn</span>;
    }
    return <span>{loan.status}</span>;
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Quản lý Mượn / Trả Sách</h1>
        <button className="btn btn-primary" onClick={() => setShowDirectLoanModal(true)}>
          <Plus size={18} /> Tạo phiếu mượn (Tại quầy)
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className={`btn ${activeTab === 'ALL' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('ALL')}>Tất cả</button>
        <button className={`btn ${activeTab === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('PENDING')}>Chờ duyệt (Online)</button>
        <button className={`btn ${activeTab === 'BORROWED' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('BORROWED')}>Đang mượn</button>
        <button className={`btn ${activeTab === 'OVERDUE' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('OVERDUE')}>Quá hạn</button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--glass-border)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Sinh Viên</th>
              <th style={{ padding: '1rem' }}>Sách Mượn</th>
              <th style={{ padding: '1rem' }}>Ngày Mượn</th>
              <th style={{ padding: '1rem' }}>Hạn Trả</th>
              <th style={{ padding: '1rem' }}>Trạng Thái</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</td></tr>
            ) : filteredLoans.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Chưa có giao dịch nào trong mục này</td></tr>
            ) : (
              filteredLoans.map((loan) => (
                <tr key={loan.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="table-row-hover">
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '500' }}>{loan.userName}</div>
                    <small style={{ color: 'var(--text-muted)' }}>{loan.userId}</small>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ color: 'var(--accent-purple)' }}>{loan.bookTitle}</div>
                    <small style={{ color: 'var(--text-muted)' }}>{loan.bookId}</small>
                  </td>
                  <td style={{ padding: '1rem' }}>{loan.borrowDate ? new Date(loan.borrowDate).toLocaleDateString('vi-VN') : '-'}</td>
                  <td style={{ padding: '1rem', color: isOverdue(loan.dueDate) && loan.status === 'BORROWED' ? 'var(--accent-red)' : 'inherit' }}>
                    {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td style={{ padding: '1rem' }}>{getStatusBadge(loan)}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    {loan.status === 'PENDING' && (
                      <button onClick={() => handleApprove(loan.id)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                        <CheckCircle size={16} /> Duyệt mượn
                      </button>
                    )}
                    {loan.status === 'BORROWED' && (
                      <>
                        <button onClick={() => handleExtend(loan.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                          <Clock size={16} /> Gia hạn
                        </button>
                        <button onClick={() => openReturnModal(loan)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', color: 'var(--accent-green)' }}>
                          <RotateCcw size={16} /> Nhận trả
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showDirectLoanModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '500px', maxWidth: '90%', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowDirectLoanModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
            <h2 style={{ marginBottom: '1.5rem' }}>Tạo Phiếu Mượn Trực Tiếp</h2>
            <form onSubmit={handleCreateDirectLoan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Mã Độc Giả *</label>
                  <input required type="text" value={directLoanData.userId} onChange={e => setDirectLoanData({ ...directLoanData, userId: e.target.value })} className="input-field" placeholder="VD: SV2021001" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Tên Sinh Viên *</label>
                  <input required type="text" value={directLoanData.userName} onChange={e => setDirectLoanData({ ...directLoanData, userName: e.target.value })} className="input-field" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Mã Sách (ISBN) *</label>
                  <input required type="text" value={directLoanData.bookId} onChange={e => setDirectLoanData({ ...directLoanData, bookId: e.target.value })} className="input-field" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Tên Sách *</label>
                  <input required type="text" value={directLoanData.bookTitle} onChange={e => setDirectLoanData({ ...directLoanData, bookTitle: e.target.value })} className="input-field" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowDirectLoanModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">Tạo Phiếu (Cho mượn ngay)</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReturnModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '400px', maxWidth: '90%', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowReturnModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
            <h2 style={{ marginBottom: '1.5rem' }}>Nhận Trả Sách</h2>
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Thu hồi sách: <strong>{selectedReturnLoan?.bookTitle}</strong><br/>
              Từ sinh viên: <strong>{selectedReturnLoan?.userName}</strong>
            </p>
            {isOverdue(selectedReturnLoan?.dueDate) && (
               <div style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-red)', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                 <AlertTriangle size={14} style={{ display: 'inline', marginBottom: '-2px' }} /> Sinh viên này đã trả sách trễ hạn! Hệ thống sẽ tự động tính tiền phạt.
               </div>
            )}
            <form onSubmit={handleReturnSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phí phạt Hư hỏng / Mất sách (VNĐ)</label>
                <input type="number" min="0" value={returnFormData.damageFee} onChange={e => setReturnFormData({ ...returnFormData, damageFee: e.target.value })} className="input-field" placeholder="Bỏ trống nếu sách nguyên vẹn" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Ghi chú tình trạng (Nếu có phạt)</label>
                <input type="text" value={returnFormData.damageNote} onChange={e => setReturnFormData({ ...returnFormData, damageNote: e.target.value })} className="input-field" placeholder="VD: Rách bìa, Mất sách..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowReturnModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'var(--accent-green)' }}><RotateCcw size={16} style={{display:'inline', marginBottom:'-2px'}}/> Nhận sách</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CirculationManager;
