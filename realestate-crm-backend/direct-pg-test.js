require('dotenv').config();
const { Client } = require('pg');

console.log('Testing direct PostgreSQL connection to Render...');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Port: ${process.env.DB_PORT}`);
console.log(`Database: ${process.env.DB_NAME}`);
console.log(`Username: ${process.env.DB_USER}`);
require('./controller/client_controller')
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

// Connect and create broker table
async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully!');

    // Create brokers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS brokers (
        broker_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Brokers table created or already exists');

    // Insert a test broker
    const testBroker = {
      name: 'Test Broker',
      email: 'test@example.com',
      password_hash: 'hashedpassword123', // In production, use proper password hashing
      phone: '1234567890'
    };

    const insertResult = await client.query(`
      INSERT INTO brokers (name, email, password_hash, phone)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
      RETURNING *
    `, [testBroker.name, testBroker.email, testBroker.password_hash, testBroker.phone]);

    if (insertResult.rows.length > 0) {
      console.log('✅ Test broker inserted:', insertResult.rows[0]);
    } else {
      console.log('ℹ️ Test broker already exists');
    }

    // List all brokers
    const brokers = await client.query('SELECT * FROM brokers');
    console.log('\nCurrent brokers in database:');
    console.table(brokers.rows);

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    // Close the client
    await client.end();
    console.log('Database connection closed.');
  }
}

// Run the test
testConnection();
