import React, { useState, useEffect } from 'react';
import { getComplaints, updateComplaintStatus, addComplaintMessage, getComplaintById, getComplaintStats } from '../../services/dataService'; // Assuming path
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminComplaintModule = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('All'); // Changed initial state
    const [filterPriority, setFilterPriority] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [adminMessage, setAdminMessage] = useState('');
    const [resolutionNote, setResolutionNote] = useState('');
    const [stats, setStats] = useState({ activeCount: 0, resolvedThisMonth: 0, avgResolutionTime: 0 });

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [complaintData, statsData] = await Promise.all([
                    getComplaints(),
                    getComplaintStats()
                ]);
                setComplaints(complaintData);
                setStats(statsData);
            } catch (error) {
                console.error("Failed to fetch initial data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleOpenDetails = async (complaint) => {
        setSelectedComplaint(complaint);
        setIsMessageModalOpen(true);
        try {
            const latestData = await getComplaintById(complaint._id);
            setSelectedComplaint(latestData);
            // Also update the complaint in the list if needed
            setComplaints(prev => prev.map(c => c._id === latestData._id ? latestData : c));
        } catch (error) {
            console.error("Failed to fetch latest complaint data", error);
            // Fallback to what we have if fetch fails
        }
    };

    const handleStatusChange = async (id, newStatus, note = '') => {
        try {
            const updated = await updateComplaintStatus(id, { status: newStatus, note });
            setComplaints(complaints.map(c =>
                c._id === id ? updated : c
            ));
            if (selectedComplaint && selectedComplaint._id === id) {
                setSelectedComplaint(updated);
            }
            // Refresh stats after status change
            const statsData = await getComplaintStats();
            setStats(statsData);
            toast.success(`Complaint marked as ${newStatus}`);
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Failed to update status");
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!adminMessage.trim()) return;
        try {
            const updated = await addComplaintMessage(selectedComplaint._id, { content: adminMessage });
            toast.success("Message sent to resident");
            setAdminMessage('');
            setSelectedComplaint(updated);
            setComplaints(complaints.map(c =>
                c._id === updated._id ? updated : c
            ));
            // Refresh stats after status change
            const statsData = await getComplaintStats();
            setStats(statsData);
        } catch (error) {
            console.error("Failed to send message", error);
            toast.error("Failed to send message");
        }
    };

    // Helper function for priority badge colors
    const getPriorityBadgeColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-100 dark:border-red-900/50';
            case 'Medium': return 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-100 dark:border-orange-900/50';
            case 'Low': return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-100 dark:border-green-900/50';
            default: return 'bg-slate-50 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400 border-slate-100 dark:border-slate-900/50';
        }
    };

    // Helper function for status badge colors
    const getStatusBadgeColor = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'open': return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900/50';
            case 'in_progress':
            case 'in progress': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-100 dark:border-blue-900/50';
            case 'resolved': return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-100 dark:border-green-900/50';
            default: return 'bg-slate-50 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400 border-slate-100 dark:border-slate-900/50';
        }
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesCategory = filterCategory ? c.category?.toLowerCase() === filterCategory.toLowerCase() : true;
        const matchesStatus = filterStatus === 'All' ? true : c.status?.toLowerCase() === filterStatus.toLowerCase().replace(' ', '_');
        const matchesPriority = filterPriority ? c.priority?.toLowerCase() === filterPriority.toLowerCase() : true;
        const matchesSearch = searchTerm === '' ||
            c?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c?.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c?.user?.flatNo?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesStatus && matchesPriority && matchesSearch;
    });

    const activeComplaintsCount = stats.activeCount;
    const resolvedCount = stats.resolvedThisMonth;
    const avgTime = stats.avgResolutionTime;

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1 */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <span className="material-symbols-outlined text-primary text-2xl">campaign</span>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            +2%
                        </span>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Active Complaints</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{activeComplaintsCount}</h3>
                    </div>
                </div>
                {/* Card 2 */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">check_circle</span>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            +15%
                        </span>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Resolved This Month</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{resolvedCount}</h3>
                    </div>
                </div>
                {/* Card 3 */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-2xl">timer</span>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                            <span className="material-symbols-outlined text-[14px]">trending_down</span>
                            -10%
                        </span>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Avg Resolution Time</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{avgTime} Days</h3>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col xl:flex-row gap-4 mb-6 justify-between items-center">
                <div className="relative w-full xl:max-w-md group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                    </div>
                    <input
                        className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm shadow-sm"
                        placeholder="Search by resident, flat #, or issue..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3 w-full xl:w-auto overflow-x-auto pb-2 sm:pb-0">
                    <select
                        className="form-select block px-3 py-2.5 text-sm border-none bg-white dark:bg-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300 min-w-[140px]"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="">Category: All</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="electrical">Electrical</option>
                        <option value="security">Security</option>
                        <option value="housekeeping">Housekeeping</option>
                        <option value="parking">Parking</option>
                    </select>
                    <select
                        className="form-select block px-3 py-2.5 text-sm border-none bg-white dark:bg-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300 min-w-[130px]"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">Status: All</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                    <select
                        className="form-select block px-3 py-2.5 text-sm border-none bg-white dark:bg-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300 min-w-[130px]"
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                    >
                        <option value="">Priority: All</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>

            {/* Main Data Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">ID</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Subject / Category</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Resident / Flat</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Priority</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date Logged</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-slate-500">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                    </td>
                                </tr>
                            ) : filteredComplaints.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-slate-500">
                                        No complaints found matching criteria.
                                    </td>
                                </tr>
                            ) : filteredComplaints.map((complaint) => (
                                <tr key={complaint._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">#{complaint._id?.slice(-4).toUpperCase()}</span>
                                    </td>
                                    <td className="py-4 px-6 w-full max-w-sm">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{complaint.subject}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{complaint.category}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{complaint.user?.name || 'Unknown'}</p>
                                        <p className="text-xs text-slate-500">{complaint.user?.flatNo || 'N/A'}</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getPriorityBadgeColor(complaint.priority)}`}>
                                            {complaint.priority}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                                            {new Date(complaint.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusBadgeColor(complaint.status)}`}>
                                            {complaint.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenDetails(complaint)}
                                                className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Message Resident"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">chat</span>
                                            </button>
                                            {complaint.status === 'open' ? (
                                                <button
                                                    onClick={() => handleStatusChange(complaint._id, 'in_progress')}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                                                    Assign
                                                </button>
                                            ) : complaint.status === 'in_progress' ? (
                                                <div className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-slate-100 dark:bg-slate-700 text-xs text-slate-500 dark:text-slate-400 cursor-default border border-transparent">
                                                    <span className="material-symbols-outlined text-[14px]">engineering</span>
                                                    Assigned
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleOpenDetails(complaint)}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                >
                                                    View
                                                </button>
                                            )}
                                            {complaint.status !== 'resolved' && (
                                                <button
                                                    onClick={() => handleOpenDetails(complaint)}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-md hover:bg-blue-600 shadow-sm transition-colors"
                                                >
                                                    Resolve
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-xl mb-8">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    Showing <span className="font-medium text-slate-900 dark:text-white">
                        {filteredComplaints.length > 0 ? 1 : 0}
                    </span> to <span className="font-medium text-slate-900 dark:text-white">
                        {Math.min(5, filteredComplaints.length)}
                    </span> of <span className="font-medium text-slate-900 dark:text-white">{filteredComplaints.length}</span> results
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
                        Previous
                    </button>
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={filteredComplaints.length <= 5}>
                        Next
                    </button>
                </div>
            </div>

            {/* Detailed View Modal */}
            <AnimatePresence>
                {selectedComplaint && (
                    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedComplaint.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                        <span className="material-symbols-outlined text-[28px]">
                                            {selectedComplaint.category === 'Plumbing' ? 'faucet' : selectedComplaint.category === 'Electrical' ? 'bolt' : 'construction'}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusBadgeColor(selectedComplaint.status)}`}>
                                                {selectedComplaint.status.replace('_', ' ')}
                                            </span>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500">
                                                {selectedComplaint.category}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-none">{selectedComplaint.subject}</h2>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedComplaint(null)}
                                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
                                    {/* Column 1: Resident & Description */}
                                    <div className="p-6 space-y-6">
                                        <section>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Resident Information</h4>
                                            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                    {selectedComplaint.user?.name ? selectedComplaint.user.name.charAt(0) : 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">{selectedComplaint.user?.name || 'Unknown'}</p>
                                                    <p className="text-sm text-slate-500">Flat {selectedComplaint.user?.flatNo || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Issue Description</h4>
                                            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 italic">
                                                "{selectedComplaint.description}"
                                            </div>
                                        </section>

                                        <section>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Priority</h4>
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border ${getPriorityBadgeColor(selectedComplaint.priority)}`}>
                                                {selectedComplaint.priority} Priority
                                            </span>
                                        </section>

                                        {selectedComplaint.status !== 'resolved' && (
                                            <section className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Update Status</h4>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {selectedComplaint.status === 'open' && (
                                                        <button
                                                            onClick={() => handleStatusChange(selectedComplaint._id, 'in_progress', 'Technician assigned to visit')}
                                                            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors border border-blue-100 dark:border-blue-800"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">engineering</span>
                                                            Assign
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleStatusChange(selectedComplaint._id, 'resolved', 'Issue successfully resolved')}
                                                        className="col-span-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                                        Resolve
                                                    </button>
                                                </div>
                                            </section>
                                        )}
                                    </div>

                                    {/* Column 2: Timeline */}
                                    <div className="p-6 bg-slate-50/30 dark:bg-slate-900/20">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Activity Log</h4>
                                        <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800/50">
                                            {selectedComplaint.timeline?.map((item, idx) => (
                                                <div key={idx} className="relative pl-8">
                                                    <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-primary z-10 flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <h5 className="font-bold text-slate-900 dark:text-white text-xs capitalize">{item.status.replace('_', ' ')}</h5>
                                                            <span className="text-[10px] text-slate-400 font-medium">{new Date(item.date).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 leading-snug">{item.note}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Column 3: Communication */}
                                    <div className="p-6 flex flex-col bg-slate-50/50 dark:bg-slate-900/40 min-h-[450px]">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Communication</h4>
                                        <div className="flex-1 space-y-4 mb-6 overflow-y-auto custom-scrollbar px-1">
                                            {(selectedComplaint.messages || []).length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center opacity-30">
                                                    <span className="material-symbols-outlined text-5xl mb-3">forum</span>
                                                    <p className="text-sm font-medium">No messages yet</p>
                                                </div>
                                            ) : (
                                                selectedComplaint.messages.map((msg, idx) => (
                                                    <div key={idx} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                                                        <div className={`max-w-[90%] p-3.5 rounded-2xl text-sm shadow-sm ${msg.sender === 'admin'
                                                            ? 'bg-primary text-white rounded-tr-none'
                                                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 rounded-tl-none'
                                                            }`}>
                                                            {msg.content}
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 mt-1.5 px-1 font-medium italic">
                                                            {msg.sender === 'admin' ? 'You' : selectedComplaint.user?.name} • {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <form onSubmit={handleSendMessage} className="relative">
                                            <input
                                                type="text"
                                                value={adminMessage}
                                                onChange={(e) => setAdminMessage(e.target.value)}
                                                placeholder="Write a reply to resident..."
                                                className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-xl dark:shadow-none transition-all placeholder:text-slate-400"
                                            />
                                            <button
                                                type="submit"
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">send</span>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminComplaintModule;
