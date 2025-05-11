import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from '../../components/auth/LoginForm';
import './authpage.css';
import logoImage from '../../assets/Fine Dine-in.png'

const LoginPage = () => {
  const { isAuth, user } = useAuth();

  // Redirect if already logged in
  if (isAuth) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else if (user.role === 'staff') {
      return <Navigate to="/staff/dashboard" />;
    } else {
      return <Navigate to="/menu" />;
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-logo">
            <img src={logoImage} alt="Restaurant Logo" />
            <h1>Fine Dine-In</h1>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
