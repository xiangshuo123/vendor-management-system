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
    const [suppliers] = await db.promise().query('SELECT id FROM suppliers WHERE user_id = ?', [userId]);

    if (suppliers.length === 0) {
      return res.status(400).json({ message: 'Supplier not found for the current user.' });
    }

    const supplierId = suppliers[0].id;

    // 检查是否已存在资质信息
    const [existingQualifications] = await db.promise().query('SELECT id FROM qualifications WHERE supplier_id = ?', [supplierId]);

    let qualificationId;

    if (existingQualifications.length > 0) {
      // 已存在，执行更新操作
      qualificationId = existingQualifications[0].id;
      await db.promise().query(
        'UPDATE qualifications SET qualification_type = ?, company_establishment_date = ?, registered_capital = ?, total_employees = ?, company_area = ? WHERE id = ?',
        [
          qualification_type || null,
          company_establishment_date || null,
          registered_capital || null,
          total_employees || null,
          company_area || null,
          qualificationId,
        ]
      );

      // 删除旧的文件信息
      await db.promise().query('DELETE FROM qualification_files WHERE qualification_id = ?', [qualificationId]);
    } else {
      // 不存在，执行插入操作
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
      qualificationId = result.insertId; // 获取新插入的资质ID
    }

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

// 获取资质信息
const getQualificationInfo = async (req, res) => {
  try {
    // 获取当前用户的 user_id
    const userId = req.user.id;

    // 根据 user_id 获取 supplier_id
    const [suppliers] = await db.promise().query('SELECT id FROM suppliers WHERE user_id = ?', [userId]);

    if (suppliers.length === 0) {
      return res.status(400).json({ message: 'Supplier not found for the current user.' });
    }

    const supplierId = suppliers[0].id;

    // 从 qualifications 表中获取资质信息
    const [qualifications] = await db.promise().query('SELECT * FROM qualifications WHERE supplier_id = ?', [supplierId]);

    if (qualifications.length === 0) {
      return res.status(200).json(null); // 没有资质信息，返回 null
    }

    const qualification = qualifications[0];

    // 获取关联的文件信息
    const [files] = await db.promise().query('SELECT * FROM qualification_files WHERE qualification_id = ?', [qualification.id]);

    // 将文件信息按照文件类型分类
    const filesByType = {};
    files.forEach(file => {
      if (!filesByType[file.file_type]) {
        filesByType[file.file_type] = [];
      }
      filesByType[file.file_type].push(file);
    });

    // 将文件信息添加到资质信息中
    qualification.files = filesByType;

    res.status(200).json(qualification);
  } catch (error) {
    console.error('Error fetching qualification information:', error);
    res.status(500).json({ message: 'Error fetching qualification information.', error: error.message });
  }
};

module.exports = {
  saveQualificationInfo,
  uploadFields,
  getQualificationInfo,
};
