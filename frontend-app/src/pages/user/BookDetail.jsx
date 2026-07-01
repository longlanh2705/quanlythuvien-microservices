import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookById } from '../../services/bookService';
import { requestLoan } from '../../services/circulationService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Check } from 'lucide-react';

const BookDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowMessage, setBorrowMessage] = useState('');
  const [borrowing, setBorrowing] = useState(false);
  const [cartMsg, setCartMsg] = useState('');

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
    if (!user) {
      setBorrowMessage('Bạn cần đăng nhập để mượn sách.');
      return;
    }
    setBorrowing(true);
    setBorrowMessage('');
    try {
      const loanData = {
        userId: user.username,
        userName: user.fullName || user.username,
        bookId: book.ISBN || book._id,
        bookTitle: book.title,
      };
      const res = await requestLoan(loanData);
      setBorrowMessage(res.message || 'Đã gửi yêu cầu mượn sách thành công!');
    } catch (err) {
      setBorrowMessage('Lỗi: ' + (err.message || 'Không thể mượn sách lúc này'));
    } finally {
      setBorrowing(false);
    }
  };

  const handleAddToCart = () => {
    if (!book) return;
    setCartMsg('');
    const res = addToCart(book);
    if (res.success) {
      setCartMsg(res.message);
    } else {
      setBorrowMessage(res.message);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>;
  if (!book) return <div style={{ padding: '2rem', textAlign: 'center' }}>Không tìm thấy sách</div>;

  const isOutOfStock = (book.availableQuantity || 0) === 0;
  const inCart = cartItems.some(item => item._id === book._id);

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '900px', margin: '2rem auto' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>&larr; Quay lại</Link>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ width: '250px', height: '350px', background: 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
          📚 Bìa sách
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{book.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1rem' }}>Tác giả: {book.author}</p>
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '0.4rem 1rem', background: isOutOfStock ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: isOutOfStock ? 'var(--accent-red)' : 'var(--accent-green)', borderRadius: 'var(--radius-full)' }}>
              {isOutOfStock ? 'Hết sách' : `Còn ${book.availableQuantity} cuốn`}
            </span>
            <span style={{ padding: '0.4rem 1rem', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-purple)', borderRadius: 'var(--radius-full)' }}>
              ISBN: {book.ISBN}
            </span>
            {book.category && (
              <span style={{ padding: '0.4rem 1rem', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)', borderRadius: 'var(--radius-full)' }}>
                {book.category}
              </span>
            )}
          </div>
          
          <h3 style={{ marginBottom: '0.5rem' }}>Mô tả</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1rem' }}>
            {book.description || 'Chưa có mô tả cho sách này.'}
          </p>

          <div style={{ color: 'var(--text-secondary)', display: 'grid', gap: '0.35rem', marginBottom: '1.5rem' }}>
            {book.publisher && <div>Nhà xuất bản: {book.publisher}</div>}
            {book.publishYear && <div>Năm xuất bản: {book.publishYear}</div>}
            {book.location && <div>Vị trí: {book.location}</div>}
            <div>Tổng số: {book.quantity || 0} cuốn</div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {isOutOfStock ? (
              <button 
                onClick={handleBorrow} 
                disabled={borrowing} 
                className="btn btn-secondary" 
                style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', border: '1px solid var(--accent-red)' }}
              >
                {borrowing ? 'Đang xử lý...' : 'Đặt giữ chỗ trước'}
              </button>
            ) : (
              <>
                <button 
                  onClick={handleBorrow} 
                  disabled={borrowing} 
                  className="btn btn-primary" 
                  style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}
                >
                  {borrowing ? 'Đang xử lý...' : 'Mượn ngay'}
                </button>
                <button 
                  onClick={handleAddToCart}
                  className="btn btn-secondary" 
                  style={{ padding: '0.8rem 1.5rem', fontSize: '1.1rem', gap: '0.5rem' }}
                >
                  {inCart ? <Check size={18} /> : <ShoppingCart size={18} />}
                  {inCart ? 'Đã trong giỏ' : 'Thêm vào giỏ'}
                </button>
              </>
            )}
          </div>
          {borrowMessage && (
            <p style={{ marginTop: '1rem', color: borrowMessage.startsWith('Lỗi') ? 'var(--accent-red)' : 'var(--accent-green)' }}>
              {borrowMessage}
            </p>
          )}
          {cartMsg && (
            <p style={{ marginTop: '1rem', color: 'var(--accent-blue)' }}>
              {cartMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
