import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Header from './components/header';
import Footer from './components/footer';
import { AuthProvider } from '../src/components/AuthContext';
import AccountLayout from './components/AccountLayout';
import PermissionPage from './pages/PermissionPage';
import QualificationsPage from './pages/QualificationsPage';
import SupplierInfoPage from './pages/SupplierInfoPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
            {/* Routes within the Account Layout */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/permissions" element={<PermissionPage />} />
            <Route path="/supplier-info" element={<SupplierInfoPage />} />
            <Route path="/certificates" element={<QualificationsPage />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
