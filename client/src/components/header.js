import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 模拟从 localStorage 中获取用户信息
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setIsLoggedIn(true);
      setUsername(user.username);
    }
  }, []);

  const handleLogout = () => {
    // 清除用户登录信息
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');  // 跳转到登录页面
  };

  const handleProfile = () => {
    navigate('/profile');  // 跳转到账户信息页面
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);  // 切换浮窗显示状态
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">Logo</div>
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
              <div className="account-switch">切换账号</div> {/* 未来的功能 */}
              <button onClick={handleLogout}>登出</button>
            </div>
          )}
        </div>
      ) : null}
    </header>
  );
};

export default Header;
