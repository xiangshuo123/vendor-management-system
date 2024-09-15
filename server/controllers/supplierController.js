const db = require('../db'); // 引入数据库连接

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
    // 从认证中间件中获取用户 ID
    const userId = req.user.id;

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
      userId,
    ];

    // 检查是否已有该用户的供应商信息
    const [existingSupplier] = await db
      .promise()
      .query('SELECT id FROM suppliers WHERE user_id = ?', [userId]);

    let supplierId;

    if (existingSupplier.length > 0) {
      // 已有供应商信息，执行更新
      supplierId = existingSupplier[0].id;
      await db
        .promise()
        .query(
          'UPDATE suppliers SET company_name = ?, business_nature = ?, contact_name = ?, contact_phone = ?, mobile_phone = ?, country = ?, state = ?, city = ?, district = ?, landline = ?, fax = ?, email = ?, bank_account_name = ?, bank_name = ?, bank_account_number = ?, production_capacity = ?, advantage = ? WHERE user_id = ?',
          paramValues
        );

      // 删除旧的联系人信息
      await db
        .promise()
        .query('DELETE FROM contacts WHERE supplier_id = ?', [supplierId]);
    } else {
      // 没有供应商信息，执行插入
      const [result] = await db
        .promise()
        .query(
          'INSERT INTO suppliers (company_name, business_nature, contact_name, contact_phone, mobile_phone, country, state, city, district, landline, fax, email, bank_account_name, bank_name, bank_account_number, production_capacity, advantage, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          paramValues
        );

      supplierId = result.insertId; // 获取新插入的供应商ID
    }

    // 插入新的联系人信息
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

// 获取当前用户的供应商信息的函数
const getSupplierInfo = async (req, res) => {
  // 从认证中间件中获取用户 ID
  const userId = req.user.id;

  try {
    const [suppliers] = await db
      .promise()
      .query('SELECT * FROM suppliers WHERE user_id = ?', [userId]);

    if (suppliers.length === 0) {
      // 没有找到供应商信息，返回空对象
      return res.status(200).json(null);
    }

    const supplier = suppliers[0];

    const [contacts] = await db
      .promise()
      .query('SELECT * FROM contacts WHERE supplier_id = ?', [supplier.id]);

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
