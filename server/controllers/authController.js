const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');  // 引入数据库连接

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

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };