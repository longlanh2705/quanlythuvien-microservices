import React from 'react';
import { Book, Users, ArrowRightLeft, AlertTriangle } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="glass-panel hover-lift" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
    <div style={{ padding: '1rem', background: `rgba(${color}, 0.1)`, borderRadius: 'var(--radius-md)', color: `rgb(${color})` }}>
      {icon}
    </div>
    <div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{title}</p>
      <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</h3>
    </div>
  </div>
);

const AdminOverview = () => {
  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Tổng Quan Hệ Thống</h1>
        <button className="btn btn-primary">Xuất báo cáo</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard title="Tổng số Sách" value="1,245" icon={<Book size={28} />} color="59, 130, 246" />
        <StatCard title="Độc giả Đăng ký" value="850" icon={<Users size={28} />} color="139, 92, 246" />
        <StatCard title="Đang Mượn" value="320" icon={<ArrowRightLeft size={28} />} color="16, 185, 129" />
        <StatCard title="Quá hạn" value="15" icon={<AlertTriangle size={28} />} color="239, 68, 68" />
      </div>

      <div className="glass-panel" style={{ padding: '2rem', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>[Biểu đồ thống kê sẽ hiển thị ở đây]</p>
      </div>
    </div>
  );
};

export default AdminOverview;
