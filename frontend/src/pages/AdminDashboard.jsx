import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminComplaintModule from '../components/admin/AdminComplaintModule';
import AdminBillingModule from '../components/admin/AdminBillingModule';
import AdminVisitorModule from '../components/admin/AdminVisitorModule';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('visitors');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Placeholder for other tabs
    const renderPlaceholder = (title) => (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">construction</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{title} Module</h2>
            <p className="text-slate-500 dark:text-slate-400">This module is currently under construction.</p>
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-[#101922] text-slate-900 dark:text-slate-100 font-sans flex flex-col custom-scrollbar">

            {/* Top Navbar */}
            <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#1a2632]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo Area */}
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="text-primary">
                                <span className="material-symbols-outlined text-3xl">security</span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white hidden sm:block">Admin Panel</h1>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex gap-1 md:gap-2">
                            {[
                                { id: 'dashboard', label: 'Overview' },
                                { id: 'visitors', label: 'Visitors' },
                                { id: 'residents', label: 'Residents' },
                                { id: 'complaints', label: 'Complaints' },
                                { id: 'billing', label: 'Billing' },
                                { id: 'notices', label: 'Notices' },
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
                            <button className="relative p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors hidden sm:block bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-[20px]">notifications</span>
                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                            </button>

                            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

                            {/* User Dropdown Profile (simplified for navbar) */}
                            <div className="relative">
                                <div
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 pr-2 rounded-full border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all select-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0 uppercase pointer-events-none">
                                        {user?.name ? user.name.charAt(0) : 'A'}
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white hidden lg:block pointer-events-none">{user?.name || 'Admin'}</span>
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
                                { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
                                { id: 'visitors', icon: 'shield_person', label: 'Visitors & Log' },
                                { id: 'residents', icon: 'apartment', label: 'Residents' },
                                { id: 'complaints', icon: 'forum', label: 'Complaints' },
                                { id: 'billing', icon: 'receipt_long', label: 'Billing' },
                                { id: 'notices', icon: 'notifications_active', label: 'Notices' },
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
                                    <span className={`material-symbols-outlined ${activeTab === item.id ? 'fill-1' : ''}`}>{item.icon}</span>
                                    <span className="text-sm">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content Areas */}
            <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 flex flex-col h-full overflow-hidden"
                    >
                        {activeTab === 'dashboard' && renderPlaceholder('Dashboard')}
                        {activeTab === 'residents' && renderPlaceholder('Residents')}
                        {activeTab === 'notices' && renderPlaceholder('Notices')}
                        {activeTab === 'settings' && renderPlaceholder('Settings')}

                        {activeTab === 'complaints' && (
                            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 custom-scrollbar">
                                <AdminComplaintModule />
                            </div>
                        )}
                        {activeTab === 'billing' && (
                            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 custom-scrollbar">
                                <AdminBillingModule />
                            </div>
                        )}
                        {activeTab === 'visitors' && (
                            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 custom-scrollbar">
                                <AdminVisitorModule />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

        </div>
    );
}
