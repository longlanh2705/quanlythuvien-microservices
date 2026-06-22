import React from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

const CatalogManager = () => {
  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Quản lý Sách (Catalog)</h1>
        <button className="btn btn-primary">
          <Plus size={18} /> Thêm sách mới
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Tìm kiếm theo mã ISBN hoặc tên sách..." 
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--glass-border)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>ISBN</th>
              <th style={{ padding: '1rem' }}>Tên Sách</th>
              <th style={{ padding: '1rem' }}>Tác Giả</th>
              <th style={{ padding: '1rem' }}>Danh Mục</th>
              <th style={{ padding: '1rem' }}>Tồn Kho</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="table-row-hover">
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>978-013...</td>
                <td style={{ padding: '1rem', fontWeight: '500' }}>Tên sách mẫu {item}</td>
                <td style={{ padding: '1rem' }}>Tác giả {item}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-purple)', borderRadius: 'var(--radius-full)' }}>Lập trình</span>
                </td>
                <td style={{ padding: '1rem' }}>5/10</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button className="btn" style={{ padding: '0.4rem', background: 'transparent', color: 'var(--accent-blue)' }}><Edit2 size={16} /></button>
                  <button className="btn" style={{ padding: '0.4rem', background: 'transparent', color: 'var(--accent-red)' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--glass-border)' }}>
          <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>Trước</button>
          <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>1</button>
          <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>Sau</button>
        </div>
      </div>
    </div>
  );
};

export default CatalogManager;
