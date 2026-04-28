const passport = require('passport');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

// Redirect to Google for authentication
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/auth_token',(req, res)=>{
    const token = req.cookies.auth_token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    return res.status(200).json({ token });
})

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

        res.status(200).json({ message: `Authentication successful ${req.user.name}`, token });
    }
)

// Logout route
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.session.destroy((err) => {
            if (err) return next(err);
            res.clearCookie('connect.sid');
            res.clearCookie('auth_token');
            res.clearCookie('email');
            res.clearCookie('avatar');
            res.redirect('/auth');
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
        res.redirect('/');
    }
})

module.exports = router;