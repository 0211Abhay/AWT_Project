require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');

// Import routes
const authRoutes = require('./routes/auth');
const rentalRoutes = require('./routes/rental_routes');
const rentPaymentRoutes = require('./routes/rent_payment_routes');
const clientRoutes = require('./routes/client_routes');
const propertyRoutes = require('./routes/property_routes');
const scheduleRoutes = require('./routes/schedule_routes');
const googleAuthRoutes = require('./routes/google_auth');

// Import passport configuration
require('./config/passport');

const app = express();

// Import the sequelize instance from the config file
const { sequelize } = require('./config/database');

// Test database connection
sequelize.authenticate()
    .then(() => {
        console.log('Connected to MySQL database');
        // Sync all models with enhanced alter options
        return sequelize.sync({
            alter: true,
            logging: console.log,
            // Force column adjustments for varchar fields
            hooks: {
                beforeSync: () => {
                    console.log('Altering tables to match models...');
                }
            }
        });
    })
    .then(() => console.log('Database synchronized'))
    .catch(err => console.error('Database connection error:', err));

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        // Update with all possible frontend origins
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000',
            'https://estatemate2.onrender.com',
            'https://estatemate-2207.onrender.com'
        ];
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            // Allow the request but log it for debugging
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Enable CORS pre-flight for all routes
app.options('*', cors());

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
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
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

// Routes
app.use('/api/auth/google', googleAuthRoutes); // Google auth should be before general auth
app.use('/api/auth', authRoutes);
app.use('/api/rental', rentalRoutes);
app.use('/api/payment', rentPaymentRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/schedule', scheduleRoutes);

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

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
