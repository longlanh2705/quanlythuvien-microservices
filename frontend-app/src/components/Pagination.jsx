import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.4rem',
      marginTop: '2rem',
      flexWrap: 'wrap',
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn"
        style={{
          padding: '0.5rem 0.75rem',
          background: currentPage === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
          color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          border: '1px solid var(--glass-border)',
        }}
      >
        <ChevronLeft size={16} />
      </button>

      {start > 1 && (
        <>
          <PageBtn page={1} current={currentPage} onClick={onPageChange} />
          {start > 2 && <span style={{ color: 'var(--text-muted)', padding: '0 0.25rem' }}>…</span>}
        </>
      )}

      {pages.map(p => (
        <PageBtn key={p} page={p} current={currentPage} onClick={onPageChange} />
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span style={{ color: 'var(--text-muted)', padding: '0 0.25rem' }}>…</span>}
          <PageBtn page={totalPages} current={currentPage} onClick={onPageChange} />
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn"
        style={{
          padding: '0.5rem 0.75rem',
          background: currentPage === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
          color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          border: '1px solid var(--glass-border)',
        }}
      >
        <ChevronRight size={16} />
      </button>

      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
        Trang {currentPage} / {totalPages}
      </span>
    </div>
  );
};

const PageBtn = ({ page, current, onClick }) => (
  <button
    onClick={() => onClick(page)}
    className="btn"
    style={{
      padding: '0.5rem 0.75rem',
      minWidth: '2.25rem',
      background: page === current
        ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))'
        : 'rgba(255,255,255,0.07)',
      color: page === current ? 'white' : 'var(--text-secondary)',
      border: page === current ? 'none' : '1px solid var(--glass-border)',
      fontWeight: page === current ? '700' : '400',
    }}
  >
    {page}
  </button>
);

export default Pagination;
