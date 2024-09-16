// ProfilePage.js

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
    is_main_account: true,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [subAccounts, setSubAccounts] = useState([]);
  const [newSubAccount, setNewSubAccount] = useState({ username: '', password: '' });

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
        const data = response.data;

        // 确保 is_main_account 是布尔值
        data.is_main_account = data.is_main_account === true || data.is_main_account === '1' || data.is_main_account === 1 ? true : false;

        // 输出调试信息
        console.log('User Info:', data);
        console.log('Is Main Account:', data.is_main_account);

        setUserInfo(data); // 设置用户信息

        if (data.is_main_account) {
          // 如果是母账号，获取子账号列表
          fetchSubAccounts(token);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setErrorMessage('Failed to fetch profile data.');
      }
    };

    const fetchSubAccounts = async (token) => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/sub-accounts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubAccounts(response.data);
      } catch (error) {
        console.error('Error fetching sub-accounts:', error);
        setErrorMessage('Failed to fetch sub-accounts.');
      }
    };

    fetchUserInfo();
  }, []);

  // 更新用户信息
  const handleUpdate = async (field) => {
    if (!userInfo.is_main_account) {
      // 子账号无法更新信息
      return;
    }
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
        console.error(`Error updating ${field}:`, error);
        setErrorMessage(`Failed to update ${field}.`);
        setTimeout(() => setErrorMessage(''), 3000); // 清除错误消息
      }
    }
  };

// 创建子账号
const handleCreateSubAccount = async () => {
  if (!newSubAccount.username || !newSubAccount.password || !newSubAccount.email) {
    alert('Please enter username, email, and password for the sub-account.');
    return;
  }
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      'http://localhost:5000/api/auth/sub-accounts',
      newSubAccount,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setSuccessMessage('Sub-account created successfully!');
    setNewSubAccount({ username: '', email: '', password: '' });
    // 刷新子账号列表
    const response = await axios.get('http://localhost:5000/api/auth/sub-accounts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSubAccounts(response.data);
    setTimeout(() => setSuccessMessage(''), 3000);
  } catch (error) {
    console.error('Error creating sub-account:', error);
    setErrorMessage('Failed to create sub-account.');
    setTimeout(() => setErrorMessage(''), 3000);
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
          <button
            className="profile-edit-button"
            onClick={() => handleUpdate('account_holder')}
            disabled={!userInfo.is_main_account}
          >
            修改持有人
          </button>
        </div>

        {/* 账号名称 */}
        <div className="profile-row">
          <span className="profile-label">账号名称</span>
          <span className="profile-value">{userInfo.username}</span>
          <button
            className="profile-edit-button"
            onClick={() => handleUpdate('username')}
            disabled={!userInfo.is_main_account}
          >
            修改账号名称
          </button>
        </div>

        {/* 绑定邮箱 */}
        <div className="profile-row">
          <span className="profile-label">绑定邮箱</span>
          <span className="profile-value">{userInfo.email}</span>
          <button
            className="profile-edit-button"
            onClick={() => handleUpdate('email')}
            disabled={!userInfo.is_main_account}
          >
            更换邮箱
          </button>
        </div>

        {/* 绑定手机 */}
        <div className="profile-row">
          <span className="profile-label">绑定手机</span>
          <span className="profile-value">{userInfo.phone}</span>
          <button
            className="profile-edit-button"
            onClick={() => handleUpdate('phone')}
            disabled={!userInfo.is_main_account}
          >
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
          <button
            className="profile-edit-button"
            onClick={() => handleUpdate('password')}
            disabled={!userInfo.is_main_account}
          >
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
          <button
            className="profile-edit-button"
            onClick={() => handleUpdate('role')}
            disabled={!userInfo.is_main_account}
          >
            查看权限
          </button>
        </div>

        {/* 子账户管理 */}
        {userInfo.is_main_account && (
          <div className="subaccounts-section">
            <h2>子账户管理</h2>

            {/* 列出子账户 */}
            <table className="subaccounts-table">
              <thead>
                <tr>
                  <th>用户名</th>
                  <th>创建日期</th>
                </tr>
              </thead>
              <tbody>
                {subAccounts.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.username}</td>
                    <td>{new Date(sub.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 创建新子账户 */}
            <div className="create-subaccount-form">
              <h3>创建新子账户</h3>
              <input
                type="text"
                placeholder="用户名"
                value={newSubAccount.username}
                onChange={(e) => setNewSubAccount({ ...newSubAccount, username: e.target.value })}
              />
              <input
                type="email"
                placeholder="邮箱"
                value={newSubAccount.email}
                onChange={(e) => setNewSubAccount({ ...newSubAccount, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="密码"
                value={newSubAccount.password}
                onChange={(e) => setNewSubAccount({ ...newSubAccount, password: e.target.value })}
              />
              <button className="profile-edit-button" onClick={handleCreateSubAccount}>
                注册子账号
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
