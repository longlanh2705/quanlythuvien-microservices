import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, BookOpen, CheckCircle } from 'lucide-react';
import { requestLoan } from '../../services/circulationService';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Gửi yêu cầu mượn cho từng cuốn trong giỏ
      const promises = cartItems.map(book => {
        const loanData = {
          userId: user.username,
          userName: user.fullName || user.username,
          bookId: book.ISBN || book._id,
          bookTitle: book.title,
        };
        return requestLoan(loanData);
      });

      await Promise.all(promises);
      
      setMessage('Đã gửi yêu cầu mượn thành công cho tất cả sách trong giỏ! Chờ thủ thư duyệt.');
      clearCart();
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi gửi yêu cầu mượn.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Giỏ mượn sách</h1>

      {message && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle /> {message}
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>Giỏ mượn sách đang trống</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Vui lòng quay lại màn hình tìm kiếm và thêm sách vào giỏ.</p>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>Khám phá sách</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <span>Số lượng sách đang chọn: <strong>{cartItems.length}/3</strong></span>
              <button onClick={clearCart} style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontWeight: 'bold' }}>
                Xóa tất cả
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((book) => (
                <div key={book._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{book.title}</h4>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Tác giả: {book.author} | ISBN: {book.ISBN}</p>
                  </div>
                  <button onClick={() => removeFromCart(book._id)} className="btn" style={{ background: 'transparent', color: 'var(--accent-red)', padding: '0.5rem' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>&larr; Tiếp tục chọn sách</Link>
            <button 
              onClick={handleCheckout} 
              className="btn btn-primary" 
              style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Xác nhận yêu cầu mượn'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
