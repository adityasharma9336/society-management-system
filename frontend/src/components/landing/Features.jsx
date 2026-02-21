import React from 'react';

export default function Features() {
    return (
        <section className="py-24 bg-white dark:bg-[#0b1019]" id="features">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-[#111318] dark:text-white mb-4">Comprehensive Features</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Everything you need to manage your housing society efficiently in one place.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Feature 1 */}
                    <div className="p-6 rounded-2xl border border-gray-100 bg-background-light dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow group">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">lock</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-2">Secure Login</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Role-based access control ensuring data privacy for residents and staff.</p>
                    </div>
                    {/* Feature 2 */}
                    <div className="p-6 rounded-2xl border border-gray-100 bg-background-light dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow group">
                        <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">report_problem</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-2">Complaint Box</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Raise tickets instantly and track resolution status in real-time.</p>
                    </div>
                    {/* Feature 3 */}
                    <div className="p-6 rounded-2xl border border-gray-100 bg-background-light dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow group">
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">chat</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-2">Real-time Chat</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Connect with neighbors and committee members securely within the app.</p>
                    </div>
                    {/* Feature 4 */}
                    <div className="p-6 rounded-2xl border border-gray-100 bg-background-light dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow group">
                        <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">build</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-2">Maintenance</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Track maintenance schedules, bills, and payment history effortlessly.</p>
                    </div>
                    {/* Feature 5 */}
                    <div className="p-6 rounded-2xl border border-gray-100 bg-background-light dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow group">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">campaign</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-2">Notice Board</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Digital announcements and circulars delivered straight to your phone.</p>
                    </div>
                    {/* Feature 6 */}
                    <div className="p-6 rounded-2xl border border-gray-100 bg-background-light dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow group">
                        <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">person_pin_circle</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-2">Visitor Mgmt</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pre-approve guests and get instant notifications on arrival.</p>
                    </div>
                    {/* Feature 7 */}
                    <div className="p-6 rounded-2xl border border-gray-100 bg-background-light dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow group">
                        <div className="w-12 h-12 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">sos</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-2">Emergency Alert</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">One-tap SOS triggers to security and family members in emergencies.</p>
                    </div>
                    {/* Feature 8 */}
                    <div className="p-6 rounded-2xl border border-gray-100 bg-background-light dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow group">
                        <div className="w-12 h-12 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">monitoring</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-2">Analytics</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive dashboards for admins to monitor society health.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
