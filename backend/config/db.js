require('dotenv').config();

const mongoose = require('mongoose');

const mongoDbUri = process.env.MONGO_DB_URI;

const connectDb = async (res) => {
    console.log('Connecting to MongoDB...');
    try {
        await mongoose.connect(mongoDbUri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('DB connection error:', error.message);
        process.exit(1);
    }
}

module.exports = connectDb;
