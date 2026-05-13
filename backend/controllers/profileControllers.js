const userSchema = require('../models/userSchema');

exports.getUserProfile = (req, res) => {
    const username = req.user.username;
    userSchema.findOne({ username })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        })
        .catch(err => res.status(500).json({ error: 'Failed to retrieve user profile' }));  
}

exports.updateUserProfile = (req, res) => {
    const { id } = req.params;

    userSchema.findByIdAndUpdate(id, {
        username: req.body.username,
        email: req.body.email,
        photo: req.body.photo
    }, { new: true }
        .then("User profile updated successfully")
        .catch(err => res.status(500).json({ error: 'Failed to update user profile' }))
    )
}

exports.deleteUserProfile = (req, res) => {
    const { id } = req.params;

    userSchema.findByIdAndDelete(id)
        .then(() => res.json({ message: 'User profile deleted successfully' }))
        .catch(err => res.status(500).json({ error: 'Failed to delete user profile' }));
}