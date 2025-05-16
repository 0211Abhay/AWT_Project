const { Sequelize } = require('sequelize');

// Always log connection details to help with troubleshooting
console.log('Initializing Sequelize connection:');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Port: ${process.env.DB_PORT}`);
console.log(`Database: ${process.env.DB_NAME}`);
console.log(`SSL Mode: ${process.env.DB_SSL_MODE}`);

// Create connection URL format for better reliability
const dbUrl = `mysql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
console.log('Connection string (password hidden):', dbUrl.replace(/:([^:@]+)@/, ':****@'));

// Create a more resilient Sequelize instance
const sequelize = new Sequelize(dbUrl, {
    dialect: 'mysql',
    logging: console.log,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false // Allow self-signed certificates for Aiven
        },
        connectTimeout: 180000, // 3 minute timeout for initial connection
        // Additional options to improve connection reliability
        dateStrings: true,
        typeCast: true,
        supportBigNumbers: true
    },
    pool: {
        max: 2, // Smaller pool size for cloud connections
        min: 0,
        acquire: 120000, // 2 minute acquisition timeout
        idle: 30000,    // 30 second idle timeout
        evict: 60000    // Run eviction every minute
    },
    retry: {
        max: 5,          // Retry connection up to 5 times
        backoffBase: 1000, // Start with 1 second delay
        backoffExponent: 1.5 // Increase delay by 1.5x each attempt
    },
    benchmark: true, // Log query execution time for performance monitoring
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED // More reliable isolation level
});

module.exports = { sequelize };
