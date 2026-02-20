const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUserActivity,
    getUsers,
    deleteUser,
    updateUserRole
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const { audit } = require('../middleware/auditMiddleware');

router.post('/', registerUser);
router.post('/login', audit('USER_LOGIN'), authUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, audit('UPDATE_PROFILE'), updateUserProfile);
router.get('/activity', protect, getUserActivity);
router.route('/').get(protect, admin, getUsers);
router.route('/:id')
    .delete(protect, admin, audit('DELETE_USER'), deleteUser)
    .put(protect, admin, audit('UPDATE_USER_ROLE'), updateUserRole);

module.exports = router;
