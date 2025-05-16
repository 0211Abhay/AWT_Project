const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Broker } = require('../models');
const bcrypt = require('bcrypt'); 
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
                password_hash: password_hash 
            });
        }

        return done(null, broker);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((broker, done) => {
    console.log('Serializing user:', broker.broker_id);
    done(null, broker.broker_id);
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log('Deserializing user ID:', id);
        const broker = await Broker.findByPk(id);
        if (broker) {
            console.log('Deserialized user found:', broker.email);
            done(null, broker);
        } else {
            console.log('No broker found with ID:', id);
            done(null, false);
        }
    } catch (err) {
        console.error('Deserialize error:', err);
        done(err, null);
    }
});
