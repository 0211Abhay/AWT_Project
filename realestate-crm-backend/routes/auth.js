const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Broker } = require('../models');
const { isAuthenticated } = require('../middleware/auth');
const passport = require('passport');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

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
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        
        const broker = await Broker.findOne({ where: { email } });

        if (!broker) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, broker.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Set session data
        req.session.brokerId = broker.broker_id;

        // Send broker data without sensitive information
        const { password_hash, ...brokerData } = broker.toJSON();
        
        // Ensure broker_id is included in the response
        const responseData = {
            ...brokerData,
            broker_id: broker.broker_id || broker.id
        };
        
        res.json({
            success: true,
            message: 'Login successful',
            broker: responseData
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
    }
});

// Check authentication status
router.get('/check', async (req, res) => {
    try {
        // Check for either Passport's req.user or your custom session.brokerId
        const brokerId = req.user?.broker_id || req.session.brokerId;
        
        if (!brokerId) {
            console.log('Auth check: No brokerId found in session or user object');
            return res.json({ authenticated: false });
        }

        const broker = await Broker.findByPk(brokerId);
        if (!broker) {
            console.log(`Auth check: No broker found with ID ${brokerId}`);
            return res.json({ authenticated: false });
        }

        console.log(`Auth check: Successfully authenticated broker ${broker.email}`);
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

// Logout route - no authentication required
router.post('/logout', (req, res) => {
    // Check if session exists
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.error('Logout error:', err);
                return res.status(500).json({ success: false, message: 'Error during logout' });
            }
            res.clearCookie('connect.sid');
            res.json({ success: true, message: 'Logged out successfully' });
        });
    } else {
        // If no session exists, still return success
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Logged out successfully' });
    }
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

// Forgot Password - Request password reset
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Find broker by email
        const broker = await Broker.findOne({ where: { email } });
        if (!broker) {
            // For security reasons, don't reveal that the email doesn't exist
            return res.json({ 
                success: true, 
                message: 'If your email is registered, you will receive a password reset link' 
            });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour

        // Save the reset token and expiry to the broker record
        broker.reset_token = resetToken;
        broker.reset_token_expiry = resetTokenExpiry;
        await broker.save();

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Reset link (frontend URL)
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Real Estate CRM - Password Reset',
            html: `
                <h1>Password Reset Request</h1>
                <p>You requested a password reset for your Real Estate CRM account.</p>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({ 
            success: true, 
            message: 'If your email is registered, you will receive a password reset link' 
        });
    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during password reset request' 
        });
    }
});

// Verify reset token
router.get('/verify-reset-token/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const now = new Date();
        
        // Find broker with this token
        const broker = await Broker.findOne({ 
            where: { 
                reset_token: token,
                reset_token_expiry: {
                    [Op.gt]: now
                }
            } 
        });

        if (!broker) {
            return res.json({ 
                success: false, 
                message: 'Invalid or expired reset token' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Valid reset token' 
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during token verification' 
        });
    }
});

// Reset password with token
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const now = new Date();
        
        // Find broker with this token
        const broker = await Broker.findOne({ 
            where: { 
                reset_token: token,
                reset_token_expiry: {
                    [Op.gt]: now
                }
            } 
        });

        if (!broker) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired reset token' 
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update broker with new password and clear reset token
        broker.password_hash = hashedPassword;
        broker.reset_token = null;
        broker.reset_token_expiry = null;
        await broker.save();

        res.json({ 
            success: true, 
            message: 'Password has been reset successfully' 
        });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during password reset' 
        });
    }
});

module.exports = router;
