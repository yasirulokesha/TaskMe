const passport = require('passport');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

        res.cookie('avatar', req.user.photo, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'development' ? false : true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.redirect(`${process.env.CLIENT_URL}dashboard`);
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
            res.redirect(`${process.env.CLIENT_URL}`);
            console.log('User logged out successfully');
        });
    });
});


// Failure route
router.get('/failure', (req, res) => {
    res.send('Authentication failed. Please try again.');
});

router.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        return res.status(401).json({ error: 'Unauthorized' });
    }
})

module.exports = router;