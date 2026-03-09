const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    secondName: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, default: null },
    googleId: { type: String, default: null },
    profilePicture: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
