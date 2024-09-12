const jwt = require('jsonwebtoken');

// 用户认证中间件
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');

    // 检查请求头中是否包含令牌
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // 验证令牌
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded;  // 在请求对象中附加解码后的用户信息
        next();  // 继续执行后续中间件或路由处理程序
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authenticateToken;
