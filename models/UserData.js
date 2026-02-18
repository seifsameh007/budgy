const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    events: { type: Array, default: [] },
    tasks: { type: Array, default: [] },
    goals: { type: Array, default: [] },
    assets: { type: Array, default: [] },
    debts: { type: Array, default: [] },
    savings: { type: Array, default: [] },
    buyList: { type: Array, default: [] },
    sellList: { type: Array, default: [] },
    calendarEntries: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('UserData', userDataSchema);
