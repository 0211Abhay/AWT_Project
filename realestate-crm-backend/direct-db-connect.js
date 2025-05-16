require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Get the path to the certificate file
const certPath = path.join(__dirname, 'sert', 'ca2.pem');

// Log connection details
console.log('Attempting direct connection to Aiven MySQL:');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Port: ${process.env.DB_PORT}`);
console.log(`Database: aj_awt_project`);
console.log(`Certificate Path: ${certPath}`);

// Create the connection with extensive options
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'aj_awt_project',
  ssl: process.env.DB_SSL_MODE === 'REQUIRED' ? {
    ca: fs.readFileSync(certPath),
    rejectUnauthorized: true
  } : false,
  connectTimeout: 120000, // 1 minute timeout
  debug: true, // Enable debugging
  trace: true,
  multipleStatements: true,
  dateStrings: true
});

// Handle connection events
connection.on('error', (err) => {
  console.error('MySQL connection error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    console.error('Database has too many connections.');
  }
  if (err.code === 'ECONNREFUSED') {
    console.error('Database connection was refused.');
  }
  if (err.code === 'ETIMEDOUT') {
    console.error('Database connection timed out. This could be due to network issues or firewall restrictions.');
  }
});

// Connect and query
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }

  console.log('Connected to the database successfully!');

  // Perform a test query
  connection.query('SHOW TABLES', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }

    console.log('Tables in the database:');
    console.log(results);

    // Close connection when done
    connection.end((err) => {
      if (err) {
        console.error('Error closing connection:', err);
        return;
      }
      console.log('Database connection closed successfully.');
    });
  });
});
