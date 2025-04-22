const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Broker } = require('../models');
const bcrypt = require('bcrypt'); // Add this line
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5001/api/auth/google/callback'
}, 
async (accessToken, refreshToken, profile, done) => {
    try {
        let broker = await Broker.findOne({ where: { email: profile.emails[0].value } });

        if (!broker) {
            // Generate a random password for Google-authenticated users
            const randomPassword = Math.random().toString(36).slice(-8);
            const password_hash = await bcrypt.hash(randomPassword, 10);

            broker = await Broker.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password_hash: password_hash // Use the generated hash instead of null
            });
        }

        return done(null, broker);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((broker, done) => {
    done(null, broker.broker_id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const broker = await Broker.findByPk(id);
        done(null, broker);
    } catch (err) {
        done(err, null);
    }
});
