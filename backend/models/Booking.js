const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        amenity: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Amenity',
        },
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String, // Format: "HH:mm"
            required: true,
        },
        endTime: {
            type: String, // Format: "HH:mm"
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'cancelled'],
            default: 'pending',
        },
        notes: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
