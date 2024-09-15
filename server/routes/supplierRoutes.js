const express = require('express');
const router = express.Router();
const {
  saveSupplierInfo,
  getSupplierInfo,
} = require('../controllers/supplierController');

// 引入认证中间件
const authenticateToken = require('../middleware/authMiddleware');

// 路由：获取当前用户的供应商信息
router.get('/', authenticateToken, getSupplierInfo);

// 路由：保存供应商信息
router.post('/', authenticateToken, saveSupplierInfo);

module.exports = router;
