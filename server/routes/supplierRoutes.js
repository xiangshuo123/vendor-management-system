const express = require('express');
const router = express.Router();
const {
  saveSupplierInfo,
  getSupplierInfo,
} = require('../controllers/supplierController');

// 路由：保存供应商信息
router.post('/', saveSupplierInfo);

// 路由：根据供应商ID获取供应商信息
router.get('/:id', getSupplierInfo);

module.exports = router;
