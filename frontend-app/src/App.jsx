import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// User Pages
import Home from './pages/user/Home';
import BookDetail from './pages/user/BookDetail';
import UserDashboard from './pages/user/UserDashboard';
import CartPage from './pages/user/CartPage';
import Profile from './pages/user/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';
import CatalogManager from './pages/admin/CatalogManager';
import CirculationManager from './pages/admin/CirculationManager';
import StudentManager from './pages/admin/StudentManager';
import PenaltyManager from './pages/admin/PenaltyManager';
import SystemManager from './pages/admin/SystemManager';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-secondary)' }}>Đang tải...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.some(r => user.role === r || user.role === 'ADMIN')) {
    return user.role !== 'STUDENT' ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Routes - ADMIN cũng vào được */}
            <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}><UserLayout /></ProtectedRoute>}>
              <Route path="/" element={<Home />} />
              <Route path="/book/:id" element={<BookDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN', 'LIBRARIAN', 'INVENTORY']}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminOverview />} />
              <Route path="catalog" element={<CatalogManager />} />
              <Route path="circulation" element={<CirculationManager />} />
              <Route path="students" element={<StudentManager />} />
              <Route path="penalties" element={<PenaltyManager />} />
              <Route path="system" element={<SystemManager />} />
            </Route>

            {/* Bắt các route không tồn tại */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
