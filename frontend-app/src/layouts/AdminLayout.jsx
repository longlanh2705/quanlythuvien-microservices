import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, BookCopy, Users, LogOut } from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="app-container" style={{ flexDirection: 'row' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '280px', height: '100vh', position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
        <div style={{ padding: '2rem' }}>
          <h2 style={{ color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LayoutDashboard /> Admin Panel
          </h2>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
          <Link to="/admin" className="btn btn-secondary" style={{ justifyContent: 'flex-start', background: 'transparent' }}>
            <LayoutDashboard size={18} /> Tổng quan
          </Link>
          <Link to="/admin/catalog" className="btn btn-secondary" style={{ justifyContent: 'flex-start', background: 'transparent' }}>
            <BookCopy size={18} /> Quản lý Sách
          </Link>
          <Link to="/admin/students" className="btn btn-secondary" style={{ justifyContent: 'flex-start', background: 'transparent' }}>
            <Users size={18} /> Quản lý Độc giả
          </Link>
        </nav>
        
        <div style={{ padding: '2rem' }}>
          <Link to="/" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={18} /> Đăng xuất
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
