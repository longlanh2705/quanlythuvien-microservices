import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen, User, Search } from 'lucide-react';

const UserLayout = () => {
  return (
    <div className="app-container">
      <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>
            <BookOpen className="text-accent-blue" />
            <span>Thư Viện <span style={{ color: 'var(--accent-blue)' }}>Tech</span></span>
          </Link>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link to="/" className="hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <Search size={18} /> Khám phá
            </Link>
            <Link to="/dashboard" className="btn btn-primary hover-lift">
              <User size={18} /> Tài khoản
            </Link>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
