require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const app = express();
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Real Estate CRM API is running' });
});

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    // First test direct MySQL connection
    console.log('Testing direct MySQL connection...');
    console.log('Host:', process.env.DB_HOST);
    console.log('Port:', process.env.DB_PORT);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL_MODE === 'REQUIRED' ? {
        rejectUnauthorized: false
      } : false,
      connectTimeout: 10000,
    });

    console.log('✅ Direct MySQL connection successful!');

    const [rows] = await connection.execute('SHOW TABLES');
    console.log('Tables in database:', rows);
    await connection.end();

    // Now try Sequelize
    console.log('\nTesting Sequelize connection...');
    const sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: console.log,
        dialectOptions: {
          ssl: {
            rejectUnauthorized: false
          },
          connectTimeout: 60000
        },
        pool: {
          max: 5,
          min: 0,
          acquire: 60000,
          idle: 20000
        }
      }
    );

    await sequelize.authenticate();
    console.log('✅ Sequelize connection authenticated successfully!');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error during startup:', error);
  }
}

startServer();
