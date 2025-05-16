require('dotenv').config();

// Load environment variables into constants
const NODE_ENV = process.env.NODE_ENV || 'development';

// Log the configuration
console.log('Database Configuration:');
console.log('Environment:', NODE_ENV);
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Port: ${process.env.DB_PORT}`);
console.log(`Database: ${process.env.DB_NAME}`);
console.log(`Username: ${process.env.DB_USER}`);

// Sequelize configuration object - using the working configuration from direct-pg-test.js
const sequelizeConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        },
        connectTimeout: 10000,
        dateStrings: true,
        supportBigNumbers: true
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
};

module.exports = sequelizeConfig;
