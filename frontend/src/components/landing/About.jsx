import React from 'react';

export default function About() {
    return (
        <section className="py-20 bg-background-light dark:bg-[#101622]" id="about">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-primary text-sm font-bold uppercase tracking-wider mb-2">About Us</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-[#111318] dark:text-white mb-6">Transforming Community Living</h3>
                        <div className="space-y-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                            <p>
                                Move away from manual logs and paper trails. Our comprehensive digital solution brings efficiency, transparency, and security to your doorstep. We bridge the gap between residents, management committees, and security personnel.
                            </p>
                            <p>
                                Whether it's managing visitors at the gate, raising a maintenance request, or paying society bills, SocietyManager handles it all in one unified platform.
                            </p>
                            <div className="pt-4">
                                <a className="inline-flex items-center text-primary font-bold hover:text-primary-dark" href="#">
                                    Learn more about our mission
                                    <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
                        <div className="grid grid-cols-2 gap-4 relative">
                            <div className="space-y-4 mt-8">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 text-primary flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined">cloud_upload</span>
                                    </div>
                                    <h4 className="font-bold text-lg mb-1 dark:text-white">Digital Logs</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Zero paper waste</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                                    <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined">shield</span>
                                    </div>
                                    <h4 className="font-bold text-lg mb-1 dark:text-white">Secure</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Bank-grade security</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined">groups</span>
                                    </div>
                                    <h4 className="font-bold text-lg mb-1 dark:text-white">Community</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Stay connected</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined">analytics</span>
                                    </div>
                                    <h4 className="font-bold text-lg mb-1 dark:text-white">Insights</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Real-time data</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
