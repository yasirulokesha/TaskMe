const os = require('os');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/db');
require('./config/passport'); 

require('dotenv').config();

// URL retrieved from .env file
const url = process.env.ORIGIN_URL;

const app = express();

app.use(express.json());

app.use(cors({
    origin: `${url}`, 
    credentials: true,
}))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Server running at: ${url}`);
});

// Connect to MongoDB and set up routes for tasks and users
connectDb();

// Task routes
app.use('/', require('./routes/taskRoutes'));

// Auth routes
app.use('/auth', require('./routes/authRoutes'));

// User-profile routes
app.use('/user', require('./routes/profileRoutes'));

// module.exports = app;