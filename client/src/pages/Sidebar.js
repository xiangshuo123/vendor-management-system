// Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; 

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h3>账户设置</h3>
      <ul>
        <li>
          <NavLink to="/profile" activeClassName="active">
            <i className="fas fa-user"></i> 账户信息
          </NavLink>
        </li>
        <li>
          <NavLink to="/permissions" activeClassName="active">
            <i className="fas fa-toggle-on"></i> 账号权限
          </NavLink>
        </li>
        <li>
          <NavLink to="/supplier-info" activeClassName="active">
            <i className="fas fa-address-book"></i> 供应商信息
          </NavLink>
        </li>
        <li>
          <NavLink to="/certificates" activeClassName="active">
            <i className="fas fa-file-alt"></i> 资质证照
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
