const mongoose = require('mongoose');

const visitorSchema = mongoose.Schema(
    {
        resident: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: false,
        },
        type: {
            type: String,
            enum: ['Personal Guest', 'Delivery Partner', 'Home Service', 'Daily Help', 'Worker', 'Other'],
            default: 'Personal Guest'
        },
        expectedDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'expected', 'checked_in', 'checked_out', 'denied'],
            default: 'pending'
        },
        purpose: { // Keep for backward compatibility if needed, or remove if not in UI
            type: String,
        },
        passCode: {
            type: String,
            unique: true
        }
    },
    {
        timestamps: true,
    }
);

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;
