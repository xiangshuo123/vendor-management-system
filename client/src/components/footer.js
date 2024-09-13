import React from 'react';
import './Footer.css';  // 引入 Footer 的 CSS 样式

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>服务科技与工业发展 造福人类</p>
        <div className="footer-sections">
          <div>
            <p>XXX集团</p>
            <p>公司简介</p>
            <p>企业承诺</p>
            <p>合作品牌</p>
            <p>招贤纳士</p>
          </div>
          <div>
            <p>浏览</p>
            <p>资讯中心</p>
            <p>安全说明书(SDS)</p>
            <p>产品</p>
          </div>
          <div>
            <p>联系我们</p>
            <p>XXX资源中心</p>
            <p>邮箱：abcd123@xxx.com</p>
            <p>电话：010-12345678</p>
            <p>传真：010-87654321</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
