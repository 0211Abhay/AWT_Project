require('dotenv').config();
const { Client } = require('pg');

console.log('Testing direct PostgreSQL connection to Render...');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Port: ${process.env.DB_PORT}`);
console.log(`Database: ${process.env.DB_NAME}`);
console.log(`Username: ${process.env.DB_USER}`);

// Connection configuration
const connectionConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
};

// Create a client
const client = new Client(connectionConfig);

// Connect and run a test query
async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully!');

    // Run a test query
    const res = await client.query('SELECT current_database() as db, current_user as user');
    console.log('Connection information:');
    console.log(res.rows[0]);

    // List tables
    const tables = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );

    console.log('Tables in database:');
    if (tables.rows.length === 0) {
      console.log('No tables found');
    } else {
      tables.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }

    return true;
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err);
    return false;
  } finally {
    // Close the client
    await client.end();
    console.log('Database connection closed.');
  }
}

// Run the test
testConnection();
