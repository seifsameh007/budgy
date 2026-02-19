require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const User = require('./models/User');
const UserData = require('./models/UserData');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/budgy')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ─── Routes ───────────────────────────────────────────────

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

        const newUser = await User.create({
            firstName,
            secondName,
            phone,
            email,
            password // In a real app, hash this!
        });

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

        if (user && user.password === password) {
            const userObj = user.toObject();
            delete userObj.password;
            // Use _id as the user id, convert to string for frontend compatibility
            res.json({
                message: 'Login successful',
                user: {
                    id: userObj._id.toString(),
                    firstName: userObj.firstName,
                    secondName: userObj.secondName,
                    phone: userObj.phone,
                    email: userObj.email
                }
            });
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

        // Return plain object without MongoDB metadata
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

        // Upsert: create if not exists, update the specific field
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
});

module.exports = app;
