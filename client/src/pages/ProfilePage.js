import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({ username: '', email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token'); // 从localStorage获取JWT令牌
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data); // 设置用户信息
      } catch (error) {
        setError('Failed to fetch user information.');
      }
    };

    fetchUserInfo();
  }, []);

  // 更新用户信息
  const handleUpdate = async (e) => {
    e.preventDefault();
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
      setError('Failed to update profile.');
    }
  };

  return (
    <div>
      <h1>Profile Page</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleUpdate}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={userInfo.username}
            onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            required
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfilePage;
