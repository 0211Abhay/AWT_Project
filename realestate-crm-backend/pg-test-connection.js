require('dotenv').config();
const { Sequelize } = require('sequelize');

// Create a PostgreSQL connection instance
console.log('Testing PostgreSQL connection to Render...');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Port: ${process.env.DB_PORT}`);
console.log(`Database: ${process.env.DB_NAME}`);
console.log(`Username: ${process.env.DB_USER}`);

// Create a connection using DATABASE_URL if available
const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        },
        connectTimeout: 120000
      },
      logging: console.log
    })
  : new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        },
        connectTimeout: 120000
      },
      logging: console.log
    });

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection to PostgreSQL has been established successfully.');
    
    // Get a list of all tables
    const [results] = await sequelize.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
    console.log('Available tables:');
    console.log(results);
    
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the PostgreSQL database:', error);
    return false;
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

testConnection();
