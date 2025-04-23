const express = require('express');
const passport = require('passport');
const router = express.Router();

// Initiate Google OAuth login
router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/callback', passport.authenticate('google', {
    successRedirect: 'http://localhost:5173/dashboard', // Redirect to dashboard on success
    failureRedirect: 'http://localhost:5173/login' // Redirect to login on failure
}));

// Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        req.session.destroy();
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;
