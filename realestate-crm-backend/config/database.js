const { Sequelize } = require('sequelize');

// Log connection details
console.log('Database Configuration:');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Port: ${process.env.DB_PORT}`);
console.log(`Database: ${process.env.DB_NAME}`);
console.log(`Dialect: ${process.env.DB_DIALECT || 'postgres'}`);
console.log(`SSL Mode: ${process.env.DB_SSL_MODE}`);

let sequelize;

const dialect = process.env.DB_DIALECT || 'postgres';

if (process.env.DATABASE_URL) {
    console.log('Using database connection string');
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect,
        dialectOptions: {
            ssl: 
                ? { require: true, rejectUnauthorized: false }
                    : undefined,
            connectTimeout: 60000,
        },
        logging: console.log,
        pool: {
            max: 2,
            min: 0,
            acquire: 300000,
            idle: 10000,
        },
    });
} else {
    console.log('Using individual connection parameters');
    sequelize = new Sequelize({
        dialect,
        host: 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
        database: process.env.DB_NAME || 'defaultdb_fk4z',
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        logging: console.log,
        dialectOptions: {
            ssl: process.env.DB_SSL_MODE === 'REQUIRED'
                ? { require: true, rejectUnauthorized: false }
                : false,
            connectTimeout: 60000,
        },
        pool: {
            max: 2,
            min: 0,
            acquire: 300000,
            idle: 10000,
        },
    });
}

module.exports = { sequelize };
