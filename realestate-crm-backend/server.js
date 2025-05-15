require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const sessionMiddleware = require('./config/session');
const authRoutes = require('./routes/auth');
const rentalRoutes = require('./routes/rental_routes');
const rentPaymentRoutes = require('./routes/rent_payment_routes');
const clientRoutes = require('./routes/client_routes');
const propertyRoutes = require('./routes/property_routes');
const scheduleRoutes = require('./routes/schedule_routes');

const app = express();

// Initialize Sequelize with MySQL
const sequelize = new Sequelize(
    process.env.DB_NAME || 'aj_awt_project',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false
    }
);

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

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(sessionMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rental', rentalRoutes);
app.use('/api/payment', rentPaymentRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/schedule', scheduleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
