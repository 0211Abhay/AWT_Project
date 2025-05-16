const express = require('express');
const cors = require('cors');
const session = require('express-session');

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
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
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

// Mount Google auth routes directly instead of nesting them
// This prevents path conflicts with the callback URL
app.use('/api/auth/google', googleAuthRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Real Estate CRM API is running' });
});

const PORT = process.env.PORT;

// Database connection and model sync
const startServer = async () => {
    try {
console.log({
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT
});

        await sequelize.authenticate();
        console.log('✅ Database connected successfully');

        // ✅ Sync models with the database
        // Using { force: false } to avoid altering existing tables
        // This prevents the 'Too many keys' error
        await sequelize.sync({ force: false });

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
};

startServer();
