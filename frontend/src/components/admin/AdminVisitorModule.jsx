import React, { useState, useEffect } from 'react';

const AdminVisitorModule = () => {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const mockVisitors = [
        {
            id: 'V-1001',
            name: 'Robert Fox',
            phone: '+1 234-567-890',
            avatarImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEtqGJjpwjBf_3C-6-EKAA65CXSvv6B8-58H5WgvtkomD8uG7s4ECnFhwsHjPeNc7tLro5UGyQR-47BCFl4bGvarQRssFM02OMCcvZPD2qgdFUbyw8ACm2tXMhbOeKpXtTr6uNlcz9U51_iZKGerQz9DZZkcsSg6ybg1IL1PMq0gVYB0uEhux9SWcSO7tWBuVeuStnnZIKTFP70Viel5V_jwGlZSLN2hxRThSz1PFTEqKQst6yAW1LU1f8JUKxialkg-tyMPP6xGs',
            purpose: 'Guest',
            purposeColor: 'blue',
            flatVisited: 'Flat 502',
            block: 'Block B',
            entryTime: '10:42 AM',
            timeAgo: '12m ago',
            isOverstaying: false
        },
        {
            id: 'V-1002',
            name: 'Amazon Delivery',
            phone: 'ID: #DX-9283',
            avatarIcon: 'local_shipping',
            avatarBg: 'orange',
            purpose: 'Delivery',
            purposeColor: 'orange',
            flatVisited: 'Flat 304',
            block: 'Block A',
            entryTime: '10:30 AM',
            timeAgo: '24m ago',
            isOverstaying: false
        },
        {
            id: 'V-1003',
            name: 'Jenny Wilson',
            phone: '+1 987-654-321',
            avatarImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo_mCSxRDJELRNfwFASxNbk2Uaw-OV_XcMjZAnC3mJOjXCFaHW4HA9SXQ5W96gZZp8ItUyE6NKCReBjI5YOqLDX7N9JMUH-i8UPwAuYeRcZ3nI9mHKW5g3C-iKQwASgOWW-7LGqhEb5twgPni6wGfzzarVuYlpbSImiI3MDSicIo2euqM2oKbH5vfUD0y--G2PlAUKT_XrCi7Tk3Ivnlxccy1qLdfDPw7526wuRqPjhnd0h7yDXGvtr17eEFObSbwzZeugj3L5aK4',
            purpose: 'Service',
            purposeColor: 'purple',
            flatVisited: 'Flat 101',
            block: 'Block C',
            entryTime: '09:15 AM',
            timeAgo: '1h 39m ago',
            isOverstaying: true
        },
        {
            id: 'V-1004',
            name: 'Housekeeping Staff',
            phone: 'Team Alpha',
            avatarIcon: 'cleaning_services',
            avatarBg: 'teal',
            purpose: 'Staff',
            purposeColor: 'teal',
            flatVisited: 'Clubhouse',
            block: 'Common Area',
            entryTime: '08:00 AM',
            timeAgo: '2h 54m ago',
            isOverstaying: false
        }
    ];

    const mockAlerts = [
        { id: 1, title: 'Medical Emergency', subtitle: 'Flat 302, Block A', timeAgo: '2m ago', actions: ['Acknowledge', 'Call Resident'] },
        { id: 2, title: 'Fire Alarm Triggered', subtitle: 'Main Corridor, Block B', timeAgo: '15m ago', actions: ['Dismiss (False Alarm)'] }
    ];

    const frequentVisitors = [
        { id: 1, name: 'Milk Basket', details: 'Daily Delivery • 6:00 AM', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAgOc5YJuhH9bSx3CyGUMHTnqyvcbfJkA56tb-nOlY883oJl7aBuyMAOcp2RmsJm6c8-QmoptZ03Diwb3_C3xmLZkEKU3OOMFkqllQ85IuLpct9-uqHphHnXqfLHzH797mgS85sKrMW5dsIeJqeofSKNh35-qpayWOVzDCK0rCxeURxEw6Y-EaoV5LlIH4pWSvlFTOi1grFAGC5cXSpkLK4v7ISZTb7jVTtjIjDCS8RMHDdoM4MAhwYR3NAG1oeCIHUD7wUZwh2ws' },
        { id: 2, name: 'Zomato Delivery', details: 'Food Delivery', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTUI8WCfvFmafubc-tng5wo-CBgtbNU18F9IKt2vaaHdAu8upMD2MX0K5k7koPhgkwxySJRI-vb5ROFVT1xlx36RqNYaZv3TTsa1U1SIqTlrxadrEG_fCMDtZGc82aleJLXyoMMkHDuO-vHjhCgp7IEBTpR7ogzzEfUZu8YLPcXIMllU86gz5V0_qFUt3aMbqyWGzyuHDD_Cyk6hAyXaPboatguWw4EzdN9L0b_tudIoT-4QLNDkd_l7VcHVQq5Eog5YVIXUQoieA' },
        { id: 3, name: 'Urban Company', details: 'Home Services', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7z7dbw3V9SMRHBZmD2wIBj9s4dcLjO44Z-MDfCEAvc6VpC5UX1NAqloLd2tpEbr9YyaSaY2BggVEq-CrLL0XwZpJ5IsnuTOG1mlTUomwSzQvbsYCF2kHgaM3LYId9e-zBaR2SZp3Qx-fBJOZGhKiG6k6jWj10PEMOhc9WhetzrmMM320ZSm518o60JOfa-VNCvXYTR1QQYQWMmc4CSfsB3FJH84Yg-YjryTQVa46ecDX5rz-skOqcWZ66yFTQjzWUw8GizMdKKo4' },
        { id: 4, name: 'Regular Maid (Sunita)', details: 'Staff • Flat 102, 103', icon: 'person' }
    ];

    useEffect(() => {
        // Simulate API call
        setLoading(true);
        setTimeout(() => {
            setVisitors(mockVisitors);
            setLoading(false);
        }, 500);
    }, []);

    const filteredVisitors = visitors.filter(v => {
        return searchTerm === '' ||
            v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.flatVisited.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleCheckOut = (id) => {
        setVisitors(visitors.filter(v => v.id !== id));
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">

                {/* Left Column: Visitor Feed */}
                <div className="xl:col-span-8 flex flex-col gap-6">

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-[#1a2632] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-slate-400 text-[20px]">group</span>
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Today</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">142</p>
                            <span className="text-xs text-green-600 font-medium">+12% vs yesterday</span>
                        </div>

                        <div className="bg-white dark:bg-[#1a2632] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ring-1 ring-primary/20">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-primary text-[20px]">login</span>
                                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Currently Inside</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-primary">{visitors.length + 20 /* mock active */}</p>
                                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            </div>
                            <span className="text-xs text-slate-500">Active visitors</span>
                        </div>

                        <div className="bg-white dark:bg-[#1a2632] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-slate-400 text-[20px]">timer</span>
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overstaying</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">3</p>
                            <span class="text-xs text-orange-600 font-medium">&gt; 6 hours</span>
                        </div>

                        <div className="bg-white dark:bg-[#1a2632] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-slate-400 text-[20px]">local_shipping</span>
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Deliveries</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">58</p>
                            <span className="text-xs text-slate-500">Since 6 AM</span>
                        </div>
                    </div>

                    {/* Live Feed Table */}
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Live Visitor Feed</h3>
                                <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold border border-green-200 dark:border-green-800">Live</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">filter_list</span>
                                    Filter
                                </button>
                                <button className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">download</span>
                                    Export
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                        <th className="px-6 py-3 font-semibold w-12">Avatar</th>
                                        <th className="px-6 py-3 font-semibold">Visitor Name</th>
                                        <th className="px-6 py-3 font-semibold">Purpose</th>
                                        <th className="px-6 py-3 font-semibold">Flat Visited</th>
                                        <th className="px-6 py-3 font-semibold">Entry Time</th>
                                        <th className="px-6 py-3 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-slate-500">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                            </td>
                                        </tr>
                                    ) : filteredVisitors.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-slate-500">
                                                No visitors found matching criteria.
                                            </td>
                                        </tr>
                                    ) : filteredVisitors.map(visitor => (
                                        <tr key={visitor.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800">
                                            <td className="px-6 py-4">
                                                {visitor.avatarImage ? (
                                                    <img alt="Visitor" className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-[#1a2632]" src={visitor.avatarImage} />
                                                ) : (
                                                    <div className={`w-10 h-10 rounded-full bg-${visitor.avatarBg}-100 dark:bg-${visitor.avatarBg}-900/30 flex items-center justify-center text-${visitor.avatarBg}-600 dark:text-${visitor.avatarBg}-400`}>
                                                        <span className="material-symbols-outlined">{visitor.avatarIcon}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-900 dark:text-slate-100">{visitor.name}</p>
                                                <p className="text-xs text-slate-500">{visitor.phone}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${visitor.purposeColor}-100 text-${visitor.purposeColor}-700 dark:bg-${visitor.purposeColor}-900/30 dark:text-${visitor.purposeColor}-300`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full bg-${visitor.purposeColor}-500`}></span>
                                                    {visitor.purpose}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <a className="font-medium text-slate-900 dark:text-slate-100 hover:text-primary transition-colors cursor-pointer">{visitor.flatVisited}</a>
                                                <p className="text-xs text-slate-500">{visitor.block}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-slate-900 dark:text-slate-100">{visitor.entryTime}</p>
                                                <p className={`text-xs font-medium ${visitor.isOverstaying ? 'text-red-500' : 'text-slate-500'}`}>{visitor.timeAgo}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleCheckOut(visitor.id)} className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">
                                                    Check Out
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="p-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 mt-auto">
                            <p className="text-sm text-slate-500">Showing {filteredVisitors.length > 0 ? 1 : 0}-{Math.min(4, filteredVisitors.length)} of {filteredVisitors.length + 20} active visitors</p>
                            <div className="flex gap-2">
                                <button className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 disabled:opacity-50" disabled>
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Alerts & Frequent */}
                <div className="xl:col-span-4 flex flex-col gap-6">

                    {/* Emergency Alerts */}
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border-l-4 border-red-500 shadow-sm overflow-hidden">
                        <div className="p-4 bg-red-50 dark:bg-red-900/10 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                                <span className="material-symbols-outlined animate-pulse">emergency_home</span>
                                <h3 className="font-bold">Active Alerts</h3>
                            </div>
                            <span className="px-2 py-0.5 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-100 text-xs font-bold rounded-full">{mockAlerts.length} New</span>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {mockAlerts.map(alert => (
                                <div key={alert.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100">{alert.title}</h4>
                                            <p className="text-sm text-slate-500">{alert.subtitle}</p>
                                        </div>
                                        <span className="text-xs font-medium text-slate-400">{alert.timeAgo}</span>
                                    </div>
                                    <div className="flex gap-2 mt-3 block flex-wrap">
                                        {alert.actions.map((action, idx) => (
                                            <button key={idx} className={`flex-1 min-w-[120px] text-xs font-bold py-2 rounded-lg transition-colors ${idx === 0 && alert.id === 1 ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 text-slate-700 dark:text-slate-200'}`}>
                                                {action}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Frequent Visitors */}
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col flex-1">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">Frequent Visitors</h3>
                            <a className="text-xs font-bold text-primary hover:underline cursor-pointer">View All</a>
                        </div>
                        <div className="p-2 space-y-1">
                            {frequentVisitors.map(freq => (
                                <div key={freq.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                                        {freq.image ? (
                                            <img alt="Service Logo" className="w-full h-full object-cover" src={freq.image} />
                                        ) : (
                                            <span className="material-symbols-outlined text-slate-400">{freq.icon}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{freq.name}</h4>
                                        <p className="text-xs text-slate-500 truncate">{freq.details}</p>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 text-xs font-bold text-white bg-primary hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-all shadow-sm">
                                        Log Entry
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg p-5 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-bold text-lg mb-1">Gate Pass</h3>
                                <p className="text-blue-100 text-xs mb-4">Generate temporary QR codes for contractors.</p>
                                <button className="bg-white text-primary text-xs font-bold px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">Create Pass</button>
                            </div>
                            <span className="material-symbols-outlined text-[48px] opacity-20">qr_code_2</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminVisitorModule;
