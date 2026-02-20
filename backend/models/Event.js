const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['Social', 'Meeting', 'Sports', 'Festival', 'Health', 'Other'],
            default: 'Other'
        },
        image: {
            type: String
        },
        startTime: {
            type: String
        },
        endTime: {
            type: String
        },
        isFeatured: {
            type: Boolean,
            default: false
        },
        rsvpList: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    {
        timestamps: true,
    }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
