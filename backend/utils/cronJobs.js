const cron = require('node-cron');
const User = require('../models/User');
const Bill = require('../models/Bill');
const AuditLog = require('../models/AuditLog');

const initCronJobs = () => {
    console.log('Initializing Cron Jobs...');

    // Run at 00:00 on the 1st of every month
    // Syntax: minute hour day-of-month month day-of-week
    cron.schedule('0 0 1 * *', async () => {
        console.log('Running Monthly Maintenance Bill Generation...');
        try {
            const residents = await User.find({ role: 'resident' });
            const billingMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 10); // Due in 10 days

            let count = 0;
            for (const resident of residents) {
                // Check if already billed for this month/type to avoid duplicates
                // (Skip strict check for now for simplicity, or add unique compound index)

                await Bill.create({
                    user: resident._id,
                    title: `Maintenance - ${billingMonth}`,
                    amount: 2500, // Default maintenance amount
                    dueDate: dueDate,
                    status: 'Pending',
                    type: 'Maintenance'
                });
                count++;
            }

            console.log(`Generated bills for ${count} residents.`);

            // Log this system action
            await AuditLog.create({
                action: 'SYSTEM_BILL_GENERATION',
                details: `Generated bills for ${count} residents for ${billingMonth}`,
                ipAddress: 'SYSTEM'
            });

        } catch (error) {
            console.error('Error in monthly billing job:', error);
        }
    });
};

module.exports = initCronJobs;
