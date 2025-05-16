const { Sequelize } = require('sequelize');

// Determine the environment
const isProduction = process.env.NODE_ENV === 'production' || true; // Default to production behavior

// For local development
let sequelize;

if (isProduction) {
    // Create MySQL connection URL format
    const dbUrl = `mysql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    console.log('Connecting with URL (password hidden):', dbUrl.replace(/:([^:@]+)@/, ':****@'));
    
    sequelize = new Sequelize(dbUrl, {
        dialect: 'mysql',
        logging: console.log, // Keep logging on for troubleshooting
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false // Allow self-signed certs
            },
            connectTimeout: 60000 // Long timeout for cloud DB
        },
        pool: {
            max: 2, // Reduce connection pool size for cloud
            min: 0,
            acquire: 60000,
            idle: 30000
        },
        retry: {
            max: 3 // Add retry capability
        }
    });
} else {
    // Local development config - fallback
    sequelize = new Sequelize(
        process.env.DB_NAME || 'aj_awt_project',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || '',
        {
            host: 'localhost',
            port: 3306,
            dialect: 'mysql',
            logging: console.log
        }
    );
}

module.exports = { sequelize };
