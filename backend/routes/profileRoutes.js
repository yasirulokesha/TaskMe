const {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
} = require('../controllers/profileControllers');
const router = require('express').Router();

const { jwtAuth } = require('../middlewares/jwtAuth');

router.get('/', jwtAuth, getUserProfile);
router.put('/:id', jwtAuth, updateUserProfile);
router.delete('/:id', jwtAuth, deleteUserProfile);

module.exports = router;