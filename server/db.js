const mysql = require('mysql2');

// 创建数据库连接
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '1031', 
    database: 'vendor_management'
});

// 连接到数据库
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Database!');
});

module.exports = connection;
