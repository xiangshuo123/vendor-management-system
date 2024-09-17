import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState(''); // 添加token状态

  useEffect(() => {
    // 从 localStorage 中获取用户信息和 token
    const user = JSON.parse(localStorage.getItem('user'));
    const savedToken = localStorage.getItem('token');
    
    if (user && savedToken) {
      setIsLoggedIn(true);
      setUsername(user.username);
      setToken(savedToken); // 设置token
    }
  }, []);

  const login = (username, token) => {
    setIsLoggedIn(true);
    setUsername(username);
    setToken(token); // 设置token
    localStorage.setItem('user', JSON.stringify({ username })); // 存储用户信息到 localStorage
    localStorage.setItem('token', token); // 存储token到 localStorage
    // 存储已登录的账号信息
    const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
    if (!storedAccounts.some(account => account.username === username)) {
      storedAccounts.push({ username, token });
      localStorage.setItem('accounts', JSON.stringify(storedAccounts));
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setToken(''); // 清除token
    localStorage.removeItem('user'); // 移除 localStorage 中的用户信息
    localStorage.removeItem('token'); // 移除 token
  };

  // 获取已存储的账户信息
  const getStoredAccounts = () => {
    return JSON.parse(localStorage.getItem('accounts')) || [];
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, token, login, logout, getStoredAccounts }}>
      {children}
    </AuthContext.Provider>
  );
};
