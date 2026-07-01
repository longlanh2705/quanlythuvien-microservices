import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookCopy, Users, LogOut, ClipboardList, ArrowLeftRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role || 'ADMIN'; // Default fallback

  const isSuperAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const isLibrarian = role === 'LIBRARIAN' || isSuperAdmin;
  const isInventory = role === 'INVENTORY' || isSuperAdmin;

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
          {isInventory && (
            <Link to="/admin/catalog" className="btn btn-secondary" style={{ justifyContent: 'flex-start', background: 'transparent' }}>
              <BookCopy size={18} /> Quản lý Sách
            </Link>
          )}
          {isLibrarian && (
            <>
              <Link to="/admin/circulation" className={`btn btn-secondary ${location.pathname === '/admin/circulation' ? 'active' : ''}`} style={{ justifyContent: 'flex-start', background: 'transparent' }}>
                <ArrowLeftRight size={18} /> Quản lý Mượn/Trả
              </Link>
              <Link to="/admin/penalties" className={`btn btn-secondary ${location.pathname === '/admin/penalties' ? 'active' : ''}`} style={{ justifyContent: 'flex-start', background: 'transparent' }}>
                <AlertCircle size={18} /> Quản lý Vi phạm
              </Link>
              <Link to="/admin/students" className="btn btn-secondary" style={{ justifyContent: 'flex-start', background: 'transparent' }}>
                <Users size={18} /> Quản lý Độc giả
              </Link>
            </>
          )}
          {isSuperAdmin && (
            <Link to="/admin/system" className={`btn btn-secondary ${location.pathname === '/admin/system' ? 'active' : ''}`} style={{ justifyContent: 'flex-start', background: 'transparent' }}>
              <ClipboardList size={18} /> Quản trị Hệ thống
            </Link>
          )}
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
