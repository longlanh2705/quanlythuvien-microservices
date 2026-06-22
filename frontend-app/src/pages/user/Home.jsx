import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch dữ liệu từ Catalog Service
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5001/api/books?search=${searchQuery}`);
        const data = await res.json();
        if (data.success) {
          setBooks(data.data);
        } else {
          // Mock data nếu API trả về false (do chưa chạy server)
          generateMockBooks();
        }
      } catch (err) {
        console.log('Lỗi kết nối API, sử dụng dữ liệu mẫu:', err);
        generateMockBooks();
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchQuery]);

  const generateMockBooks = () => {
    setBooks([
      { _id: '1', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Programming', availableQuantity: 5, ISBN: '978-0201616224' },
      { _id: '2', title: 'Clean Architecture', author: 'Robert C. Martin', category: 'Programming', availableQuantity: 2, ISBN: '978-0134494166' },
      { _id: '3', title: 'Design Patterns', author: 'Erich Gamma', category: 'Software Design', availableQuantity: 0, ISBN: '978-0201633610' },
      { _id: '4', title: 'Refactoring', author: 'Martin Fowler', category: 'Programming', availableQuantity: 10, ISBN: '978-0134757599' },
    ]);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Khám phá <span style={{ color: 'var(--accent-purple)' }}>Tri Thức</span> Mới
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          Hệ thống thư viện hiện đại với hàng ngàn đầu sách công nghệ, thiết kế và kinh doanh đang chờ bạn khám phá.
        </p>

        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <input 
            type="text" 
            className="input-field glass-panel" 
            placeholder="Tìm kiếm sách theo tên, tác giả..." 
            style={{ paddingLeft: '3rem', fontSize: '1.1rem', borderRadius: 'var(--radius-full)' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </section>

      {/* Book Grid */}
      <section style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Sách Nổi Bật</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Đang tải dữ liệu...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {books.map((book) => (
              <Link to={`/book/${book._id}`} key={book._id} className="glass-panel hover-lift" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ height: '200px', background: 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Bìa sách</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{book.title}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>{book.author}</p>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)' }}>
                    {book.category}
                  </span>
                  <span style={{ color: book.availableQuantity > 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 'bold' }}>
                    {book.availableQuantity > 0 ? `Còn ${book.availableQuantity}` : 'Hết sách'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
