const session = require('express-session');

const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: {
        // Only set secure to true if using HTTPS
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // Use 'none' for cross-site requests in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
};

// In development, we don't need secure cookies
if (process.env.NODE_ENV !== 'production') {
    sessionConfig.cookie.secure = false;
}

module.exports = session(sessionConfig);
