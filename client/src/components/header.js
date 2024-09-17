import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { AuthContext } from './AuthContext'; // Import AuthContext

const Header = () => {
  const { isLoggedIn, username, logout, login, getStoredAccounts } = useContext(AuthContext); // Use AuthContext
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSwitchAccount, setShowSwitchAccount] = useState(false); // 切换账号下拉框的状态
  const [storedAccounts, setStoredAccounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setStoredAccounts(getStoredAccounts()); // 获取已存储的账户信息
  }, [isLoggedIn]);

  // Handle navigation for logo click
  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate('/dashboard'); // Navigate to dashboard if logged in
    } else {
      navigate('/login'); // Navigate to login if not logged in
    }
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout(); // Call logout function to clear user state
    setShowDropdown(false); // Close dropdown
    navigate('/login'); // Ensure navigating to login page after logout
  };

  const handleSwitchAccountToggle = () => {
    setShowSwitchAccount(!showSwitchAccount); // Toggle account switch view
  };

  const handleSwitchAccount = (account) => {
    login(account.username, account.token); // 使用保存的token重新登录
    setShowDropdown(false); // Close the dropdown
    setShowSwitchAccount(false); // Close the account switch
    navigate('/dashboard'); // Redirect to dashboard after switching account
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo" onClick={handleLogoClick}>Logo</div> {/* Add onClick handler */}
        <div className="header-title">供应商平台</div>
      </div>
      {isLoggedIn ? (
        <div className="header-right">
          <div className="username" onClick={toggleDropdown}>
            {username}
            <span className="user-icon">👤</span>
          </div>
          {showDropdown && (
            <div className="dropdown">
              <p>您好！</p>
              <p>{username}</p>
              <button onClick={handleProfile}>管理账号信息</button>
              <div className="account-switch" onClick={handleSwitchAccountToggle}>
                切换账号 {storedAccounts.length > 1 ? `(${storedAccounts.length})` : ''}
              </div>
              {showSwitchAccount && (
                <div className="switch-account-list">
                  {storedAccounts.map((account) => (
                    <div key={account.username} className="account-item">
                      <span>{account.username}</span>
                      <button onClick={() => handleSwitchAccount(account)}>登录</button>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={handleLogout}>登出</button>
            </div>
          )}
        </div>
      ) : null}
    </header>
  );
};

export default Header;
