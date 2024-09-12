const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 用户注册逻辑
const registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // 对密码进行加密
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 模拟用户存储（这里你将使用数据库）
        const user = { id: 1, username, password: hashedPassword };

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// 用户登录逻辑
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // 假设用户存在（这里你将使用数据库）
        const user = { id: 1, username, password: '$2b$10$...' }; // 示例

        // 检查密码
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // 生成JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser };
