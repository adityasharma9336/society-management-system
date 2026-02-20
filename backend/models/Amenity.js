const mongoose = require('mongoose');

const amenitySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['Hall', 'Gym', 'Court', 'Pool', 'Other'],
        },
        description: {
            type: String,
        },
        capacity: {
            type: Number,
            default: 1
        },
        pricePerHour: {
            type: Number,
            default: 0
        },
        image: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Amenity = mongoose.model('Amenity', amenitySchema);

module.exports = Amenity;
