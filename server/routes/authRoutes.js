const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// 注册用户
router.post('/register', registerUser);

// 用户登录
router.post('/login', loginUser);

module.exports = router;
