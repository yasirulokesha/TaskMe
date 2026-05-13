const passport = require('passport');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { jwtAuth } = require('../middlewares/jwtAuth');
require('dotenv').config();

const origin_url = process.env.ORIGIN_URL;

// Redirect to Google for authentication
router.get('/google',
    passport.authenticate('google',{ scope: ['profile', 'email'] })
)

// Handle callback from Google
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/failure' }),
    (req, res) => {
        console.log('User authenticated successfully:', req.user);
        const token = jwt.sign(
            {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                avatar: req.user.photo
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development' ? false : true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.cookie('email', req.user.email, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'development' ? false : true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.cookie('avatar', req.user.avatar, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'development' ? false : true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.redirect(`${origin_url}/dashboard/home`);
        console.log('JWT token generated and cookies set successfully', req.user.avatar );

    }
)

// Logout route
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err, console.error('Error during logout:', err));

        req.session.destroy((err) => {
            if (err) return next(err);
            res.clearCookie('connect.sid');
            res.clearCookie('auth_token');
            res.clearCookie('email');
            res.clearCookie('avatar');
            res.redirect(`${origin_url}`);
            console.log('User logged out successfully');
        });
    });
});


// Failure route
router.get('/failure', (req, res) => {
    res.send('Authentication failed. Please try again.');
});

router.get('/user', jwtAuth, (req, res) => {
    return res.status(200).json({ user: req.user });
})

module.exports = router;
