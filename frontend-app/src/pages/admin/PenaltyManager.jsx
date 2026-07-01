import React, { useState, useEffect } from 'react';
import { Search, DollarSign, CheckCircle } from 'lucide-react';
import { getPenalties, payPenalty } from '../../services/penaltyService';

const PenaltyManager = () => {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPenalties = async () => {
    setLoading(true);
    try {
      const data = await getPenalties();
      setPenalties(data.data || []);
    } catch (err) {
      alert('Lỗi tải danh sách vi phạm: ' + (err.message || ''));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPenalties();
  }, []);

  const handlePay = async (id) => {
    if (window.confirm('Xác nhận đã thu khoản tiền phạt này?')) {
      try {
        await payPenalty(id);
        alert('Thu tiền thành công!');
        fetchPenalties();
      } catch (err) {
        alert('Lỗi thu tiền: ' + (err.message || ''));
      }
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Quản lý Vi phạm & Phí phạt</h1>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Tìm kiếm sinh viên..." 
            className="input-field"
            style={{ paddingLeft: '2.5rem', width: '300px' }}
          />
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--glass-border)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Sinh Viên</th>
              <th style={{ padding: '1rem' }}>Lý Do Vi Phạm</th>
              <th style={{ padding: '1rem' }}>Số Tiền Phạt</th>
              <th style={{ padding: '1rem' }}>Ngày Ghi Nhận</th>
              <th style={{ padding: '1rem' }}>Trạng Thái</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</td></tr>
            ) : penalties.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Chưa có bản ghi vi phạm nào</td></tr>
            ) : (
              penalties.map((penalty) => (
                <tr key={penalty.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="table-row-hover">
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '500' }}>{penalty.userName}</div>
                    <small style={{ color: 'var(--text-muted)' }}>{penalty.userId}</small>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--accent-red)' }}>{penalty.reason}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{penalty.amount.toLocaleString()} đ</td>
                  <td style={{ padding: '1rem' }}>{new Date(penalty.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td style={{ padding: '1rem' }}>
                    {penalty.status === 'UNPAID' ? (
                      <span style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-red)', borderRadius: '4px' }}>Chưa thu</span>
                    ) : (
                      <span style={{ padding: '4px 8px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-green)', borderRadius: '4px' }}>Đã thu ({new Date(penalty.paidAt).toLocaleDateString()})</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {penalty.status === 'UNPAID' && (
                      <button onClick={() => handlePay(penalty.id)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                        <DollarSign size={16} style={{ display: 'inline', marginBottom: '-2px' }} /> Thu tiền
                      </button>
                    )}
                    {penalty.status === 'PAID' && (
                      <CheckCircle size={20} color="var(--accent-green)" />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PenaltyManager;
