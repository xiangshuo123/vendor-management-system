// PermissionPage.js

import React, { useState } from 'react';
import './PermissionPage.css';

const PermissionPage = () => {
  // 硬编码的子账号数据
  const [subAccounts, setSubAccounts] = useState([
    { id: 1, name: '张三', username: 'zhangsan', email: 'zhangsan@example.com', role: '普通销售员', selected: false },
    { id: 2, name: '李四', username: 'lisi', email: 'lisi@example.com', role: '普通销售员', selected: false },
    { id: 3, name: '王五', username: 'wangwu', email: 'wangwu@example.com', role: '次级管理员', selected: false },
  ]);

  const [selectAll, setSelectAll] = useState(false);

  // 权限数据
  const permissions = [
    {
      category: '供应商信息管理',
      items: [
        { name: '供应商信息', permissions: ['浏览', '编辑'] },
        { name: '资质证照', permissions: ['浏览', '编辑'] },
        { name: '产品信息', permissions: ['浏览', '上传', '编辑', '删除'] },
        { name: '产品修改历史记录', permissions: ['浏览'] },
        { name: '报价信息', permissions: ['浏览', '编辑', '删除'] },
        { name: '产品证书上传', permissions: ['上传'] },
        { name: '询报价记录', permissions: ['浏览'] },
      ],
    },
    {
      category: '账号信息管理',
      items: [
        { name: '账号信息', permissions: ['浏览'] },
        { name: '账号名称', permissions: ['编辑', '浏览'] },
        { name: '绑定邮箱', permissions: ['编辑', '浏览'] },
        { name: '绑定手机', permissions: ['编辑', '浏览'] },
        { name: '账号密码', permissions: ['修改', '浏览'] },
        { name: '注册日期', permissions: ['浏览'] },
        { name: '权限等级', permissions: ['修改', '浏览'] },
      ],
    },
    {
      category: '子账号信息管理',
      items: [
        { name: '子账号信息', permissions: ['浏览'] },
        { name: '账号持有人', permissions: ['编辑', '浏览'] },
        { name: '账号名称', permissions: ['编辑', '浏览'] },
        { name: '绑定邮箱', permissions: ['编辑', '浏览'] },
        { name: '绑定手机', permissions: ['编辑', '浏览'] },
        { name: '账号密码', permissions: ['修改', '浏览'] },
        { name: '注册日期', permissions: ['浏览'] },
        { name: '权限等级', permissions: ['修改', '浏览'] },
        { name: '注册新账号', permissions: ['允许'] },
      ],
    },
  ];

  // 处理全选子账号
  const handleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setSubAccounts(subAccounts.map((account) => ({ ...account, selected: newValue })));
  };

  // 处理单个子账号选择
  const handleSelectAccount = (id) => {
    setSubAccounts(
      subAccounts.map((account) =>
        account.id === id ? { ...account, selected: !account.selected } : account
      )
    );
  };

  // 处理角色更改
  const handleRoleChange = (id, newRole) => {
    setSubAccounts(
      subAccounts.map((account) =>
        account.id === id ? { ...account, role: newRole } : account
      )
    );
  };

  return (
    <div className="permission-page">
      <h1 className="title">权限设置</h1>

      {/* 第一部分：权限修改 */}
      <div className="permissions-section">
        {permissions.map((section, index) => (
          <div key={index} className="permission-category">
            <h2>{section.category}</h2>
            {section.items.map((item, idx) => (
              <div key={idx} className="permission-item">
                <span className="item-name">{item.name}</span>
                <div className="permission-options">
                  {item.permissions.map((perm, i) => (
                    <label key={i}>
                      <input type="checkbox" />
                      {perm}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 第二部分：设置子账号权限等级 */}
      <div className="subaccount-section">
        <h2>设置子账号权限等级</h2>
        <div className="subaccount-header">
          <div>
            已选择 {subAccounts.filter((acc) => acc.selected).length} 个账号
          </div>
          <div>
            <label>
              <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
              全选
            </label>
          </div>
          <button className="preset-button">预设权限等级</button>
        </div>
        <table className="subaccount-table">
          <thead>
            <tr>
              <th>选择</th>
              <th>名字</th>
              <th>用户名</th>
              <th>邮箱</th>
              <th>权限等级</th>
            </tr>
          </thead>
          <tbody>
            {subAccounts.map((account) => (
              <tr key={account.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={account.selected}
                    onChange={() => handleSelectAccount(account.id)}
                  />
                </td>
                <td>{account.name}</td>
                <td>{account.username}</td>
                <td>{account.email}</td>
                <td>
                  <select
                    value={account.role}
                    onChange={(e) => handleRoleChange(account.id, e.target.value)}
                  >
                    <option value="次级管理员">次级管理员</option>
                    <option value="普通销售员">普通销售员</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionPage;
