import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    account_holder: '',
    username: '',
    email: '',
    phone: '',
    company_name: '',
    password: '',
    registration_date: '',
    role: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
        setErrorMessage('Failed to fetch profile data.');
      }
    };

    fetchUserInfo();
  }, []);

  // 更新用户信息
  const handleUpdate = async (field) => {
    const newValue = prompt(`请输入新的${field}:`, userInfo[field]);
    if (newValue) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          'http://localhost:5000/api/auth/profile',
          { [field]: newValue },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserInfo({ ...userInfo, [field]: newValue });
        setSuccessMessage(`${field} updated successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000); // 清除成功消息
      } catch (error) {
        setErrorMessage(`Failed to update ${field}.`);
        setTimeout(() => setErrorMessage(''), 3000); // 清除错误消息
      }
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h1 className="profile-title">账户信息</h1>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        {/* 账号持有人 */}
        <div className="profile-row">
          <span className="profile-label">账号持有人</span>
          <span className="profile-value">{userInfo.account_holder}</span>
          <button className="profile-edit-button" onClick={() => handleUpdate('account_holder')}>
            修改持有人
          </button>
        </div>

        {/* 账号名称 */}
        <div className="profile-row">
          <span className="profile-label">账号名称</span>
          <span className="profile-value">{userInfo.username}</span>
          <button className="profile-edit-button" onClick={() => handleUpdate('username')}>
            修改账号名称
          </button>
        </div>

        {/* 绑定邮箱 */}
        <div className="profile-row">
          <span className="profile-label">绑定邮箱</span>
          <span className="profile-value">{userInfo.email}</span>
          <button className="profile-edit-button" onClick={() => handleUpdate('email')}>
            更换邮箱
          </button>
        </div>

        {/* 绑定手机 */}
        <div className="profile-row">
          <span className="profile-label">绑定手机</span>
          <span className="profile-value">{userInfo.phone}</span>
          <button className="profile-edit-button" onClick={() => handleUpdate('phone')}>
            更换手机
          </button>
        </div>

        {/* 账号关联公司 */}
        <div className="profile-row">
          <span className="profile-label">账号关联公司</span>
          <span className="profile-value">{userInfo.company_name}</span>
        </div>

        {/* 修改密码 */}
        <div className="profile-row">
          <span className="profile-label">账号密码</span>
          <span className="profile-value">**********</span>
          <button className="profile-edit-button" onClick={() => handleUpdate('password')}>
            修改密码
          </button>
        </div>

        {/* 注册日期 */}
        <div className="profile-row">
          <span className="profile-label">注册日期</span>
          <span className="profile-value">{userInfo.registration_date}</span>
        </div>

        {/* 权限等级 */}
        <div className="profile-row">
          <span className="profile-label">权限等级</span>
          <span className="profile-value">{userInfo.role}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
