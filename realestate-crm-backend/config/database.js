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

// Create a more resilient Sequelize instance with extreme timeouts for cloud environments
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'aj_awt_project', // Hardcoded as requested by user
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: console.log,
    dialectOptions: {
        ssl: process.env.DB_SSL_MODE === 'REQUIRED' ? {
            rejectUnauthorized: false, // Allow self-signed certificates for Aiven
            ca: null // Skip CA verification in cloud environments
        } : false,
        connectTimeout: 300000, // 5 minute timeout for initial connection
        // Additional options to improve connection reliability
        dateStrings: true,
        typeCast: true,
        supportBigNumbers: true,
        charset: 'utf8mb4',
        // Debug options for network issues
        trace: true, // Enable protocol trace
        multipleStatements: true,
        flags: [
            // Reducing server-side timeouts
            '-FOUND_ROWS',
            '+IGNORE_SPACE',
            '+NO_ENGINE_SUBSTITUTION'
        ]
    },
    pool: {
        max: 2, // Smaller pool size for cloud connections
        min: 0,
        acquire: 300000, // 5 minute acquisition timeout
        idle: 10000,    // 10 second idle timeout
        evict: 30000,   // Run eviction every 30 seconds
        handleDisconnects: true // Auto-handle disconnects
    },
    retry: {
        max: 10,          // Retry connection up to 10 times
        backoffBase: 3000, // Start with 3 second delay
        backoffExponent: 1.5, // Increase delay by 1.5x each attempt
        timeout: 600000 // 10 minute total timeout for retries
    },
    // Performance and reliability settings
    benchmark: true, // Log query execution time for performance monitoring
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED, // More reliable isolation level
    keepDefaultTimezone: true,
    timezone: '+00:00', // Use UTC consistently
    // Connection validation
    validate: {
        validateConnection: true // Validate connection on acquire
    }
});

module.exports = { sequelize };
