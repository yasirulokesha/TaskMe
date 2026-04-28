const mongoose = require('mongoose');

const UserScheme = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        required: false,
        default: 'https://www.flaticon.com/free-icon/user_1077114?term=user&page=1&position=3&origin=search&related_id=1077114'
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    theme: {
        type: [String],
        enum: ['light', 'dark', 'gray', 'midnight'],
        default: 'light'
    },
    tasks: [{
        type: String,
        ref: 'Task'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserScheme);