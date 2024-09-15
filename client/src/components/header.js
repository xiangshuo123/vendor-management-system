import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { AuthContext } from './AuthContext'; // Import AuthContext

const Header = () => {
  const { isLoggedIn, username, logout } = useContext(AuthContext); // Use AuthContext
  const [showDropdown, setShowDropdown] = React.useState(false);
  const navigate = useNavigate();

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
              <div className="account-switch">切换账号</div> {/* Future feature */}
              <button onClick={handleLogout}>登出</button>
            </div>
          )}
        </div>
      ) : null}
    </header>
  );
};

export default Header;
