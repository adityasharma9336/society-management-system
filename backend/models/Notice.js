const mongoose = require('mongoose');

const noticeSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        category: {
            type: String,
            enum: ['general', 'maintenance', 'event', 'emergency', 'security', 'other'],
            default: 'other',
        },
        type: {
            type: String,
            enum: ['notice', 'alert', 'meeting', 'circular', 'announcement'],
            default: 'notice',
        },
        priority: {
            type: String,
            enum: ['low', 'normal', 'medium', 'high', 'urgent'],
            default: 'normal',
        },
        eventDetails: {
            date: Date,
            time: String,
            location: String,
        },
        attachments: [
            {
                name: String,
                url: String,
                type: String,
            }
        ],
        targetAudience: {
            type: String,
            default: 'all'
        }
    },
    {
        timestamps: true,
    }
);

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;
