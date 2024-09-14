const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');  // 引入数据库连接
const nodemailer = require('nodemailer');

// 注册用户
const registerUser = async (req, res) => {
  const { username, email, password, phone, role, company_name, account_holder } = req.body;

  try {
    // 检查用户是否已存在
    const [userCheck] = await db.promise().query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (userCheck.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // 检查公司是否已存在
    const [companyCheck] = await db.promise().query('SELECT * FROM companies WHERE company_name = ?', [company_name]);
    let companyId;

    if (companyCheck.length > 0) {
      companyId = companyCheck[0].id; // 使用已存在的公司ID
    } else {
      // 插入公司信息
      const [companyResult] = await db.promise().query(
        'INSERT INTO companies (company_name, account_holder) VALUES (?, ?)',
        [company_name, account_holder]
      );
      companyId = companyResult.insertId; // 获取新插入的公司ID
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入用户信息
    await db.promise().query(
      'INSERT INTO users (username, email, password, phone, role, company_id) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, phone, role, companyId]
    );

    res.status(201).json({ message: 'User and company registered successfully!' });
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
      db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
          if (err) return res.status(500).json({ message: 'Database error' });

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
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};


/// 获取用户信息
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await db.promise().query(
      'SELECT u.id, u.username, u.email, u.phone, u.role, u.created_at AS registration_date, c.company_name, c.account_holder FROM users u LEFT JOIN companies c ON u.company_id = c.id WHERE u.id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
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
    forgotPassword,
    resetPassword,
  };