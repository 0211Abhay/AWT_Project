require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production' || true;

// Log the configuration to help troubleshoot
console.log('Database Configuration:');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('Database:', process.env.DB_NAME);
console.log('Dialect:', process.env.DB_DIALECT || 'postgres');
console.log('SSL Mode:', process.env.DB_SSL_MODE);

module.exports = {
    database: process.env.DB_NAME || 'defaultdb_fk4z',
    username: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'dpg-d0je7iu3jp1c739qus70-a',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: console.log, // Enable logging for troubleshooting
    dialectOptions: {
        ssl: process.env.DB_SSL_MODE === 'REQUIRED' ? {
            require: true,
            rejectUnauthorized: false
        } : false,
        connectTimeout: 120000, // Increase timeout to 2 minutes for cloud connections
        // These options help with connection troubles
        dateStrings: true,
        supportBigNumbers: true
    },
    pool: {
        max: 3, // Reduce pool size for cloud environments
        min: 0,
        acquire: 120000, // Increase acquisition timeout
        idle: 30000, // Increase idle timeout
        evict: 60000 // Run cleanup every minute
    },
    retry: {
        max: 5, // Retry connection up to 5 times
        timeout: 60000 // Overall timeout for connection attempts
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