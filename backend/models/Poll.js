const mongoose = require('mongoose');

const pollSchema = mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        options: [
            {
                text: { type: String, required: true },
                votes: { type: Number, default: 0 }
            }
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        deadline: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'closed'],
            default: 'active',
        },
        type: {
            type: String,
            enum: ['general', 'event', 'maintenance'], // For categorization if needed
            default: 'general'
        },
        votedBy: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                optionIndex: { type: Number, required: true } // Index of the option selected
            }
        ]
    },
    {
        timestamps: true,
    }
);

// Method to check if active
pollSchema.methods.isActive = function () {
    return this.status === 'active' && new Date() < this.deadline;
};

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
