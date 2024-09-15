const db = require('../db');
const multer = require('multer');
const path = require('path');

// 设置 multer 用于文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 设置文件上传目录
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // 设置文件名
  },
});

const upload = multer({ storage: storage });

const uploadFields = upload.fields([
  { name: 'business_license', maxCount: 1 },
  { name: 'production_safety_certificate', maxCount: 1 },
  { name: 'hazardous_production_license', maxCount: 1 },
  { name: 'other_documents', maxCount: 1 },
]);

// 保存资质信息和文件
const saveQualificationInfo = async (req, res) => {
  console.log('Received data:', req.body);

  const {
    qualification_type,
    company_establishment_date,
    registered_capital,
    total_employees,
    company_area,
  } = req.body;

  try {
    // 获取当前用户的 user_id
    const userId = req.user.id;

    // 根据 user_id 获取 supplier_id
    const [suppliers] = await db
      .promise()
      .query('SELECT id FROM suppliers WHERE user_id = ?', [userId]);

    if (suppliers.length === 0) {
      return res.status(400).json({ message: 'Supplier not found for the current user.' });
    }

    const supplierId = suppliers[0].id;

    // 插入资质信息到 qualifications 表
    const [result] = await db.promise().query(
      'INSERT INTO qualifications (supplier_id, qualification_type, company_establishment_date, registered_capital, total_employees, company_area) VALUES (?, ?, ?, ?, ?, ?)',
      [
        supplierId,
        qualification_type || null,
        company_establishment_date || null,
        registered_capital || null,
        total_employees || null,
        company_area || null,
      ]
    );

    console.log('Qualification inserted:', result);

    const qualificationId = result.insertId; // 获取新插入的资质ID

    // 处理文件上传
    const fileFields = [
      'business_license',
      'production_safety_certificate',
      'hazardous_production_license',
      'other_documents',
    ];
    for (const field of fileFields) {
      if (req.files && req.files[field]) {
        for (const file of req.files[field]) {
          await db.promise().query(
            'INSERT INTO qualification_files (qualification_id, file_type, file_name, file_path) VALUES (?, ?, ?, ?)',
            [qualificationId, field, file.originalname, file.path]
          );
          console.log(`File uploaded for ${field}:`, file.originalname);
        }
      }
    }

    res
      .status(200)
      .json({ message: 'Qualification information and files saved successfully!' });
    } catch (error) {
      console.error('Error saving qualification information:', error);
      res.status(500).json({
        message: 'Error saving qualification information.',
        error: error.message, // 返回错误信息
      });
    }
};



module.exports = {
  saveQualificationInfo,
  uploadFields,
};
