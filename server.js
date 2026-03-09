require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const SALT_ROUNDS = 10;

const User = require('./models/User');
const UserData = require('./models/UserData');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ─── Session ──────────────────────────────────────────────
app.use(session({
    secret: process.env.SESSION_SECRET || 'budgy_fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// ─── Passport ─────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user._id.toString()));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/auth/google/callback`,
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('🔵 Google OAuth callback received for:', profile.displayName);

        const email = profile.emails?.[0]?.value;
        if (!email) {
            console.error('❌ No email returned from Google profile');
            return done(new Error('No email from Google'), null);
        }

        console.log('📧 Google email:', email, '| Google ID:', profile.id);

        // Try finding existing user by googleId first, then by email
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = await User.findOne({ email });
        }

        if (user) {
            console.log('✅ Existing user found:', user.email);
            // Link googleId if they signed up with email/password before
            if (!user.googleId) {
                user.googleId = profile.id;
                user.profilePicture = profile.photos?.[0]?.value || null;
                await user.save();
                console.log('🔗 Linked Google ID to existing account:', email);
            }
        } else {
            console.log('🆕 Creating new user from Google profile...');
            const nameParts = (profile.displayName || 'Google User').split(' ');
            const newUserData = {
                firstName: nameParts[0] || 'User',
                secondName: nameParts.slice(1).join(' ') || '',
                email,
                googleId: profile.id,
                profilePicture: profile.photos?.[0]?.value || null,
                password: null,
                phone: ''
            };
            console.log('🆕 New user data:', JSON.stringify(newUserData));
            user = await User.create(newUserData);
            console.log('✅ New user created in MongoDB! ID:', user._id.toString());
        }

        return done(null, user);
    } catch (err) {
        console.error('❌ Google OAuth strategy error:', err.message, err.stack);
        return done(err, null);
    }
}));

// ─── Connect to MongoDB ───────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ─── Static Files ─────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── Google OAuth Routes ──────────────────────────────────
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    (req, res, next) => {
        passport.authenticate('google', (err, user, info) => {
            if (err) {
                console.error('❌ OAuth callback error:', err.message);
                return res.redirect(`/auth/failure?error=${encodeURIComponent(err.message)}`);
            }
            if (!user) {
                console.error('❌ OAuth: no user returned. Info:', info);
                return res.redirect(`/auth/failure?error=${encodeURIComponent('Authentication failed')}`);
            }

            req.logIn(user, (loginErr) => {
                if (loginErr) {
                    console.error('❌ req.logIn error:', loginErr.message);
                    return res.redirect(`/auth/failure?error=${encodeURIComponent(loginErr.message)}`);
                }

                const userPayload = {
                    id: user._id.toString(),
                    firstName: user.firstName,
                    secondName: user.secondName || '',
                    phone: user.phone || '',
                    email: user.email,
                    profilePicture: user.profilePicture || null
                };
                console.log('🎉 OAuth login success, redirecting to dashboard for:', user.email);
                const encoded = encodeURIComponent(JSON.stringify(userPayload));
                res.redirect(`/auth/success?user=${encoded}`);
            });
        })(req, res, next);
    }
);

app.get('/auth/success', (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
<head><title>Signing in...</title></head>
<body>
<script>
    try {
        const params = new URLSearchParams(window.location.search);
        const raw = params.get('user');
        if (raw) {
            localStorage.setItem('user', decodeURIComponent(raw));
        }
    } catch(e) { console.error('Failed to store user:', e); }
    window.location.href = '/dashboard.html';
</script>
</body>
</html>`);
});

app.get('/auth/failure', (req, res) => {
    const error = req.query.error || 'Google sign-in failed';
    console.error('❌ Auth failure page hit. Error:', error);
    res.status(401).send(`<!DOCTYPE html>
<html>
<head><title>Sign-in Failed</title></head>
<body style="font-family:sans-serif;padding:40px;background:#1a1a2e;color:#fff;text-align:center;">
  <h2>⚠️ Sign-in Failed</h2>
  <p style="color:#f87171;">${error}</p>
  <p><a href="/" style="color:#818cf8;">← Go back</a></p>
</body>
</html>`);
});

// ─── API Routes ───────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        mongoUriSet: !!process.env.MONGODB_URI,
        googleClientIdSet: !!process.env.GOOGLE_CLIENT_ID,
        googleClientSecretSet: !!process.env.GOOGLE_CLIENT_SECRET,
        dbState: mongoose.connection.readyState,
        baseUrl: BASE_URL
    });
});

// Register
app.post('/api/register', async (req, res) => {
    try {
        const firstName = (req.body.firstName || '').trim();
        const secondName = (req.body.secondName || '').trim();
        const phone = (req.body.phone || '').trim();
        const email = (req.body.email || '').trim().toLowerCase();
        const password = (req.body.password || '').trim();

        if (!firstName || !email || !password) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await User.create({ firstName, secondName, phone, email, password: hashedPassword });
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        console.error('Register error:', err);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'This email is already registered' });
        }
        res.status(500).json({ message: 'Registration failed, please try again' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const email = (req.body.email || '').trim().toLowerCase();
        const password = (req.body.password || '').trim();
        const user = await User.findOne({ email });

        const passwordMatch = user && user.password && await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const userObj = user.toObject();
            delete userObj.password;
            res.json({
                message: 'Login successful',
                user: {
                    id: userObj._id.toString(),
                    firstName: userObj.firstName,
                    secondName: userObj.secondName,
                    phone: userObj.phone,
                    email: userObj.email,
                    profilePicture: userObj.profilePicture || null
                }
            });
        } else if (user && !user.password) {
            res.status(401).json({ message: 'This account uses Google Sign-In. Please click "Sign in with Google".' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user data
app.get('/api/data', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) return res.status(400).json({ message: 'Missing userId' });

        const userData = await UserData.findOne({ userId });
        if (!userData) return res.json({});

        const obj = userData.toObject();
        delete obj._id;
        delete obj.__v;
        delete obj.userId;
        delete obj.createdAt;
        delete obj.updatedAt;
        res.json(obj);
    } catch (err) {
        console.error('Get data error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user data
app.post('/api/data', async (req, res) => {
    try {
        const { userId, type, data } = req.body;
        if (!userId || !type || data === undefined || data === null) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        const update = { $set: { [type]: data } };
        const userData = await UserData.findOneAndUpdate(
            { userId },
            update,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        const obj = userData.toObject();
        res.json({ message: 'Data saved', data: obj[type] });
    } catch (err) {
        console.error('Save data error:', err);
        res.status(500).json({ message: 'Failed to save data' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🔗 Google OAuth callback: ${BASE_URL}/auth/google/callback`);
});

module.exports = app;
