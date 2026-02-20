const mongoose = require('mongoose');

const channelSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['public', 'private', 'block'],
            default: 'public',
        },
        description: {
            type: String,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
        // For block channels
        block: {
            type: String, // e.g., 'A', 'B'
        }
    },
    {
        timestamps: true,
    }
);

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
