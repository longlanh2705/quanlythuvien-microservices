import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, BookOpen, Loader } from 'lucide-react';
import BookCard from '../../components/BookCard';
import Pagination from '../../components/Pagination';

// Skeleton card khi đang load
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

const MOCK_BOOKS = [
  { _id: '1', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Programming', availableQuantity: 5, ISBN: '978-0201616224' },
  { _id: '2', title: 'Clean Architecture', author: 'Robert C. Martin', category: 'Software Design', availableQuantity: 2, ISBN: '978-0134494166' },
  { _id: '3', title: 'Design Patterns', author: 'Erich Gamma', category: 'Software Design', availableQuantity: 0, ISBN: '978-0201633610' },
  { _id: '4', title: 'Refactoring', author: 'Martin Fowler', category: 'Programming', availableQuantity: 10, ISBN: '978-0134757599' },
  { _id: '5', title: 'Docker Deep Dive', author: 'Nigel Poulton', category: 'DevOps', availableQuantity: 3, ISBN: '978-1521822807' },
  { _id: '6', title: 'Kubernetes in Action', author: 'Marko Luksa', category: 'DevOps', availableQuantity: 1, ISBN: '978-1617293726' },
];

const CATEGORIES = ['Programming', 'Software Design', 'DevOps', 'Database', 'AI / ML'];

const Home = () => {
  const [books, setBooks]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [author, setAuthor]           = useState('');
  const [category, setCategory]       = useState('');
  const [available, setAvailable]     = useState('');
  const [page, setPage]               = useState(1);
  const [pagination, setPagination]   = useState({ total: 0, totalPages: 1 });
  const [showFilters, setShowFilters] = useState(false);

  const LIMIT = 8;

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5001/api/books?page=${page}&limit=${LIMIT}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (category)    url += `&category=${encodeURIComponent(category)}`;
      if (author)      url += `&author=${encodeURIComponent(author)}`;
      if (available)   url += `&available=${available}`;

      const res  = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setBooks(data.data);
        setPagination(data.pagination || { total: data.data.length, totalPages: 1 });
      } else {
        setBooks(MOCK_BOOKS);
        setPagination({ total: MOCK_BOOKS.length, totalPages: 1 });
      }
    } catch {
      setBooks(MOCK_BOOKS);
      setPagination({ total: MOCK_BOOKS.length, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, category, author, available, page]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(fetchBooks, 350);
    return () => clearTimeout(t);
  }, [fetchBooks]);

  // Reset về trang 1 khi filter thay đổi
  const handleFilterChange = (setter) => (val) => {
    setter(val);
    setPage(1);
  };

  return (
    <div>
      {/* Hero */}
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
              <Search size={16} style={{
                position: 'absolute', left: '1rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)',
              }} />
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
            <div style={{
              display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
              marginTop: '0.75rem',
              animation: 'slideDown 0.2s ease-out',
            }}>
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

              <input
                id="filter-author"
                type="text"
                className="input-field glass-panel"
                placeholder="Tìm theo tác giả..."
                style={{ borderRadius: 'var(--radius-full)', flex: '1', minWidth: '150px' }}
                value={author}
                onChange={(e) => handleFilterChange(setAuthor)(e.target.value)}
                maxLength={80}
              />

              <select
                id="filter-available"
                className="input-field glass-panel"
                style={{ width: 'auto', borderRadius: 'var(--radius-full)', flex: '1', minWidth: '150px' }}
                value={available}
                onChange={(e) => handleFilterChange(setAvailable)(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Sẵn sàng mượn</option>
                <option value="false">Đang được mượn</option>
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Results header */}
      <section style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Danh Sách Sách</h2>
            {!loading && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                {pagination.total > 0 ? `Tìm thấy ${pagination.total} kết quả` : 'Không có kết quả'}
              </p>
            )}
          </div>
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '0.875rem' }}>Đang tải...</span>
            </div>
          )}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}>
          {loading
            ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)
            : books.map(book => <BookCard key={book._id} book={book} />)
          }
        </div>

        {/* Empty state */}
        {!loading && books.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Không tìm thấy sách</h3>
            <p style={{ color: 'var(--text-muted)' }}>Thử thay đổi từ khóa hoặc bộ lọc</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && (
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages || 1}
            onPageChange={setPage}
          />
        )}
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
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;
