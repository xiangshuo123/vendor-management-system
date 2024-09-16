// authRoutes.js

const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getSubAccounts,
  registerSubAccount,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');  // 引入认证中间件

const router = express.Router();

// 注册用户（母账号）
router.post('/register', registerUser);

// 用户登录
router.post('/login', loginUser);

// 获取用户信息（受保护）
router.get('/profile', authenticateToken, getUserProfile);

// 更新用户信息（受保护）
router.put('/profile', authenticateToken, updateUserProfile);

// 获取子账号列表（受保护）
router.get('/sub-accounts', authenticateToken, getSubAccounts);

// 注册子账号（受保护）
router.post('/sub-accounts', authenticateToken, registerSubAccount);

// 忘记密码
router.post('/forgot-password', forgotPassword);

// 重置密码
router.post('/reset-password/:token', resetPassword);

module.exports = router;
