const { Sequelize } = require('sequelize');
require('dotenv').config();
const fs = require('fs')
const path = require('path')

const sequelize = new Sequelize(
    process.env.DB_NAME,                 // database
    process.env.DB_USER,                 // username
    process.env.DB_PASSWORD,             // password
    {
        host: process.env.DB_HOST,         // e.g. mysql-XYZ.aivencloud.com
        port: +process.env.DB_PORT,        // e.g. 18669
        dialect: 'mysql',                  // MUST be 'mysql'
        logging: console.log,
        dialectOptions: {
            ssl: {
                ca: fs.readFileSync(path.resolve(__dirname, '../sert/ca2.pem')),
                rejectUnauthorized: true
            },
            connectTimeout: 120000
        },
        pool: { max: 3, min: 0, idle: 30000 }
    }
);
