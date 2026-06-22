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
import StudentManager from './pages/admin/StudentManager'; // Will create next

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Đang tải...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Nếu có quyền nhưng sai role, đẩy về đúng chỗ
    return user.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />;
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
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminOverview />} />
            <Route path="catalog" element={<CatalogManager />} />
            <Route path="students" element={<StudentManager />} />
          </Route>

          {/* Bắt các route không tồn tại */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
