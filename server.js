const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Routes
const USERS_FILE = path.join(dataDir, 'users.json');

app.post('/api/register', (req, res) => {
    const { firstName, secondName, phone, email, password } = req.body;

    if (!firstName || !email || !password) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]');

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = {
        id: Date.now().toString(),
        firstName,
        secondName,
        phone,
        email,
        password // In a real app, hash this!
    };

    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    res.status(201).json({ message: 'User created' });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]');

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const { password, ...userWithoutPass } = user;
        res.json({ message: 'Login successful', user: userWithoutPass });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

const DATA_FILE = path.join(dataDir, 'userData.json');

// Get user data
app.get('/api/data', (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: 'Missing userId' });

    const allData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '{}');
    res.json(allData[userId] || {});
});

// Update user data
// Update user data
app.post('/api/data', (req, res) => {
    const { userId, type, data } = req.body;
    // Allow data to be empty array or object, but not undefined/null
    if (!userId || !type || data === undefined || data === null) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    let allData = {};
    try {
        if (fs.existsSync(DATA_FILE)) {
            allData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '{}');
        }
    } catch (err) {
        console.error("Error reading data file:", err);
        allData = {};
    }

    if (!allData[userId]) allData[userId] = {};

    // Merge or replace based on type
    allData[userId][type] = data;

    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(allData, null, 2));
        res.json({ message: 'Data saved', data: allData[userId][type] });
    } catch (err) {
        console.error("Error writing data file:", err);
        res.status(500).json({ message: 'Failed to write data' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
