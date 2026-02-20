const Amenity = require('../models/Amenity');
const Booking = require('../models/Booking');

// @desc    Get all amenities
// @route   GET /api/amenities
// @access  Private
const getAllAmenities = async (req, res) => {
    try {
        const amenities = await Amenity.find({ isActive: true });
        res.json(amenities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a booking
// @route   POST /api/amenities/book
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { amenityId, date, startTime, endTime } = req.body;

        // Basic conflict check (could be more robust)
        const conflict = await Booking.findOne({
            amenity: amenityId,
            date: new Date(date),
            status: { $in: ['approved', 'pending'] },
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } },
            ]
        });

        if (conflict) {
            res.status(400);
            throw new Error('Slot already booked or pending approval');
        }

        const booking = new Booking({
            user: req.user._id,
            amenity: amenityId,
            date: new Date(date),
            startTime,
            endTime,
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get my bookings
// @route   GET /api/amenities/my
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('amenity', 'name type')
            .sort('-createdAt');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Seed default amenities (Admin utility)
// @route   POST /api/amenities/seed
// @access  Private/Admin
const seedAmenities = async (req, res) => {
    try {
        const count = await Amenity.countDocuments();
        if (count > 0) {
            return res.status(400).json({ message: 'Amenities already seeded' });
        }

        const amenities = [
            {
                name: 'Clubhouse Hall',
                type: 'Hall',
                capacity: 100,
                pricePerHour: 50,
                image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
                description: 'Spacious hall for parties and gatherings.'
            },
            {
                name: 'Gymnasium',
                type: 'Gym',
                capacity: 20,
                pricePerHour: 0,
                image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
                description: 'Fully equipped gym with cardio and weights.'
            },
            {
                name: 'Swimming Pool',
                type: 'Pool',
                capacity: 30,
                pricePerHour: 0,
                image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
                description: 'Olympic size pool with kids area.'
            },
            {
                name: 'Tennis Court',
                type: 'Court',
                capacity: 4,
                pricePerHour: 10,
                image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
                description: 'Professional hard court.'
            }
        ];

        await Amenity.insertMany(amenities);
        res.json({ message: 'Amenities seeded successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllAmenities, createBooking, getMyBookings, seedAmenities };
