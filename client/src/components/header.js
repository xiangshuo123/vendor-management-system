import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { AuthContext } from './AuthContext';  // 引入 AuthContext

const Header = () => {
  const { isLoggedIn, username, logout } = useContext(AuthContext);  // 使用 AuthContext
  const [showDropdown, setShowDropdown] = React.useState(false);
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate('/profile');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();  // 调用登出函数清除用户状态
    setShowDropdown(false);  // 关闭浮窗
    navigate('/login');  // 确保登出后导航到登录页面
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
