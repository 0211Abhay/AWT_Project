require('dotenv').config();

module.exports = {
    database: process.env.DB_NAME || 'aj_awt_project',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

// sequelize.authenticate()
//     .then(() => console.log('MySQL Connected via Sequelize'))
//     .catch(err => console.error('MySQL Connection Failed:', err));

// module.exports = sequelize;

// "bcryptjs": "^2.4.3",
// "cors": "^2.8.5",
// "dotenv": "^16.4.7",
// "express": "^4.21.2",
// "jsonwebtoken": "^9.0.2",
// "mongoose": "^8.10.0",
// "multer": "^1.4.5-lts.1",
// "mysql2": "^3.12.0",
// "sequelize": "^6.37.5",