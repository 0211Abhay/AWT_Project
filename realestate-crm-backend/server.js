require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const sessionMiddleware = require('./config/session');
const authRoutes = require('./routes/auth');

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
        // Sync all models
        return sequelize.sync({ alter: true });
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
