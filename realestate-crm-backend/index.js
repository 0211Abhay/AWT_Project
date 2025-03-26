
// const express = require('express');
// const cors = require('cors');
// const session = require('express-session');
// const { sequelize } = require('./models'); // Ensure Sequelize instance is correctly imported
// const authRoutes = require('./routes/auth');
// const clientRoutes = require('./routes/client_routes');
// const Client = require('./models/clients_model')(sequelize); // Import Client model
// const Broker = require('./models/broker')(sequelize); // Import Broker model

// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Session configuration
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'your-secret-key',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: process.env.NODE_ENV === 'production',
//         httpOnly: true,
//         maxAge: 24 * 60 * 60 * 1000, // 24 hours
//         sameSite: 'lax'
//     }
// }));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/client', clientRoutes);  // Added client routes

// // Test route
// app.get('/', (req, res) => {
//     res.json({ message: 'Real Estate CRM API is running' });
// });

// const PORT = process.env.PORT || 5001;

// // Database connection and model sync
// const startServer = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('Database connected successfully');

//         // ✅ Sync models with the database
//         await sequelize.sync({ alter: true }); // Creates or updates tables automatically

//         app.listen(PORT, () => {
//             console.log(`Server running on port ${PORT}`);
//         });
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//         process.exit(1);
//     }
// };

// startServer();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { sequelize, Client, Broker } = require('./models'); // Import models properly
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/client_routes');

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session configuration
app.use(session({
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Real Estate CRM API is running' });
});

const PORT = process.env.PORT || 5001;

// Database connection and model sync
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');

        // ✅ Sync models with the database
        await sequelize.sync({ alter: true }); // Creates or updates tables automatically

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
};

startServer();
