import React from 'react';

export default function HowItWorks() {
    return (
        <section className="py-24 bg-background-light dark:bg-[#101622]" id="how-it-works">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-[#111318] dark:text-white mb-4">How It Works</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">Get started in three simple steps.</p>
                </div>
                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center bg-background-light dark:bg-[#101622]">
                            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg border-4 border-white dark:border-[#101622]">1</div>
                            <h3 className="text-xl font-bold text-[#111318] dark:text-white mb-3">Register Account</h3>
                            <p className="text-gray-600 dark:text-gray-400 px-4">Sign up with your details and select your society from our database.</p>
                        </div>
                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center bg-background-light dark:bg-[#101622]">
                            <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 text-primary border-2 border-primary flex items-center justify-center text-2xl font-bold mb-6 shadow-lg z-20">2</div>
                            <h3 className="text-xl font-bold text-[#111318] dark:text-white mb-3">Admin Verification</h3>
                            <p className="text-gray-600 dark:text-gray-400 px-4">Your society admin will verify your details to ensure community security.</p>
                        </div>
                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center bg-background-light dark:bg-[#101622]">
                            <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 text-primary border-2 border-primary flex items-center justify-center text-2xl font-bold mb-6 shadow-lg border-white dark:border-[#101622]">3</div>
                            <h3 className="text-xl font-bold text-[#111318] dark:text-white mb-3">Manage Everything</h3>
                            <p className="text-gray-600 dark:text-gray-400 px-4">Access the dashboard to pay bills, book facilities, and manage visitors.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
