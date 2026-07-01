import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react';
import { getBooks } from '../../services/bookService';

const MOCK_BOOKS = [
  { _id: '1', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Programming', availableQuantity: 5, ISBN: '978-0201616224' },
  { _id: '2', title: 'Clean Architecture', author: 'Robert C. Martin', category: 'Programming', availableQuantity: 2, ISBN: '978-0134494166' },
  { _id: '3', title: 'Design Patterns', author: 'Erich Gamma', category: 'Software Design', availableQuantity: 0, ISBN: '978-0201633610' },
  { _id: '4', title: 'Refactoring', author: 'Martin Fowler', category: 'Programming', availableQuantity: 10, ISBN: '978-0134757599' },
];

const CATEGORIES = ['Programming', 'Software Design', 'DevOps', 'Database', 'AI / ML', 'Mạng máy tính', 'Toán học'];

const SkeletonCard = () => (
  <div className="glass-panel" style={{ overflow: 'hidden' }}>
    <div style={{ height: '180px', background: 'var(--bg-tertiary)', animation: 'pulse 1.5s ease-in-out infinite' }} />
    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ height: '1rem', background: 'var(--bg-tertiary)', borderRadius: '4px', width: '80%', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '4px', width: '55%', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '4px', width: '40%', marginTop: '0.5rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
    </div>
  </div>
);

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchBooksData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (category) params.category = category;
      
      const data = await getBooks(params);
      if (data && data.data) {
        setBooks(data.data);
      } else {
        setBooks(MOCK_BOOKS);
      }
    } catch (err) {
      console.log('Lỗi kết nối API, sử dụng dữ liệu mẫu:', err);
      setBooks(MOCK_BOOKS);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, category]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(fetchBooksData, 350);
    return () => clearTimeout(t);
  }, [fetchBooksData]);

  const handleFilterChange = (setter) => (val) => {
    setter(val);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '4rem 0 2rem' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem', lineHeight: 1.2 }}>
          Khám phá <span style={{ background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tri Thức</span> Mới
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto 2.5rem' }}>
          Hệ thống thư viện hiện đại với hàng ngàn đầu sách đang chờ bạn khám phá.
        </p>

        {/* Search bar */}
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="book-search"
                type="text"
                className="input-field glass-panel"
                placeholder="Tìm theo tên sách, tác giả..."
                style={{ paddingLeft: '2.5rem', borderRadius: 'var(--radius-full)' }}
                value={searchQuery}
                onChange={(e) => handleFilterChange(setSearchQuery)(e.target.value)}
                maxLength={100}
              />
            </div>
            <button
              className="btn"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                border: '1px solid var(--glass-border)',
                background: showFilters ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))' : 'var(--glass-bg)',
                borderRadius: 'var(--radius-full)',
                gap: '0.4rem',
              }}
            >
              <SlidersHorizontal size={16} />
              Bộ lọc
            </button>
          </div>

          {/* Expandable filters */}
          {showFilters && (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem', animation: 'slideDown 0.2s ease-out' }}>
              <select
                id="filter-category"
                className="input-field glass-panel"
                style={{ width: 'auto', borderRadius: 'var(--radius-full)', flex: '1', minWidth: '150px' }}
                value={category}
                onChange={(e) => handleFilterChange(setCategory)(e.target.value)}
              >
                <option value="">Tất cả thể loại</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Danh Sách Sách</h2>
            {!loading && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                {books.length > 0 ? `Tìm thấy ${books.length} kết quả` : 'Không có kết quả'}
              </p>
            )}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : books.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
              <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', display: 'block' }} />
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Không tìm thấy sách</h3>
              <p style={{ color: 'var(--text-muted)' }}>Thử thay đổi từ khóa hoặc bộ lọc</p>
            </div>
          ) : (
            books.map((book) => (
              <Link to={`/book/${book._id}`} key={book._id} className="glass-panel hover-lift" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ height: '180px', background: 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '2rem' }}>📚</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{book.title}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>{book.author}</p>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-purple)', borderRadius: 'var(--radius-full)' }}>
                    {book.category}
                  </span>
                  <span style={{ color: book.availableQuantity > 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {book.availableQuantity > 0 ? `Còn ${book.availableQuantity}` : 'Hết sách'}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Home;
