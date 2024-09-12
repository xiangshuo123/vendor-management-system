import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams(); // 从URL获取重置令牌
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { newPassword });
      setMessage('Password reset successfully! You can now log in with your new password.');
      setError('');
      setTimeout(() => {
        navigate('/login'); // 重置成功后重定向到登录页面
      }, 2000);
    } catch (error) {
      setError('Failed to reset password. Please try again later.');
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleResetPassword}>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
