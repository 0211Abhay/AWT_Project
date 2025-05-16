const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Get the path to the certificate file
const certPath = path.join(__dirname, '..', 'sert', 'ca2.pem');

// Log connection details
console.log('Database Configuration:');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Port: ${process.env.DB_PORT}`);
console.log(`Database: ${process.env.DB_NAME}`);
console.log(`SSL Mode: ${process.env.DB_SSL_MODE}`);
console.log(`Certificate Path: ${certPath}`);

// Use DATABASE_URL if available, otherwise use individual parameters
let sequelize;

if (process.env.DATABASE_URL) {
    // Using connection string
    console.log('Using database connection string');
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                ca: fs.readFileSync(certPath),
                rejectUnauthorized: true
            },
            connectTimeout: 60000 // 1 minute
        },
        logging: console.log,
        pool: {
            max: 2,
            min: 0,
            acquire: 300000,
            idle: 10000
        }
    });
} else {
    // Using individual parameters
    console.log('Using individual connection parameters');
    sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME || 'aj_awt_project',
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        logging: console.log,
        dialectOptions: {
            ssl: process.env.DB_SSL_MODE === 'REQUIRED' ? {
                ca: fs.readFileSync(certPath),
                rejectUnauthorized: true
            } : false,
            connectTimeout: 60000 // 1 minute
        },
        pool: {
            max: 2,
            min: 0,
            acquire: 300000,
            idle: 10000
        }
    });
}

module.exports = { sequelize };
