import React, { useState, useEffect } from 'react';
import { getComplaints, updateComplaintStatus } from '../../services/dataService'; // Assuming path

const AdminComplaintModule = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('All'); // Changed initial state
    const [filterPriority, setFilterPriority] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchComplaints = async () => {
            setLoading(true);
            try {
                const data = await getComplaints();
                setComplaints(data);
            } catch (error) {
                console.error("Failed to fetch complaints", error);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateComplaintStatus(id, { status: newStatus });
            setComplaints(complaints.map(c =>
                c._id === id ? { ...c, status: newStatus } : c
            ));
        } catch (error) {
            console.error("Failed to update status", error);
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
        switch (status) {
            case 'Open': return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900/50';
            case 'In Progress': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-100 dark:border-blue-900/50';
            case 'Resolved': return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-100 dark:border-green-900/50';
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

    const activeComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;
    const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

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
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">2.4 Days</h3>
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
                                            <button className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Message Resident">
                                                <span className="material-symbols-outlined text-[20px]">chat</span>
                                            </button>
                                            {complaint.status === 'Open' ? (
                                                <button
                                                    onClick={() => handleStatusChange(complaint._id, 'In Progress')}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                                                    Assign
                                                </button>
                                            ) : complaint.status === 'In Progress' ? (
                                                <div className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-slate-100 dark:bg-slate-700 text-xs text-slate-500 dark:text-slate-400 cursor-default border border-transparent">
                                                    <span className="material-symbols-outlined text-[14px]">engineering</span>
                                                    Assigned
                                                </div>
                                            ) : (
                                                <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                    View
                                                </button>
                                            )}
                                            {complaint.status !== 'Resolved' && (
                                                <button
                                                    onClick={() => handleStatusChange(complaint._id, 'Resolved')}
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
        </div>
    );
};

export default AdminComplaintModule;
