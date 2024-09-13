import React from 'react';
import { useNavigate } from 'react-router-dom';  // 导入 useNavigate 用于路由跳转
import './Dashboard.css';  // 导入 Dashboard 的 CSS 样式

const Dashboard = () => {
  const navigate = useNavigate();  // 使用 useNavigate 钩子进行页面导航

  return (
    <div className="dashboard-container">
      <h1>欢迎使用XXX供应商平台！</h1>
      <div className="dashboard-sections">
        {/* 第一个 Section: 账户设置 */}
        <div className="dashboard-section">
          <img src="/images/img-9531.webp" alt="账户设置" className="section-icon" />
          <h2>账户设置</h2>
          <ul>
            <li onClick={() => navigate('/profile')} className="clickable-link">账户信息</li>
            <li>账号权限</li>
            <li>供应商信息</li>
            <li>资质证照</li>
          </ul>
        </div>

        {/* 第二个 Section: 产品管理 */}
        <div className="dashboard-section">
          <img src="/images/img-9531.webp" alt="产品管理" className="section-icon" />
          <h2>产品管理</h2>
          <ul>
            <li>产品列表</li>
            <li>产品批量上传</li>
            <li>历史记录</li>
          </ul>
        </div>

        {/* 第三个 Section: 产品询价 */}
        <div className="dashboard-section">
          <img src="/images/img-9531.webp" alt="产品询价" className="section-icon" />
          <h2>产品询价</h2>
          <ul>
            <li>报价管理</li>
            <li>产品证书上传</li>
            <li>询报价记录查询</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
