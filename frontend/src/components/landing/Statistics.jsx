import React from 'react';

export default function Statistics() {
    return (
        <section className="py-16 bg-primary dark:bg-primary-dark text-white" id="statistics">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
                    <div className="p-4">
                        <div className="text-4xl md:text-5xl font-black mb-2">2,500+</div>
                        <div className="text-sm md:text-base font-medium opacity-90">Happy Residents</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl md:text-5xl font-black mb-2">98%</div>
                        <div className="text-sm md:text-base font-medium opacity-90">Complaints Resolved</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl md:text-5xl font-black mb-2">24/7</div>
                        <div className="text-sm md:text-base font-medium opacity-90">Security Uptime</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
