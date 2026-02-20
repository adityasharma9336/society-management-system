const mongoose = require('mongoose');

const auditLogSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false, // System actions might not have a user
        },
        action: {
            type: String,
            required: true,
        },
        details: {
            type: String,
        },
        ipAddress: {
            type: String,
        },
        resourceId: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
