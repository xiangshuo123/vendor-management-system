import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';  // 引入 useParams 钩子
import './ResetPasswordPage.css';  // 引入CSS文件

const ResetPasswordPage = () => {
  const { token } = useParams();  // 从URL参数中获取token
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // 使用带有token的正确API路径
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        newPassword: formData.newPassword,
      });
      setMessage(response.data.message);
    // 成功后1.5秒自动跳转到登录页面
    setTimeout(() => {
      navigate('/login');
    }, 1500); 
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="reset-password-container">
      <h2>重置密码</h2>
      <p>请输入您的新密码</p>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="password"
            name="newPassword"
            placeholder="请输入新密码"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="确认新密码"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="reset-password-button" disabled={loading}>
          {loading ? '重置中...' : '重置密码'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
