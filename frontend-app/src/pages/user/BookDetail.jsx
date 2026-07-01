import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookById } from '../../services/bookService';
import { requestLoan } from '../../services/circulationService';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBookById(id);
        setBook(data.data || data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleBorrow = async () => {
    try {
      // Giả lập userId hiện tại là SV-001 (sẽ lấy từ Auth Service sau)
      const loanData = {
        userId: 'SV-001',
        userName: 'Nguyễn Văn A',
        bookId: book.ISBN,
        bookTitle: book.title
      };
      const res = await requestLoan(loanData);
      alert(res.message || 'Mượn sách thành công!');
    } catch (err) {
      alert('Lỗi: ' + (err.message || 'Không thể mượn sách lúc này'));
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>;
  if (!book) return <div style={{ padding: '2rem', textAlign: 'center' }}>Không tìm thấy sách</div>;

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '2rem auto' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>&larr; Quay lại</Link>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ width: '250px', height: '350px', background: 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          Ảnh bìa sách
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{book.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '1rem' }}>Tác giả: {book.author}</p>
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
            <span style={{ padding: '0.4rem 1rem', background: book.availableQuantity > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: book.availableQuantity > 0 ? 'var(--accent-green)' : 'var(--accent-red)', borderRadius: 'var(--radius-full)' }}>
              {book.availableQuantity > 0 ? `Còn ${book.availableQuantity} cuốn` : 'Hết sách'}
            </span>
            <span style={{ padding: '0.4rem 1rem', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-purple)', borderRadius: 'var(--radius-full)' }}>
              Mã ISBN: {book.ISBN}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
            {book.description || 'Chưa có mô tả cho sách này.'}
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button onClick={handleBorrow} disabled={book.availableQuantity <= 0} className={`btn ${book.availableQuantity > 0 ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
              {book.availableQuantity > 0 ? 'Mượn Sách Này' : 'Không Thể Mượn'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
