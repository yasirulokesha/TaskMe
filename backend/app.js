const os = require('os');
const express = require('express');
const passport = require('passport');
const MongoStore = require('connect-mongo').default;
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/db');
require('./config/passport'); 

require('dotenv').config();

// URL retrieved from .env file
const url = process.env.ORIGIN_URL;

const app = express();
app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.NODE_ENV === "production"
  ? [
      "https://taskme-frontend.onrender.com",
      "https://task-me-app-neon.vercel.app",
    ]
  : [
      "http://localhost:5173",
    ];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongoUrl: process.env.MONGO_DB_URI,         // same URI you use for connectDb
    collectionName: 'sessions',
    ttl: 60 * 60 * 24 * 7,                   // 7 days in seconds
    autoRemove: 'native',                    // let MongoDB auto-delete expired sessions
  }),
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Server running at: ${url}`);
});

app.use('/', require('./routes/taskRoutes'));         // Task routes
app.use('/auth', require('./routes/authRoutes'));     // Auth routes
app.use('/user', require('./routes/profileRoutes'));  // User-profile routes

// Connect to MongoDB and set up routes for tasks and users
connectDb();