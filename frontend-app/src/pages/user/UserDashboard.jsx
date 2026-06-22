import React from 'react';

const UserDashboard = () => {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Tài khoản của tôi</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3>Thông tin cá nhân</h3>
          <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            <p>Tên: Người dùng Khách</p>
            <p>Hạng thẻ: Thành viên Bạc</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Chuyển sang trang Admin</button>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3>Sách đang mượn</h3>
          <div style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
            Bạn chưa mượn cuốn sách nào.
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
