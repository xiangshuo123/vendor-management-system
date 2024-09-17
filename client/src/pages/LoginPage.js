import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 使用 useNavigate 钩子进行页面导航
import './LoginPage.css'; // 引入CSS文件
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 引入 FontAwesome 图标库
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'; // 引入用户和锁图标
import { AuthContext } from '../components/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 使用 useNavigate 钩子
  const { login } = useContext(AuthContext);

  useEffect(() => {
    // 从 localStorage 中获取用户名
    const savedUsername = localStorage.getItem('rememberMe');
    if (savedUsername) {
      setFormData((prevData) => ({
        ...prevData,
        username: savedUsername,
        rememberMe: true, // 如果有保存的用户名，则记住账号选项也设置为选中
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: formData.username,
        password: formData.password,
      });

      if (response.data.token) {
        login(formData.username); // 调用 login 函数更新全局状态
        localStorage.setItem('token', response.data.token); // 存储 JWT 令牌
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', formData.username); // 存储用户名
        } else {
          localStorage.removeItem('rememberMe');
        }
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || '登录失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>登录</h2>
      <p>加入供应商平台</p>
      {error && <p className="error-message">{error}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="请输入用户名"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="请输入密码"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="remember-me">
          <label>
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            记住账号
          </label>
          <button type="button" className="forgot-password-link" onClick={() => navigate('/forgot-password')}>
            忘记密码?
          </button>
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? '登录中...' : '登录'}
        </button>
        <button type="button" className="register-button" onClick={() => navigate('/register')}>
          注册
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
