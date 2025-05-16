require('dotenv').config();
const mysql = require('mysql2/promise');

// Log all connection parameters (except password)
console.log('Attempting to connect with these parameters:');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('Database:', process.env.DB_NAME);
console.log('User:', process.env.DB_USER);
console.log('SSL Mode:', process.env.DB_SSL_MODE);

async function testConnection() {
  try {
    console.log('Creating connection...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL_MODE === 'REQUIRED' ? {
        rejectUnauthorized: false
      } : false,
      connectTimeout: 10000, // 10 second timeout
    });
    
    console.log('Connection established successfully!');
    console.log('Running test query...');
    
    const [rows] = await connection.execute('SHOW TABLES');
    console.log('Tables in database:', rows);
    
    await connection.end();
    console.log('Connection closed');
  } catch (error) {
    console.error('Connection error:', error);
  }
}

testConnection();
