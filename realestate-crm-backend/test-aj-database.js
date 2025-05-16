require('dotenv').config();
const mysql = require('mysql2/promise');

// Log all connection parameters for debugging
console.log('Connection Parameters:');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('Database:', process.env.DB_NAME); // Should be aj_awt_project
console.log('User:', process.env.DB_USER);
console.log('SSL Mode:', process.env.DB_SSL_MODE);

async function testConnection() {
  let connection;
  try {
    console.log('Attempting connection to database "aj_awt_project"...');
    
    // Try connecting with longer timeout
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'aj_awt_project', // Hard-coded to aj_awt_project
      ssl: process.env.DB_SSL_MODE === 'REQUIRED' ? {
        rejectUnauthorized: false
      } : false,
      connectTimeout: 60000, // Longer timeout for Render
    });
    
    console.log('✅ Connection successful to "aj_awt_project"!');
    console.log('Running test query...');
    
    const [rows] = await connection.execute('SHOW TABLES');
    console.log('Tables in database:', rows);
    
    await connection.end();
    console.log('Connection closed');
    
    return true;
  } catch (error) {
    console.error('Connection error:', error);
    if (connection) await connection.end();
    return false;
  }
}

// Run the test
testConnection().then(success => {
  console.log('Test complete. Success:', success);
  process.exit(success ? 0 : 1);
});
