const express = require('express');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const MySQLStore = require('express-mysql-session')(session);

const { sequelize, Client, Broker, Property } = require('./models'); // Import models properly
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/client_routes');
const propertyRoutes = require('./routes/property_routes');
const scheduleRoutes = require('./routes/schedule_routes');
const rentalRoutes = require('./routes/rental_routes');
const rentPaymentRoutes = require('./routes/rent_payment_routes');

const passport = require('passport');

const googleAuthRoutes = require('./routes/google_auth');

require('dotenv').config();
require('./config/passport'); // Import Passport Google strategy

const app = express();

// Middleware
// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: ['https://estatemate2.onrender.com', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session configuration
app.use(session({
    store: new MySQLStore({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSL_MODE === 'true' ? { rejectUnauthorized: false } : undefined,
        createDatabaseTable: true,
        schema: {
            tableName: 'sessions',
            columnNames: {
                session_id: 'sid',
                expires: 'expire',
                data: 'sess'
            }
        }
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
    }
}));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// API documentation route
app.get('/', (req, res) => {
    res.json({
        message: 'Real Estate CRM API',
        version: '1.0',
        endpoints: {
            auth: '/api/auth/*',
            client: '/api/client/*',
            property: '/api/property/*',
            schedule: '/api/schedule/*',
            rental: '/api/rental/*',
            payment: '/api/payment/*',
            google: '/api/auth/google/*'
        }
    });
});

// API health check
app.get('/api', (req, res) => {
    res.json({
        status: 'healthy',
        message: 'Real Estate CRM API is running',
        timestamp: new Date().toISOString()
    });
});

// Routes with /api prefix
app.use('/api/auth/google', googleAuthRoutes); // Google auth should be before general auth
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/rental', rentalRoutes);
app.use('/api/payment', rentPaymentRoutes);

// Error handling for 404
app.use((req, res, next) => {
    console.log(`404 - Not Found: ${req.method} ${req.url}`);
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.url}`,
        requestedUrl: req.url,
        method: req.method,
        timestamp: new Date().toISOString(),
        availableRoutes: [
            '/api/auth/google/*',
            '/api/auth/*',
            '/api/client/*',
            '/api/property/*',
            '/api/schedule/*',
            '/api/rental/*',
            '/api/payment/*'
        ],
        suggestion: 'Make sure you are using the correct HTTP method and including the /api prefix'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Database connection and model sync
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Sync all models
        await sequelize.sync();
        console.log('Database models synchronized successfully.');

        // Session table will be created automatically by express-mysql-session

        const PORT = process.env.PORT || 10000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
};

startServer();
