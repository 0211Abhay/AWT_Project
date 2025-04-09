const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Broker } = require('../models'); // Assuming `Broker` is the user model
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
            // Create new broker if not found
            broker = await Broker.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password_hash: null // Since Google auth is used, no password
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
