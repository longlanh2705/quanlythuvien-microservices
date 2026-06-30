import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

// Màu gradient theo category
const CATEGORY_GRADIENTS = {
  'Programming':     'linear-gradient(135deg, #1e3a5f, #2563eb)',
  'Software Design': 'linear-gradient(135deg, #3b1f5e, #7c3aed)',
  'DevOps':          'linear-gradient(135deg, #1a3a2e, #059669)',
  'Database':        'linear-gradient(135deg, #3d1f1f, #dc2626)',
  'AI / ML':         'linear-gradient(135deg, #1f3040, #0891b2)',
  'default':         'linear-gradient(135deg, #1e293b, #334155)',
};

const getCategoryGradient = (category) =>
  CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS['default'];

const BookCard = ({ book }) => {
  const gradient = getCategoryGradient(book.category);
  const isAvailable = book.availableQuantity > 0;

  return (
    <Link
      to={`/book/${book._id}`}
      className="glass-panel hover-lift"
      style={{
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        textDecoration: 'none',
      }}
    >
      {/* Cover */}
      <div style={{
        height: '180px',
        background: gradient,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '1rem',
      }}>
        <BookOpen size={48} color="rgba(255,255,255,0.25)" />
        <span style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          fontSize: '0.75rem',
          padding: '0.2rem 0.6rem',
          borderRadius: 'var(--radius-full)',
          background: isAvailable ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
          color: isAvailable ? '#6ee7b7' : '#fca5a5',
          border: `1px solid ${isAvailable ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
          fontWeight: '600',
        }}>
          {isAvailable ? `Còn ${book.availableQuantity}` : 'Hết sách'}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '600',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {book.title}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{book.author}</p>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: '0.75rem',
            padding: '0.2rem 0.6rem',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--text-secondary)',
          }}>
            {book.category}
          </span>
          {book.ISBN && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {book.ISBN}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
