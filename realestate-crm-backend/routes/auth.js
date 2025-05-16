const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Broker } = require('../models');
const { isAuthenticated } = require('../middleware/auth');
const passport = require('passport');

// Register new broker
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if broker already exists
        const existingBroker = await Broker.findOne({ where: { email } });
        if (existingBroker) {
            return res.status(400).json({ message: 'Broker already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new broker
        const broker = await Broker.create({
            name,
            email,
            phone,
            password_hash: hashedPassword
        });

        // Set session
        req.session.brokerId = broker.broker_id;

        // Send broker data (excluding password)
        const brokerData = {
            id: broker.broker_id,
            name: broker.name,
            email: broker.email,
            phone: broker.phone
        };

        res.status(201).json({ message: 'Broker registered successfully', broker: brokerData });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const broker = await Broker.findOne({ where: { email } });

        if (!broker) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, broker.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Set session data
        req.session.brokerId = broker.broker_id;

        // Send broker data without sensitive information
        const { password_hash, ...brokerData } = broker.toJSON();
        res.json({
            message: 'Login successful',
            broker: brokerData
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Check authentication status
router.get('/check', async (req, res) => {
    try {
        if (!req.session.brokerId) {
            return res.json({ authenticated: false });
        }

        const broker = await Broker.findByPk(req.session.brokerId);
        if (!broker) {
            return res.json({ authenticated: false });
        }

        const { password_hash, ...brokerData } = broker.toJSON();
        res.json({
            authenticated: true,
            broker: brokerData
        });
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({ message: 'Server error during auth check' });
    }
});

// Logout route
router.post('/logout', isAuthenticated, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Error during logout' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
});

// Get Broker Profile
router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const brokerId = req.session.brokerId;

        // Find broker by ID
        const broker = await Broker.findByPk(brokerId);
        if (!broker) {
            return res.status(404).json({ success: false, message: 'Broker not found' });
        }

        const { password_hash, ...brokerData } = broker.toJSON();
        res.json({
            success: true,
            broker: brokerData
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Update Broker Profile
router.put('/profile', isAuthenticated, async (req, res) => {
    try {
        const brokerId = req.session.brokerId;
        const { name, email, phone } = req.body;

        // Find broker by ID
        const broker = await Broker.findByPk(brokerId);
        if (!broker) {
            return res.status(404).json({ success: false, message: 'Broker not found' });
        }

        // Check if email is being changed and if it's already in use
        if (email !== broker.email) {
            const existingBroker = await Broker.findOne({ where: { email } });
            if (existingBroker) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
        }

        // Update broker
        broker.name = name || broker.name;
        broker.email = email || broker.email;
        broker.phone = phone || broker.phone;

        await broker.save();

        const { password_hash, ...brokerData } = broker.toJSON();
        res.json({
            success: true,
            message: 'Profile updated successfully',
            broker: brokerData
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login',
    session: true
}), (req, res) => {
    res.redirect('http://localhost:5173/dashboard'); // Redirect to frontend
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('http://localhost:5173/login');
    });
});

module.exports = router;
