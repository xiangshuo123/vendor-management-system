// ProfilePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // 引入 Sidebar 组件
import './ProfilePage.css'; // 引入 ProfilePage 的 CSS 样式

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({ username: '', email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('profile'); // 当前页面状态

  // 获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);
      } catch (error) {
        setError('Failed to fetch user information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // 更新用户信息
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/profile',
        { username: userInfo.username, email: userInfo.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} /> {/* 添加 Sidebar */}
      <div className="profile-content"> {/* 新增内容容器 */}
        <h1>账户信息</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleUpdate} className="profile-form">
          <div className="form-group">
            <label>用户名:</label>
            <input
              type="text"
              value={userInfo.username}
              onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>邮箱:</label>
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              required
            />
          </div>
          <button type="submit" disabled={loading}>更新信息</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
