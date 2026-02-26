import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotices, getEvents, getMyBills, getMyComplaints, getMyVisitors, getPolls } from '../services/dataService';
import ResidentBilling from './ResidentBilling';
import ResidentComplaints from './ResidentComplaints';
import ResidentUnit from './ResidentUnit';
import ResidentVisitors from './ResidentVisitors';
import ResidentCommunity from './ResidentCommunity';

export default function MemberDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [events, setEvents] = useState([]);
    const [bills, setBills] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [visitors, setVisitors] = useState([]);
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [noticesData, eventsData, billsData, complaintsData, visitorsData, pollsData] = await Promise.all([
                    getNotices({ limit: 5 }),
                    getEvents(),
                    getMyBills(),
                    getMyComplaints(),
                    getMyVisitors(),
                    getPolls()
                ]);
                setNotifications(noticesData || []);

                // Merge real events and event notices
                const eventNotices = (noticesData || [])
                    .filter(n => n.category === 'event' && n.eventDetails?.date)
                    .map(n => ({
                        _id: n._id,
                        title: n.title,
                        date: n.eventDetails.date,
                        location: n.eventDetails.location,
                        time: n.eventDetails.time,
                        isNotice: true
                    }));

                const allEvents = [...(Array.isArray(eventsData) ? eventsData : []), ...eventNotices]
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                setEvents(allEvents);
                setBills(Array.isArray(billsData) ? billsData : []);
                setComplaints(Array.isArray(complaintsData) ? complaintsData : []);
                setVisitors(Array.isArray(visitorsData) ? visitorsData : []);
                setPolls(Array.isArray(pollsData) ? pollsData : []);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
        };
        fetchDashboardData();
    }, []);

    const pendingBills = bills.filter(b => b.status === 'pending' || b.status === 'overdue');
    const totalDue = pendingBills.reduce((sum, b) => sum + (b.amount - (b.amountPaid || 0)), 0);
    const earliestDueDate = pendingBills.length > 0 ? new Date(Math.min(...pendingBills.map(b => new Date(b.dueDate)))) : null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Render Overview Tab Content
    const renderOverview = () => (
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#101922] p-4 md:p-6 lg:p-10 custom-scrollbar">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-extrabold mb-2">Welcome back, {user?.name || 'Resident'}! 👋</h1>
                        <p className="text-white/80 max-w-xl text-lg">Here's what's happening in Golden Oaks today. You have 1 new notice and your maintenance bill is due next week.</p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <button onClick={() => setActiveTab('billing')} className="bg-white text-primary px-6 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition-colors shadow-sm">
                                Pay Maintenance
                            </button>
                            <button onClick={() => setActiveTab('complaints')} className="bg-white/20 hover:bg-white/30 text-white px-6 py-2.5 rounded-lg font-bold transition-colors backdrop-blur-sm">
                                Raise Request
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Bill Due Widget */}
                    <div onClick={() => setActiveTab('billing')} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 cursor-pointer hover:border-red-200 dark:hover:border-red-900/50 transition-colors group">
                        <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">receipt_long</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Due Amount</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₹{totalDue.toFixed(2)}</h3>
                            {earliestDueDate ? (
                                <p className={`text-xs font-semibold mt-1 ${earliestDueDate < new Date() ? 'text-red-500' : 'text-amber-500'}`}>
                                    {earliestDueDate < new Date() ? 'Overdue' : `Due by ${earliestDueDate.toLocaleDateString()}`}
                                </p>
                            ) : (
                                <p className="text-xs font-semibold text-green-500 mt-1">All clear</p>
                            )}
                        </div>
                    </div>

                    {/* Active Complaints */}
                    <div onClick={() => setActiveTab('complaints')} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 cursor-pointer hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors group">
                        <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">build</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Open Requests</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {complaints.filter(c => c.status === 'open' || c.status === 'in-progress').length}
                            </h3>
                            <p className="text-xs font-medium text-slate-400 mt-1 line-clamp-1">
                                {complaints.filter(c => c.status === 'open' || c.status === 'in-progress').map(c => c.type).join(', ') || 'No active requests'}
                            </p>
                        </div>
                    </div>

                    {/* Pre-approved Visitors */}
                    <div onClick={() => setActiveTab('visitors')} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 cursor-pointer hover:border-green-200 dark:hover:border-green-900/50 transition-colors group">
                        <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">how_to_reg</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Expected Visitors</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {visitors.filter(v => v.status === 'expected').length}
                            </h3>
                            <button className="text-xs font-bold text-primary hover:underline mt-1">Manage Visitors</button>
                        </div>
                    </div>

                    {/* Community Polls */}
                    <div onClick={() => setActiveTab('community')} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 cursor-pointer hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors group">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">poll</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Active Polls</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {polls.filter(p => p.status === 'active').length}
                            </h3>
                            <button className="text-xs font-bold text-primary hover:underline mt-1">Vote Now</button>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Notices & Announcements (Takes up 2/3) */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">campaign</span>
                                    Notice Board
                                </h3>
                                <button className="text-sm font-semibold text-primary hover:text-blue-700 transition-colors">View All</button>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500">
                                        <span className="material-symbols-outlined text-4xl mb-2 text-slate-300 dark:text-slate-600">inbox</span>
                                        <p>No new notices at this time.</p>
                                    </div>
                                ) : (
                                    notifications.slice(0, 3).map(notice => {
                                        const noticeDate = new Date(notice.createdAt || Date.now());
                                        // Calculate relative time roughly
                                        const diff = Math.round((Date.now() - noticeDate) / (1000 * 60 * 60 * 24));
                                        const timeAgo = diff === 0 ? 'Today' : diff === 1 ? '1 day ago' : `${diff} days ago`;

                                        return (
                                            <div key={notice._id || notice.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{notice.title}</h4>
                                                    <span className={`text-xs font-medium px-2 py-1 rounded capitalize shrink-0 ml-2
                                                        ${notice.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                                                            : notice.priority === 'urgent' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                                                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'}`}>
                                                        {notice.priority || 'Normal'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{notice.content}</p>
                                                <p className="text-xs text-slate-400 mt-3 font-medium flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">account_circle</span>
                                                    Posted by {notice.author?.name || 'Admin'} • {timeAgo}
                                                </p>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Upcoming Events & Quick Actions (Takes up 1/3) */}
                    <div className="flex flex-col gap-6">
                        {/* Events Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">event</span>
                                    Upcoming Events
                                </h3>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                                {events.length === 0 ? (
                                    <p className="text-sm text-center text-slate-500 py-4">No upcoming events right now.</p>
                                ) : (
                                    events.slice(0, 3).map(event => {
                                        const eventDate = new Date(event.date);
                                        const month = eventDate.toLocaleString('default', { month: 'short' });
                                        const day = eventDate.getDate();
                                        return (
                                            <div key={event._id} className="flex gap-4 items-start">
                                                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-center min-w-[50px] border border-slate-200 dark:border-slate-700">
                                                    <p className="text-xs font-bold text-primary uppercase">{month}</p>
                                                    <p className="text-xl font-extrabold text-slate-900 dark:text-white -mt-1">{day.toString().padStart(2, '0')}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{event.title}</h4>
                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{event.location} • {event.time}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <button className="w-full text-center text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white mt-2 transition-colors">View Calendar</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );

    // Placeholder for other tabs
    const renderPlaceholder = (title) => (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full bg-slate-50 dark:bg-[#101922]">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">construction</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{title} Module</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">This section is currently under development. Check back soon for updates!</p>
            <button onClick={() => setActiveTab('overview')} className="mt-6 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors block">
                Back to Overview
            </button>
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-[#101922] text-slate-900 dark:text-slate-100 font-sans flex flex-col">

            {/* Top Navbar */}
            <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#1a2632]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo Area */}
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="text-primary">
                                <span className="material-symbols-outlined text-3xl">apartment</span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white hidden sm:block">SocietyManager</h1>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex gap-1 md:gap-2">
                            {[
                                { id: 'overview', label: 'Overview' },
                                { id: 'unit', label: 'My Unit' },
                                { id: 'billing', label: 'Dues & Bills' },
                                { id: 'complaints', label: 'Complaints' },
                                { id: 'visitors', label: 'Visitors' },
                                { id: 'community', label: 'Community' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                                        ? 'bg-slate-100 dark:bg-slate-800 text-primary dark:text-white font-bold'
                                        : 'text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        {/* User Actions & Mobile Menu Toggle */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <button
                                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                                    className="relative p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors hidden sm:block bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700"
                                >
                                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                                    {notifications.length > 0 && (
                                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isNotifOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50 overflow-hidden"
                                        >
                                            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                                <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                                                <span onClick={() => { setActiveTab('overview'); setIsNotifOpen(false); }} className="text-xs font-bold text-primary cursor-pointer hover:underline">View All</span>
                                            </div>
                                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                                {notifications.length > 0 ? notifications.map(notif => (
                                                    <div
                                                        key={notif._id}
                                                        onClick={() => { setActiveTab('overview'); setIsNotifOpen(false); }}
                                                        className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-slate-50 dark:border-slate-700/50 last:border-0 transition-colors"
                                                    >
                                                        <div className="flex justify-between items-start gap-2">
                                                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{notif.title}</p>
                                                            <span className="shrink-0 text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{new Date(notif.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notif.content}</p>
                                                    </div>
                                                )) : (
                                                    <div className="px-4 py-8 text-center flex flex-col items-center justify-center">
                                                        <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">notifications_off</span>
                                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No new notifications</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

                            {/* User Dropdown Profile (simplified for navbar) */}
                            <div className="relative">
                                <div
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 pr-2 rounded-full border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all select-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0 uppercase pointer-events-none">
                                        {user?.name ? user.name.charAt(0) : 'R'}
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white hidden lg:block pointer-events-none">{user?.name || 'Resident'}</span>
                                    <span className={`material-symbols-outlined text-slate-400 hidden lg:block text-[20px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                </div>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50 overflow-hidden"
                                        >
                                            <button
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    logout();
                                                    navigate('/login');
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium flex items-center gap-2 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">logout</span>
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[20px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a2632]">
                        <nav className="flex flex-col px-4 pt-2 pb-4 space-y-1">
                            {[
                                { id: 'overview', icon: 'home', label: 'Overview' },
                                { id: 'unit', icon: 'door_front', label: 'My Unit' },
                                { id: 'billing', icon: 'receipt_long', label: 'Dues & Bills' },
                                { id: 'complaints', icon: 'engineering', label: 'Complaints' },
                                { id: 'visitors', icon: 'front_hand', label: 'Visitors' },
                                { id: 'community', icon: 'groups', label: 'Community' },
                                { id: 'settings', icon: 'settings', label: 'Settings' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-lg w-full text-left transition-colors ${activeTab === item.id
                                        ? 'bg-slate-100 dark:bg-slate-800 text-primary dark:text-white font-bold'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    <span className={`material-symbols-outlined text-[20px] ${activeTab === item.id ? 'fill-1' : ''}`}>{item.icon}</span>
                                    <span className="text-sm">{item.label}</span>
                                </button>
                            ))}
                            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-3 py-3 rounded-lg w-full text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                <span className="text-sm font-medium">Log Out</span>
                            </button>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden relative z-0 flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 flex flex-col h-full overflow-hidden"
                    >
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'unit' && <ResidentUnit />}
                        {activeTab === 'billing' && <ResidentBilling />}
                        {activeTab === 'complaints' && <ResidentComplaints />}
                        {activeTab === 'visitors' && <ResidentVisitors />}
                        {activeTab === 'community' && <ResidentCommunity />}
                        {activeTab === 'settings' && renderPlaceholder('Settings')}
                    </motion.div>
                </AnimatePresence>
            </main>

        </div>
    );
}
