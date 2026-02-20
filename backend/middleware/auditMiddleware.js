const AuditLog = require('../models/AuditLog');

const audit = (action) => async (req, res, next) => {
    // Capture the original send function to intercept the response
    const originalSend = res.send;

    res.send = function (data) {
        // Restore the original function to avoid infinite loop
        res.send = originalSend;
        // Call the original function
        res.send.apply(res, arguments);

        // Log only if the request was successful
        if (res.statusCode >= 200 && res.statusCode < 300) {
            AuditLog.create({
                user: req.user ? req.user._id : null,
                action: action,
                details: `Method: ${req.method}, URL: ${req.originalUrl}`,
                ipAddress: req.ip || req.connection.remoteAddress
            }).catch(err => console.error('Audit log failed:', err));
        }
    };

    next();
};

module.exports = { audit };
