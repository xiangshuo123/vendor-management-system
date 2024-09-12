const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');  // 引入认证中间件

const router = express.Router();

// 注册用户
router.post('/register', registerUser);

// 用户登录
router.post('/login', loginUser);

// 获取用户信息（受保护）
router.get('/profile', authenticateToken, getUserProfile);

// 更新用户信息（受保护）
router.put('/profile', authenticateToken, updateUserProfile);

module.exports = router;
