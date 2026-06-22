import React from 'react';
import { useParams, Link } from 'react-router-dom';

const BookDetail = () => {
  const { id } = useParams();

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '2rem auto' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>&larr; Quay lại</Link>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ width: '250px', height: '350px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}></div>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Chi Tiết Sách (ID: {id})</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '1rem' }}>Tác giả: Đang cập nhật</p>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ padding: '0.4rem 1rem', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)', borderRadius: 'var(--radius-full)' }}>
              Còn hàng
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
            Mô tả nội dung sách sẽ được hiển thị ở đây. Hiện tại đang sử dụng dữ liệu giả lập cho giao diện người dùng.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>Mượn Sách</button>
            <button className="btn btn-secondary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>Thêm vào danh sách yêu thích</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
