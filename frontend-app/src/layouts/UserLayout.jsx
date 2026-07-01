import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen, User, Search, ShoppingCart } from 'lucide-react';
import NotificationBell from '../components/NotificationBell';
import { useCart } from '../context/CartContext';

const UserLayout = () => {
  const { cartItems } = useCart();

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
            <NotificationBell />
            <Link to="/cart" className="btn btn-secondary hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', position: 'relative' }}>
              <ShoppingCart size={18} />
              <span>Giỏ mượn</span>
              {cartItems.length > 0 && (
                <span style={{
                  position: 'absolute', top: '-8px', right: '-8px',
                  background: 'var(--accent-blue)', color: 'white',
                  borderRadius: '50%', width: '18px', height: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 'bold'
                }}>
                  {cartItems.length}
                </span>
              )}
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
