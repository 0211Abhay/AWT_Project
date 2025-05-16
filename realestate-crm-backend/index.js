

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

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
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session configuration
app.use(session({
    store: new pgSession({
        conObject: {
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.DB_SSL_MODE === 'true' ? { rejectUnauthorized: false } : undefined
        },
        tableName: 'session'
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

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/client', clientRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/rental', rentalRoutes);
app.use('/api/payment', rentPaymentRoutes);

app.use('/api/auth/google', googleAuthRoutes);


// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Real Estate CRM API is running' });
});

// Database connection and model sync
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Sync all models
        await sequelize.sync();
        console.log('Database models synchronized successfully.');

        // Create session table if it doesn't exist
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS "session" (
                "sid" varchar NOT NULL COLLATE "default",
                "sess" json NOT NULL,
                "expire" timestamp(6) NOT NULL,
                CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
            )
        `);

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
