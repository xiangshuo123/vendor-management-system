// AccountLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../pages/Sidebar';
import './Sidebar.css';

const AccountLayout = () => {
  return (
    <div className="account-layout">
      <Sidebar />
      <div className="account-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AccountLayout;
