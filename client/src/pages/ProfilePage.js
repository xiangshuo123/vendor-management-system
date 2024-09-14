import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    phone: '',
    role: '',
    company_name: '',
    account_holder: '',
    registration_date: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [editField, setEditField] = useState({ field: '', value: '' });

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
        const fetchedData = response.data;
        setUserInfo({
          username: fetchedData.username,
          email: fetchedData.email,
          phone: fetchedData.phone,
          role: fetchedData.role,
          company_name: fetchedData.company_name,
          account_holder: fetchedData.account_holder,
          registration_date: fetchedData.registration_date
        });
      } catch (error) {
        setError('Failed to fetch user information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleFieldChange = (field, value) => {
    setEditField({ field, value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/auth/profile`,
        { [editField.field]: editField.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserInfo((prevState) => ({
        ...prevState,
        [editField.field]: editField.value
      }));
      setSuccess(`${editField.field} updated successfully!`);
      setEditField({ field: '', value: '' });  // 清除编辑状态
    } catch (error) {
      setError(`Failed to update ${editField.field}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/profile',
        { password: passwordData.newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Password updated successfully!');
      setShowPasswordModal(false);
    } catch (error) {
      setError('Failed to update password. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h1 className="profile-title">账户信息</h1>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <div className="profile-table">
          {/* 账号持有人 */}
          <div className="profile-row">
            <div className="profile-label">账号持有人</div>
            <div className="profile-value">
              {editField.field === 'account_holder' ? (
                <input
                  type="text"
                  value={editField.value}
                  onChange={(e) => handleFieldChange('account_holder', e.target.value)}
                />
              ) : (
                userInfo.account_holder
              )}
            </div>
            <button
              className="profile-edit-button"
              onClick={() =>
                editField.field === 'account_holder' ? handleUpdate() : handleFieldChange('account_holder', userInfo.account_holder)
              }
            >
              {editField.field === 'account_holder' ? '保存' : '修改持有人'}
            </button>
          </div>
          {/* 其他字段 */}
          {['username', 'email', 'phone'].map((key) => (
            <div key={key} className="profile-row">
              <div className="profile-label">{key === 'username' ? '账号名称' : key === 'email' ? '绑定邮箱' : '绑定手机'}</div>
              <div className="profile-value">
                {editField.field === key ? (
                  <input
                    type="text"
                    value={editField.value}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                  />
                ) : (
                  userInfo[key]
                )}
              </div>
              <button
                className="profile-edit-button"
                onClick={() =>
                  editField.field === key ? handleUpdate() : handleFieldChange(key, userInfo[key])
                }
              >
                {editField.field === key ? '保存' : `修改${key === 'username' ? '账号名称' : key === 'email' ? '邮箱' : '手机'}`}
              </button>
            </div>
          ))}
          {/* 不可编辑的字段 */}
          <div className="profile-row">
            <div className="profile-label">账号关联公司</div>
            <div className="profile-value">{userInfo.company_name}</div>
          </div>
          <div className="profile-row">
            <div className="profile-label">账号密码</div>
            <div className="profile-value">**********</div>
            <button className="profile-edit-button" onClick={() => setShowPasswordModal(true)}>修改密码</button>
          </div>
          <div className="profile-row">
            <div className="profile-label">注册日期</div>
            <div className="profile-value">{userInfo.registration_date}</div>
          </div>
          <div className="profile-row">
            <div className="profile-label">权限等级</div>
            <div className="profile-value">{userInfo.role}</div>
            <button className="profile-edit-button" onClick={() => setShowRoleModal(true)}>查看权限</button>
          </div>
        </div>

        {/* 修改密码弹窗 */}
        {showPasswordModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>修改密码</h2>
              <input
                type="password"
                placeholder="当前密码"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
              <input
                type="password"
                placeholder="新密码"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
              <button onClick={handlePasswordUpdate}>确定</button>
              <button onClick={() => setShowPasswordModal(false)}>取消</button>
            </div>
          </div>
        )}

        {/* 查看权限弹窗 */}
        {showRoleModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>权限信息</h2>
              <p>您的当前权限等级是: {userInfo.role}</p>
              <button onClick={() => setShowRoleModal(false)}>关闭</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
