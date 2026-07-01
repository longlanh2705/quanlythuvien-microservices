import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookCopy, Users, LogOut, ClipboardList, ArrowLeftRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const role = user?.role || 'ADMIN';

  const isSuperAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const isLibrarian = role === 'LIBRARIAN' || isSuperAdmin;
  const isInventory = role === 'INVENTORY' || isSuperAdmin;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navStyle = ({ isActive }) => ({
    justifyContent: 'flex-start',
    background: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
    color: isActive ? 'var(--accent-blue)' : 'var(--text-primary)',
  });

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
          <NavLink to="/admin" end className="btn btn-secondary" style={navStyle}>
            <LayoutDashboard size={18} /> Tổng quan
          </NavLink>
          {isInventory && (
            <NavLink to="/admin/catalog" className="btn btn-secondary" style={navStyle}>
              <BookCopy size={18} /> Quản lý Sách
            </NavLink>
          )}
          {isLibrarian && (
            <>
              <NavLink to="/admin/circulation" className="btn btn-secondary" style={navStyle}>
                <ArrowLeftRight size={18} /> Quản lý Mượn/Trả
              </NavLink>
              <NavLink to="/admin/penalties" className="btn btn-secondary" style={navStyle}>
                <AlertCircle size={18} /> Quản lý Vi phạm
              </NavLink>
              <NavLink to="/admin/students" className="btn btn-secondary" style={navStyle}>
                <Users size={18} /> Quản lý Độc giả
              </NavLink>
            </>
          )}
          {isSuperAdmin && (
            <NavLink to="/admin/system" className="btn btn-secondary" style={navStyle}>
              <ClipboardList size={18} /> Quản trị Hệ thống
            </NavLink>
          )}
        </nav>
        
        <div style={{ padding: '2rem' }}>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={18} /> Đăng xuất
          </button>
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
