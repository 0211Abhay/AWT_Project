const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db'); // Import MySQL connection

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const { id, displayName, emails } = profile;
        const email = emails[0].value;

        // Check if user exists in database
        const [user] = await db.promise().query("SELECT * FROM brokers WHERE email = ?", [email]);

        if (user.length === 0) {
            // Create new broker entry
            const [result] = await db.promise().query(
                "INSERT INTO brokers (name, email, password_hash) VALUES (?, ?, ?)",
                [displayName, email, id]
            );
            return done(null, { broker_id: result.insertId, name: displayName, email });
        } else {
            return done(null, user[0]); // User exists
        }
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.broker_id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const [user] = await db.promise().query("SELECT * FROM brokers WHERE broker_id = ?", [id]);
        done(null, user[0]);
    } catch (error) {
        done(error, null);
    }
});
