import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// User Pages
import Home from './pages/user/Home';
import BookDetail from './pages/user/BookDetail';
import UserDashboard from './pages/user/UserDashboard';
import Login from './pages/Login';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';
import CatalogManager from './pages/admin/CatalogManager';
import CirculationManager from './pages/admin/CirculationManager';
import StudentManager from './pages/admin/StudentManager';
import PenaltyManager from './pages/admin/PenaltyManager';
import SystemManager from './pages/admin/SystemManager';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Đang tải...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.some(r => user.role.includes(r) || user.role === 'ADMIN')) {
    // Nếu có quyền nhưng sai role, đẩy về đúng chỗ
    return user.role !== 'STUDENT' ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']}><UserLayout /></ProtectedRoute>}>
            <Route path="/" element={<Home />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/dashboard" element={<UserDashboard />} />
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
    </AuthProvider>
  );
}

export default App;
