const express = require('express');
const router = express.Router();
const {
    getAllAmenities,
    createBooking,
    getMyBookings,
    seedAmenities
} = require('../controllers/amenityController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAllAmenities);
router.route('/book').post(protect, createBooking);
router.route('/my').get(protect, getMyBookings);
router.route('/seed').post(protect, admin, seedAmenities);

module.exports = router;
