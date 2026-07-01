import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import { getBooks, createBook, updateBook, deleteBook } from '../../services/bookService';

const CatalogManager = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    ISBN: '',
    category: '',
    publisher: '',
    publishYear: '',
    location: '',
    quantity: 1,
    description: ''
  });

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks({ search });
      setBooks(data.data || []);
    } catch (err) {
      console.error(err);
      alert('Lỗi tải danh sách sách: ' + (err.message || ''));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchBooks();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (book = null) => {
    if (book) {
      setEditingId(book._id);
      setFormData({
        title: book.title,
        author: book.author,
        ISBN: book.ISBN,
        category: book.category,
        publisher: book.publisher || '',
        publishYear: book.publishYear || '',
        location: book.location || '',
        quantity: book.quantity,
        description: book.description || ''
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', author: '', ISBN: '', category: '', publisher: '', publishYear: '', location: '', quantity: 1, description: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateBook(editingId, formData);
        alert('Cập nhật thành công!');
      } else {
        await createBook(formData);
        alert('Thêm sách thành công!');
      }
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      alert('Lỗi: ' + (err.message || 'Kiểm tra lại ISBN'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
      try {
        await deleteBook(id);
        fetchBooks();
      } catch (err) {
        alert('Lỗi khi xóa: ' + err.message);
      }
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Quản lý Sách (Catalog)</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Thêm sách mới
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px', display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Tìm kiếm theo mã ISBN hoặc tên sách... (Enter)" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
          <button className="btn btn-secondary" onClick={fetchBooks}>Tìm</button>
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
              <th style={{ padding: '1rem' }}>NXB</th>
              <th style={{ padding: '1rem' }}>Năm XB</th>
              <th style={{ padding: '1rem' }}>Vị trí</th>
              <th style={{ padding: '1rem' }}>Tồn Kho</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</td></tr>
            ) : books.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Không tìm thấy sách nào</td></tr>
            ) : (
              books.map((book) => (
                <tr key={book._id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="table-row-hover">
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{book.ISBN}</td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{book.title}</td>
                  <td style={{ padding: '1rem' }}>{book.author}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-purple)', borderRadius: 'var(--radius-full)' }}>
                      {book.category}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{book.publisher || '-'}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{book.publishYear || '-'}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{book.location || '-'}</td>
                  <td style={{ padding: '1rem' }}>{book.availableQuantity}/{book.quantity}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button onClick={() => openModal(book)} className="btn" style={{ padding: '0.4rem', background: 'transparent', color: 'var(--accent-blue)' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(book._id)} className="btn" style={{ padding: '0.4rem', background: 'transparent', color: 'var(--accent-red)' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '500px', maxWidth: '90%', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Sửa thông tin sách' : 'Thêm sách mới'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>ISBN *</label>
                <input required type="text" name="ISBN" value={formData.ISBN} onChange={handleInputChange} className="input-field" disabled={!!editingId} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Tên sách *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="input-field" />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Tác giả *</label>
                  <input required type="text" name="author" value={formData.author} onChange={handleInputChange} className="input-field" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Danh mục *</label>
                  <input required type="text" name="category" value={formData.category} onChange={handleInputChange} className="input-field" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Nhà xuất bản</label>
                  <input type="text" name="publisher" value={formData.publisher} onChange={handleInputChange} className="input-field" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Năm xuất bản</label>
                  <input type="number" name="publishYear" value={formData.publishYear} onChange={handleInputChange} className="input-field" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Số lượng nhập kho *</label>
                  <input required type="number" min="1" name="quantity" value={formData.quantity} onChange={handleInputChange} className="input-field" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Vị trí lưu trữ (Khu, Kệ...)</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="input-field" placeholder="Ví dụ: Kệ A1, Tầng 2" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Mô tả ngắn</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="input-field" style={{ minHeight: '80px', resize: 'vertical' }}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Lưu thay đổi' : 'Thêm sách'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogManager;
