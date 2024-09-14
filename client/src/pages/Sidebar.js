// Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css'; // 引入 Sidebar 的 CSS 样式

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const navigate = useNavigate();

  const handleNavigation = (page) => {
    setCurrentPage(page); // 更新当前页面状态
    navigate(`/${page}`); // 导航到选定页面
  };

  return (
    <div className="sidebar">
      <h3>账户设置</h3>
      <ul>
        <li className={currentPage === 'profile' ? 'active' : ''} onClick={() => handleNavigation('profile')}>
          <i className="fas fa-user"></i> 账户信息
        </li>
        <li className={currentPage === 'permissions' ? 'active' : ''} onClick={() => handleNavigation('permissions')}>
          <i className="fas fa-toggle-on"></i> 账号权限
        </li>
        <li className={currentPage === 'supplier-info' ? 'active' : ''} onClick={() => handleNavigation('supplier-info')}>
          <i className="fas fa-address-book"></i> 供应商信息
        </li>
        <li className={currentPage === 'certificates' ? 'active' : ''} onClick={() => handleNavigation('certificates')}>
          <i className="fas fa-file-alt"></i> 资质证照
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
