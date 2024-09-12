const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');  // 引入数据库连接
const nodemailer = require('nodemailer');

// 用户注册逻辑
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // 检查用户名或邮箱是否已存在
        db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });

            if (results.length > 0) {
                return res.status(400).json({ message: 'Username or email already exists' });
            }

            // 对密码进行加密
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // 插入新用户到数据库
            db.query(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword],
                (err, results) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database error', error: err });
                    }
                    res.status(201).json({ message: 'User registered successfully' });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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

// 获取用户信息
const getUserProfile = (req, res) => {
    const userId = req.user.id;  // 从已认证的请求中获取用户ID

    db.query('SELECT id, username, email FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(results[0]);  // 返回用户信息
    });
};

// 更新用户信息
const updateUserProfile = (req, res) => {
    const userId = req.user.id;  // 从已认证的请求中获取用户ID
    const { username, email } = req.body;

    // 更新数据库中的用户信息
    db.query(
        'UPDATE users SET username = ?, email = ? WHERE id = ?',
        [username, email, userId],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error' });

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'User profile updated successfully' });
        }
    );
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