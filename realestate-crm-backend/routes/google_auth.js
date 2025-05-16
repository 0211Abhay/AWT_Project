const express = require('express');
const passport = require('passport');
const router = express.Router();

// Initiate Google OAuth login
router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/callback', passport.authenticate('google', { 
    failureRedirect: 'http://localhost:5173/login',
    session: true
}), (req, res) => {
    // Manually set the session brokerId to match your regular auth flow
    if (req.user && req.user.broker_id) {
        req.session.brokerId = req.user.broker_id;
        req.session.save((err) => {
            if (err) console.error('Session save error:', err);
            console.log(`Google auth successful, setting session for broker ID: ${req.user.broker_id}`);
            res.redirect('http://localhost:5173/dashboard');
        });
    } else {
        console.error('Google auth callback: No user or broker_id found');
        res.redirect('http://localhost:5173/login');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        req.session.destroy();
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;
