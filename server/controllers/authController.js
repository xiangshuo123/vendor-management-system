// authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');  // 引入数据库连接
const nodemailer = require('nodemailer');

// 用户注册逻辑
const registerUser = async (req, res) => {
  const { username, email, password, phone, role, companyName, accountHolder } = req.body;

  try {
    // 检查用户是否已存在
    const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: '用户已存在' });
    }

    // 插入公司信息
    const [companyResult] = await db.promise().query(
      'INSERT INTO companies (company_name, account_holder) VALUES (?, ?)',
      [companyName, accountHolder]
    );

    const companyId = companyResult.insertId;

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入用户信息
    await db.promise().query(
      'INSERT INTO users (username, email, password, phone, role, company_id, is_main_account) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, phone, role, companyId, true]
    );

    res.status(201).json({ message: '注册成功！' });
  } catch (err) {
    console.error('Error in user registration:', err);
    res.status(500).json({ message: 'Server error during registration. Please try again later.' });
  }
};


// 用户登录逻辑
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // 检查用户是否存在
    const [results] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = results[0];

    // 检查密码是否匹配
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 生成JWT令牌
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 获取用户信息
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // 获取用户信息
    const [users] = await db.promise().query(
      'SELECT u.id, u.username, u.email, u.phone, u.role, u.is_main_account, u.company_id, u.created_at AS registration_date, c.company_name, c.account_holder FROM users u LEFT JOIN companies c ON u.company_id = c.id WHERE u.id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    let userInfo = users[0];

    // 确保 is_main_account 有值
    let isMainAccount = 1; // 默认为母账号

    if (userInfo.is_main_account !== null && userInfo.is_main_account !== undefined) {
      isMainAccount = parseInt(userInfo.is_main_account);
      if (isNaN(isMainAccount)) {
        isMainAccount = 1; // 如果解析结果为 NaN，则设为母账号
      }
    } else {
      // 如果 is_main_account 为 null 或 undefined，则设为母账号
      isMainAccount = 1;
    }

    // 如果用户是子账号，获取母账号信息
    if (isMainAccount === 0) {
      const [mainAccount] = await db.promise().query(
        'SELECT u.id, u.username, u.email, u.phone, u.role, u.is_main_account, u.company_id, u.created_at AS registration_date, c.company_name, c.account_holder FROM users u LEFT JOIN companies c ON u.company_id = c.id WHERE u.company_id = ? AND u.is_main_account = 1 LIMIT 1',
        [userInfo.company_id]
      );

      if (mainAccount.length > 0) {
        userInfo = mainAccount[0];
      } else {
        return res.status(404).json({ message: 'Main account not found' });
      }
    }

    // 将 is_main_account 转换为布尔值
    userInfo.is_main_account = isMainAccount === 1 ? true : false;

    res.json(userInfo);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error while fetching user profile. Please try again later.' });
  }
};

// 更新用户信息
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, phone, account_holder, password, role } = req.body;

    if (username) {
      await db.promise().query('UPDATE users SET username = ? WHERE id = ?', [username, userId]);
    }

    if (email) {
      await db.promise().query('UPDATE users SET email = ? WHERE id = ?', [email, userId]);
    }

    if (phone) {
      await db.promise().query('UPDATE users SET phone = ? WHERE id = ?', [phone, userId]);
    }

    if (account_holder) {
      const [user] = await db.promise().query('SELECT company_id FROM users WHERE id = ?', [userId]);
      const companyId = user[0].company_id;
      await db.promise().query('UPDATE companies SET account_holder = ? WHERE id = ?', [account_holder, companyId]);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.promise().query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    }

    if (role) {
      await db.promise().query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
    }

    res.json({ message: 'Profile updated successfully!' });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Server error while updating profile. Please try again later.' });
  }
};

// 获取子账号列表
const getSubAccounts = async (req, res) => {
  try {
    const userId = req.user.id;

    // 确认用户是母账号
    const [users] = await db.promise().query('SELECT is_main_account, company_id FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(403).json({ message: 'Access denied: User not found' });
    }

    const isMainAccount = parseInt(users[0].is_main_account);

    if (isMainAccount !== 1) {
      return res.status(403).json({ message: 'Access denied: Only main accounts can access sub-accounts' });
    }

    const companyId = users[0].company_id;

    // 获取子账号
    const [subAccounts] = await db.promise().query(
      'SELECT id, username, email, phone, role, created_at FROM users WHERE company_id = ? AND is_main_account = 0',
      [companyId]
    );

    res.json(subAccounts);
  } catch (err) {
    console.error('Error fetching sub-accounts:', err);
    res.status(500).json({ message: 'Server error while fetching sub-accounts. Please try again later.' });
  }
};

// 注册子账号
const registerSubAccount = async (req, res) => {
  const { username, password, email } = req.body;
  const userId = req.user.id;

  try {
    // 确认用户是母账号
    const [users] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(403).json({ message: 'Access denied: User not found' });
    }

    const isMainAccount = parseInt(users[0].is_main_account);

    if (isMainAccount !== 1) {
      return res.status(403).json({ message: 'Access denied: Only main accounts can create sub-accounts' });
    }

    const companyId = users[0].company_id;
    const parentEmail = users[0].email; // 母账号的邮箱

    // 检查用户名或邮箱是否已存在
    const [userCheck] = await db.promise().query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (userCheck.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 如果未提供 email，使用母账号的 email
    const subAccountEmail = email || parentEmail;

    // 插入子账号，设置 is_main_account 为 0（子账号）
    await db.promise().query(
      'INSERT INTO users (username, email, password, role, company_id, is_main_account) VALUES (?, ?, ?, ?, ?, ?)',
      [username, subAccountEmail, hashedPassword, 'sales', companyId, 0]
    );

    res.status(201).json({ message: 'Sub-account created successfully!' });
  } catch (err) {
    console.error('Error creating sub-account:', err);
    res.status(500).json({ message: 'Server error during sub-account creation. Please try again later.' });
  }
};


// 忘记密码
const forgotPassword = (req, res) => {
  const { email } = req.body;

  // 检查用户是否存在
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // 生成JWT重置令牌

    // 设置邮件发送选项
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // 使用Gmail服务
      auth: {
        user: process.env.EMAIL_USER,  // 你的Gmail地址
        pass: process.env.EMAIL_PASS,  // 应用程序密码
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,  // 邮件发送者地址
      to: email,  // 邮件接收者
      subject: 'Password Reset',  // 邮件主题
      text: `Click the link to reset your password: http://localhost:3000/reset-password/${token}`,  // 邮件内容
    };

    // 发送邮件
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Failed to send email. Please try again later.' });
      }
      res.json({ message: 'Password reset link sent to your email.' });
    });
  });
};

// 重置密码
const resetPassword = (req, res) => {
  const { token } = req.params; // 从URL参数中获取重置令牌
  const { newPassword } = req.body;

  // 验证JWT令牌
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    const userId = decoded.id;

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新用户密码
    db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'Password reset successfully!' });
    });
  });
};

// 导出控制器函数
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getSubAccounts,
  registerSubAccount,
  forgotPassword,
  resetPassword,
};
