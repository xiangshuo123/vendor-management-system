import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate
import './RegisterPage.css'; // 引入 CSS 文件

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'admin', // 默认是管理员
    companyName: '',
    accountHolder: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // 使用 useNavigate 钩子

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('密码不匹配');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      setSuccess(response.data.message);

      // 注册成功后重定向到登录页面
      setTimeout(() => {
        navigate('/login');
      }, 1500); // 等待1.5秒后跳转
    } catch (err) {
      setError(err.response?.data?.message || '注册失败，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>注册账号</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form className="register-form" onSubmit={handleSubmit}>
        {/* 个人信息部分 */}
        <h3>个人信息</h3>
        <div className="form-group">
          <label>用户名</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>邮箱</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>密码</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>确认密码</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>手机号</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>权限等级</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="admin">管理员</option>
            <option value="sales">销售员</option>
          </select>
        </div>

        {/* 公司信息部分 */}
        <h3>公司信息</h3>
        <div className="form-group">
          <label>公司名称</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>账户持有人</label>
          <input
            type="text"
            name="accountHolder"
            value={formData.accountHolder}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? '注册中...' : '注册'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
