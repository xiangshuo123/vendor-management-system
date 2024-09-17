// Dashboard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>欢迎使用XXX供应商平台！</h1>
      <div className="dashboard-sections">
        {/* 账户设置 */}
        <div className="dashboard-section" onClick={() => navigate('/profile')}>
          <div className="section-content">
            <h3 className="section-subtitle">账户设置</h3>
            <ul>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/profile');
                }}
                className="clickable-link"
              >
                <span className="bullet-point">•</span>账户信息
              </li>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/permissions');
                }}
                className="clickable-link"
              >
                <span className="bullet-point">•</span>账号权限
              </li>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/supplier-info');
                }}
                className="clickable-link"
              >
                <span className="bullet-point">•</span>供应商信息
              </li>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/certificates');
                }}
                className="clickable-link"
              >
                <span className="bullet-point">•</span>资质证照
              </li>
            </ul>
          </div>
        </div>

        {/* 产品管理 */}
        <div className="dashboard-section" onClick={() => navigate('/product-list')}>
          <div className="section-content">
            <h3 className="section-subtitle">产品管理</h3>
            <ul>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/product-list');
                }}
                className="clickable-link"
              >
                <span className="bullet-point">•</span>产品列表
              </li>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/product-upload');
                }}
                className="clickable-link"
              >
                <span className="bullet-point">•</span>产品批量上传
              </li>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/history');
                }}
                className="clickable-link"
              >
                <span className="bullet-point">•</span>历史记录
              </li>
            </ul>
          </div>
        </div>

        {/* 产品询价 */}
        <div className="dashboard-section" onClick={() => navigate('/quotes')}>
          <div className="section-content">
            {/* 移除了 SVG 图标 */}
            <h3 className="section-subtitle">产品询价</h3>
            <ul>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/quote-management');
                }}
                className="clickable-link"
              >
                <span className="bullet-point">•</span>报价管理
              </li>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/certificate-upload');
                }}
                className="clickable-link"
              >
                <span className="bullet-point">•</span>产品证书上传
              </li>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/quote-history');
                }}
                className="clickable-link"
              >
                <span className="bullet-point">•</span>询报价记录查询
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
