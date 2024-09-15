const express = require('express');
const router = express.Router();

const { saveQualificationInfo, uploadFields } = require('../controllers/qualificationController');

// 引入认证中间件
const authenticateToken = require('../middleware/authMiddleware');

// 路由：保存资质信息和文件
router.post('/', authenticateToken, uploadFields, saveQualificationInfo);

module.exports = router;
