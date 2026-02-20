const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        subject: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['plumbing', 'electrical', 'security', 'other'],
            default: 'other',
        },
        status: {
            type: String,
            enum: ['open', 'in_progress', 'resolved', 'closed'],
            default: 'open',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        assignedTo: {
            type: String, // Could be Technician Name or ID
        },
        timeline: [
            {
                status: String,
                date: {
                    type: Date,
                    default: Date.now,
                },
                note: String,
            }
        ],
        messages: [
            {
                sender: {
                    type: String,
                    enum: ['user', 'admin'],
                    required: true,
                },
                content: String,
                date: {
                    type: Date,
                    default: Date.now,
                },
            }
        ],
    },
    {
        timestamps: true,
    }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
