// routes/qualificationRoutes.js
const express = require('express');
const router = express.Router();

const { saveQualificationInfo, uploadFields, getQualificationInfo } = require('../controllers/qualificationController');

// 引入认证中间件
const authenticateToken = require('../middleware/authMiddleware');

// 路由：获取资质信息
router.get('/', authenticateToken, getQualificationInfo);

// 路由：保存资质信息和文件
router.post('/', authenticateToken, uploadFields, saveQualificationInfo);

module.exports = router;
