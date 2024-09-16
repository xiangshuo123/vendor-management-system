// Footer.js

import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-top">
          <p className="slogan">服务科技与工业发展 造福人类</p>
        </div>
        <div className="footer-sections">
          <div className="footer-column">
            <h4>XXX集团</h4>
            <ul>
              <li>公司简介</li>
              <li>企业承诺</li>
              <li>合作品牌</li>
              <li>招贤纳士</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>浏览</h4>
            <ul>
              <li>资讯中心</li>
              <li>安全说明书(SDS)</li>
              <li>产品</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>联系我们</h4>
            <ul>
              <li>XXX资源中心</li>
              <li>邮箱：abcd123@xxx.com</li>
              <li>电话：010-12345678</li>
              <li>传真：010-87654321</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2023 XXX集团. 版权所有.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
