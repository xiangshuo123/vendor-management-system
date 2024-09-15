const db = require('../db'); // 引入数据库连接
const express = require('express');
const router = express.Router();

// 保存供应商信息的函数
const saveSupplierInfo = async (req, res) => {
  const {
    company_name,
    business_nature,
    contact_name,
    contacts,
    contact_phone,
    mobile_phone,
    country,
    state,
    city,
    district,
    landline,
    fax,
    email,
    bank_account_name,
    bank_name,
    bank_account_number,
    production_capacity,
    advantage,
  } = req.body;

  try {
    // 将可能为 undefined 的值替换为 null
    const paramValues = [
      company_name || null,
      business_nature || null,
      contact_name || null,
      contact_phone || null,
      mobile_phone || null,
      country || null,
      state || null,
      city || null,
      district || null,
      landline || null,
      fax || null,
      email || null,
      bank_account_name || null,
      bank_name || null,
      bank_account_number || null,
      production_capacity || null,
      advantage || null,
    ];

    // 插入供应商信息到 suppliers 表
    const [result] = await db
      .promise()
      .query(
        'INSERT INTO suppliers (company_name, business_nature, contact_name, contact_phone, mobile_phone, country, state, city, district, landline, fax, email, bank_account_name, bank_name, bank_account_number, production_capacity, advantage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        paramValues
      );

    const supplierId = result.insertId; // 获取新插入的供应商ID

    // 插入联系人信息到 contacts 表
    if (contacts && contacts.length > 0) {
      for (const contact of contacts) {
        await db
          .promise()
          .query(
            'INSERT INTO contacts (supplier_id, name, is_default) VALUES (?, ?, ?)',
            [supplierId, contact.name || null, contact.isDefault ? 1 : 0]
          );
      }
    }

    res
      .status(200)
      .json({ message: 'Supplier information saved successfully!' });
  } catch (error) {
    console.error('Error saving supplier information:', error);
    res.status(500).json({
      message: 'Error saving supplier information.',
      error: error.message,
    });
  }
};

// 根据供应商ID获取供应商信息的函数
const getSupplierInfo = async (req, res) => {
  const supplierId = req.params.id;

  try {
    const [suppliers] = await db
      .promise()
      .query('SELECT * FROM suppliers WHERE id = ?', [supplierId]);

    const [contacts] = await db
      .promise()
      .query('SELECT * FROM contacts WHERE supplier_id = ?', [supplierId]);

    if (suppliers.length === 0) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    const supplier = suppliers[0];
    supplier.contacts = contacts;

    res.status(200).json(supplier);
  } catch (error) {
    console.error('Error fetching supplier information:', error);
    res.status(500).json({
      message: 'Error fetching supplier information.',
      error: error.message,
    });
  }
};

module.exports = {
  saveSupplierInfo,
  getSupplierInfo,
};
