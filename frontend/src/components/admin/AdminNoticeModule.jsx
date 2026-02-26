import React, { useState, useEffect } from 'react';
import { getNotices, createNotice, deleteNotice } from '../../services/dataService';
import { motion, AnimatePresence } from 'framer-motion';

const AdminNoticeModule = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'general',
        type: 'announcement',
        priority: 'medium',
        eventDetails: {
            date: '',
            time: '',
            location: ''
        }
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchNotices();
    }, [filterCategory, searchTerm]);

    const fetchNotices = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filterCategory !== 'all') params.category = filterCategory;
            if (searchTerm) params.search = searchTerm;
            const data = await getNotices(params);
            setNotices(data);
        } catch (error) {
            console.error("Failed to fetch notices", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this notice?")) return;
        try {
            await deleteNotice(id);
            setNotices(notices.filter(n => n._id !== id));
        } catch (error) {
            console.error("Failed to delete notice", error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const newNotice = await createNotice(formData);
            setNotices([newNotice, ...notices]);
            setIsModalOpen(false);
            setFormData({
                title: '',
                content: '',
                category: 'general',
                type: 'announcement',
                priority: 'medium',
                eventDetails: { date: '', time: '', location: '' }
            });
        } catch (error) {
            console.error("Failed to create notice", error);
            alert("Failed to create notice: " + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    const getPriorityBadgeColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300';
            case 'medium': return 'bg-orange-50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300';
            case 'low': return 'bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-300';
            default: return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Notice Board</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Publish and manage community announcements and notices.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-all shadow-sm shadow-blue-500/20"
                    >
                        <span className="material-symbols-outlined text-[20px]">add_alert</span>
                        <span>Post Notice</span>
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:max-w-md group">
                    <span className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-primary transition-colors material-symbols-outlined text-[20px]">search</span>
                    <input
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                        placeholder="Search notices..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <select
                        className="w-full sm:w-auto px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer shadow-sm"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        <option value="general">General</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="event">Event</option>
                        <option value="emergency">Emergency</option>
                    </select>
                </div>
            </div>

            {/* Notices List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : notices.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">campaign</span>
                        <p>No notices found matching your local criteria.</p>
                    </div>
                ) : (
                    notices.map((notice) => (
                        <div key={notice._id} className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPriorityBadgeColor(notice.priority)} uppercase tracking-wider`}>
                                    {notice.priority || 'Normal'}
                                </span>
                                <div className="flex gap-2 text-slate-400">
                                    <button onClick={() => handleDelete(notice._id)} className="hover:text-red-500 transition-colors" title="Delete Notice">
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{notice.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-grow">{notice.content}</p>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mt-auto">
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                    {new Date(notice.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1 capitalize">
                                    <span className="material-symbols-outlined text-[14px]">category</span>
                                    {notice.category}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Notice Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Notice</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                <form id="notice-form" onSubmit={handleCreate} className="flex flex-col gap-4">

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white transition-all shadow-sm"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="E.g., Scheduled Water Supply Interruption"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                            <select
                                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white transition-all shadow-sm cursor-pointer"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="general">General</option>
                                                <option value="maintenance">Maintenance</option>
                                                <option value="event">Event</option>
                                                <option value="emergency">Emergency</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                                            <select
                                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white transition-all shadow-sm cursor-pointer"
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                                <option value="urgent">Urgent</option>
                                            </select>
                                        </div>
                                    </div>

                                    {formData.category === 'event' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30"
                                        >
                                            <div className="sm:col-span-3 pb-1">
                                                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Event Details</h4>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Date</label>
                                                <input
                                                    required={formData.category === 'event'}
                                                    type="date"
                                                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white transition-all shadow-sm"
                                                    value={formData.eventDetails.date}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        eventDetails: { ...formData.eventDetails, date: e.target.value }
                                                    })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Time</label>
                                                <input
                                                    placeholder="6:00 PM"
                                                    required={formData.category === 'event'}
                                                    type="text"
                                                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white transition-all shadow-sm"
                                                    value={formData.eventDetails.time}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        eventDetails: { ...formData.eventDetails, time: e.target.value }
                                                    })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Location</label>
                                                <input
                                                    placeholder="Club House"
                                                    required={formData.category === 'event'}
                                                    type="text"
                                                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white transition-all shadow-sm"
                                                    value={formData.eventDetails.location}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        eventDetails: { ...formData.eventDetails, location: e.target.value }
                                                    })}
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content/Description *</label>
                                        <textarea
                                            required
                                            rows="5"
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white transition-all shadow-sm resize-none custom-scrollbar"
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            placeholder="Write the full details of the notice here..."
                                        />
                                    </div>

                                </form>
                            </div>
                            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="notice-form"
                                    disabled={submitting}
                                    className="flex justify-center items-center px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed min-w-[100px]"
                                >
                                    {submitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        "Publish Notice"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminNoticeModule;
