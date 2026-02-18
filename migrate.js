/**
 * migrate.js — Migrate existing JSON data to MongoDB
 * 
 * Usage: node migrate.js
 * 
 * This script reads users.json and userData.json from src/data/
 * and inserts them into MongoDB collections.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const User = require('./models/User');
const UserData = require('./models/UserData');

const DATA_DIR = path.join(__dirname, 'src', 'data');

async function migrate() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/budgy');
        console.log('✅ Connected to MongoDB');

        // ─── 1. Migrate Users ─────────────────────────────
        const usersFile = path.join(DATA_DIR, 'users.json');
        let oldUsers = [];
        if (fs.existsSync(usersFile)) {
            oldUsers = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '[]');
        }

        // Map: oldId -> newMongoId
        const idMap = {};

        for (const u of oldUsers) {
            // Check if user already exists in MongoDB
            const existing = await User.findOne({ email: u.email });
            if (existing) {
                console.log(`⚠️  User "${u.email}" already exists, skipping...`);
                idMap[u.id] = existing._id.toString();
                continue;
            }

            const newUser = await User.create({
                firstName: u.firstName,
                secondName: u.secondName || '',
                phone: u.phone || '',
                email: u.email,
                password: u.password
            });

            idMap[u.id] = newUser._id.toString();
            console.log(`✅ Migrated user: ${u.email} (old id: ${u.id} → new id: ${newUser._id})`);
        }

        console.log(`\n📋 ID Mapping:`, idMap);

        // ─── 2. Migrate User Data ────────────────────────
        const dataFile = path.join(DATA_DIR, 'userData.json');
        let allData = {};
        if (fs.existsSync(dataFile)) {
            allData = JSON.parse(fs.readFileSync(dataFile, 'utf8') || '{}');
        }

        for (const [oldId, data] of Object.entries(allData)) {
            const newId = idMap[oldId];
            if (!newId) {
                console.log(`⚠️  No matching user found for old ID "${oldId}", skipping data...`);
                continue;
            }

            // Check if data already exists
            const existing = await UserData.findOne({ userId: newId });
            if (existing) {
                console.log(`⚠️  Data for user "${newId}" already exists, updating...`);
                await UserData.findOneAndUpdate(
                    { userId: newId },
                    { $set: data },
                    { new: true }
                );
                console.log(`✅ Updated data for user: ${newId}`);
            } else {
                await UserData.create({
                    userId: newId,
                    ...data
                });
                console.log(`✅ Migrated data for user: ${newId}`);
            }

            // Log what was migrated
            const types = Object.keys(data);
            for (const type of types) {
                const count = Array.isArray(data[type]) ? data[type].length : 1;
                console.log(`   📦 ${type}: ${count} item(s)`);
            }
        }

        console.log('\n🎉 Migration completed successfully!');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

migrate();
