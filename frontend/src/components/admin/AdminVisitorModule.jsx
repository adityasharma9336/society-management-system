import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllVisitors, exitVisitor, updateVisitorStatus, addVisitor, getUsers } from '../../services/dataService';
import { toast } from 'react-toastify';

// Helper functions (defined outside component to avoid hoisting issues and unnecessary re-creations)
const getVisitorPurposeColor = (type) => {
    switch (type) {
        case 'Delivery Partner': return 'orange';
        case 'Home Service': return 'purple';
        case 'Daily Help': return 'teal';
        case 'Worker': return 'indigo';
        case 'Personal Guest': return 'blue';
        default: return 'slate';
    }
};

const getVisitorIcon = (type) => {
    switch (type) {
        case 'Delivery Partner': return 'local_shipping';
        case 'Home Service': return 'build';
        case 'Daily Help': return 'cleaning_services';
        case 'Worker': return 'engineering';
        case 'Personal Guest': return 'person';
        default: return 'badge';
    }
};

const formatTimeAgo = (dateString, isExpected = false) => {
    if (!dateString) return isExpected ? "Pending" : "Unknown";
    const targetTime = new Date(dateString).getTime();
    if (isNaN(targetTime)) return isExpected ? "Pending" : "Unknown";

    const diffMs = isExpected ? targetTime - Date.now() : Date.now() - targetTime;

    if (diffMs < 0 && isExpected) return "Overdue";

    const diffMins = Math.floor(Math.abs(diffMs) / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffHours > 0) return isExpected ? `In ${diffHours}h ${diffMins % 60}m` : `${diffHours}h ${diffMins % 60}m ago`;
    return isExpected ? `In ${diffMins}m` : `${diffMins}m ago`;
};

const isToday = (dateString) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return false;
    const today = new Date();
    return d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();
};

const colorStyles = {
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    teal: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800",
    indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    slate: "bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
};

const getVisitorTypeStyles = (type) => colorStyles[getVisitorPurposeColor(type)] || colorStyles.slate;

const AdminVisitorModule = () => {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGatePass, setSelectedGatePass] = useState(null);
    // 'all' | 'today' | 'inside' | 'overstaying' | 'deliveries' | 'workers' | 'pending'
    const [filterMode, setFilterMode] = useState('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [residents, setResidents] = useState([]);
    const [createFormData, setCreateFormData] = useState({
        name: '',
        phone: '',
        type: 'Personal Guest',
        residentId: '',
        expectedDate: new Date().toISOString().slice(0, 16)
    });

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [vData, rData] = await Promise.all([
                getAllVisitors(),
                getUsers()
            ]);
            setVisitors(vData || []);
            setResidents(rData || []);
        } catch (error) {
            console.error("Failed to fetch initial data", error);
            toast.error("Failed to load data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleCheckOut = async (id) => {
        try {
            await exitVisitor(id);
            // Re-fetch or update local state
            setVisitors(visitors.map(v => v._id === id ? { ...v, status: 'checked_out', exitTime: Date.now() } : v));
            toast.success('Visitor checked out');
        } catch (error) {
            console.error("Failed to checkout visitor", error);
            toast.error("Failed to check out visitor.");
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const updatedVisitor = await updateVisitorStatus(id, { status });
            setVisitors(visitors.map(v => v._id === id ? updatedVisitor : v));
            toast.success(`Visitor ${status === 'approved' ? 'approved' : status === 'checked_in' ? 'checked in' : 'rejected'}`);
        } catch (error) {
            console.error("Failed to update visitor status", error);
            toast.error("Failed to update visitor status.");
        }
    };

    const handleCreatePass = async (e) => {
        e.preventDefault();
        try {
            const newVisitor = await addVisitor({
                ...createFormData,
                status: 'approved' // Admins create already approved passes
            });
            setVisitors([newVisitor, ...visitors]);
            setIsCreateModalOpen(false);
            setCreateFormData({
                name: '',
                phone: '',
                type: 'Personal Guest',
                residentId: '',
                expectedDate: new Date().toISOString().slice(0, 16)
            });
            toast.success('Gate Pass created successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create pass');
        }
    };

    // Active Alerts: Visitors overstaying more than 6 hours
    const activeAlerts = visitors
        .filter(v => v.status === 'checked_in' && new Date(v.createdAt) < new Date(Date.now() - 6 * 60 * 60 * 1000))
        .map(v => ({
            id: v._id,
            title: 'Visitor Overstaying',
            subtitle: `Visitor: ${v.name} (Flat ${v.resident?.flatNo || 'N/A'})`,
            timeAgo: formatTimeAgo(v.createdAt, false),
            actions: ['Call Resident', 'Force Checkout'],
            visitor: v
        }));

    // Frequent visitors: Group by phone/name
    const frequentVisitorsMap = visitors.reduce((acc, v) => {
        const key = v.phone || v.name;
        if (!key) return acc;
        if (!acc[key]) {
            acc[key] = { count: 0, latest: v };
        }
        acc[key].count++;
        if (new Date(v.createdAt) > new Date(acc[key].latest.createdAt)) {
            acc[key].latest = v;
        }
        return acc;
    }, {});

    const frequentVisitors = Object.values(frequentVisitorsMap)
        .filter(entry => entry.count >= 2 && entry.latest.name) // At least 2 visits and must have a name
        .sort((a, b) => b.count - a.count)
        .slice(0, 4) // Top 4
        .map((entry, idx) => ({
            id: entry.latest._id,
            name: entry.latest.name,
            details: `${entry.latest.type} • ${entry.count} visits`,
            icon: getVisitorIcon(entry.latest.type),
            passCode: entry.latest.passCode // Include passCode for the "Pass" button in frequent visitors
        }));

    // Helper functions for UI mapping

    // Stats calculation
    const totalToday = visitors.filter(v => isToday(v.createdAt) || isToday(v.expectedDate) || v.status === 'checked_in').length;
    const currentlyInside = visitors.filter(v => v.status === 'checked_in').length;

    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const overstayingCount = visitors.filter(v => v.status === 'checked_in' && new Date(v.createdAt) < sixHoursAgo).length;

    const pendingCount = visitors.filter(v => v.status === 'pending').length;

    const workerCount = visitors.filter(v => ['Worker', 'Daily Help', 'Home Service'].includes(v.type) && (isToday(v.createdAt) || isToday(v.expectedDate) || v.status === 'checked_in')).length;

    const deliveriesToday = visitors.filter(v => v.type === 'Delivery Partner' && (isToday(v.createdAt) || isToday(v.expectedDate) || v.status === 'checked_in')).length;

    const filteredVisitors = visitors.filter(v => {
        const matchesSearch = searchTerm === '' ||
            v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.resident?.flatNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.resident?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesFilter = true;
        if (filterMode === 'today') {
            matchesFilter = isToday(v.createdAt) || isToday(v.expectedDate) || v.status === 'checked_in';
        } else if (filterMode === 'inside') {
            matchesFilter = v.status === 'checked_in';
        } else if (filterMode === 'overstaying') {
            matchesFilter = v.status === 'checked_in' && new Date(v.createdAt) < sixHoursAgo;
        } else if (filterMode === 'deliveries') {
            matchesFilter = v.type === 'Delivery Partner' && (isToday(v.createdAt) || isToday(v.expectedDate) || v.status === 'checked_in');
        } else if (filterMode === 'pending') {
            matchesFilter = v.status === 'pending';
        } else if (filterMode === 'workers') {
            matchesFilter = ['Worker', 'Daily Help', 'Home Service'].includes(v.type) && (isToday(v.createdAt) || isToday(v.expectedDate) || v.status === 'checked_in');
        } else {
            // 'all' — show everything active/relevant
            matchesFilter = v.status !== 'checked_out';
        }

        return matchesSearch && matchesFilter;
    });

    const toggleFilter = (mode) => setFilterMode(prev => prev === mode ? 'all' : mode);

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">

                {/* Left Column: Visitor Feed */}
                <div className="xl:col-span-8 flex flex-col gap-6">

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Total Today */}
                        <div
                            onClick={() => toggleFilter('today')}
                            className={`bg-white dark:bg-[#1a2632] p-4 rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition-all select-none ${filterMode === 'today'
                                ? 'border-slate-500 ring-2 ring-slate-400/50'
                                : 'border-slate-200 dark:border-slate-800'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-slate-400 text-[20px]">group</span>
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Today</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalToday}</p>
                            <span className="text-xs text-slate-400 font-medium">
                                {filterMode === 'today' ? '✓ Filtering table' : 'Click to filter'}
                            </span>
                        </div>

                        {/* Currently Inside */}
                        <div
                            onClick={() => toggleFilter('inside')}
                            className={`bg-white dark:bg-[#1a2632] p-4 rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition-all select-none ${filterMode === 'inside'
                                ? 'border-primary ring-2 ring-primary/40'
                                : 'border-slate-200 dark:border-slate-800 ring-1 ring-primary/20'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-primary text-[20px]">login</span>
                                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Currently Inside</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-primary">{currentlyInside}</p>
                                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            </div>
                            <span className="text-xs text-slate-400">
                                {filterMode === 'inside' ? '✓ Filtering table' : 'Active visitors'}
                            </span>
                        </div>

                        {/* Overstaying */}
                        <div
                            onClick={() => toggleFilter('overstaying')}
                            className={`bg-white dark:bg-[#1a2632] p-4 rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition-all select-none ${filterMode === 'overstaying'
                                ? 'border-orange-500 ring-2 ring-orange-400/50'
                                : 'border-slate-200 dark:border-slate-800'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`material-symbols-outlined text-[20px] ${overstayingCount > 0 ? 'text-orange-500' : 'text-slate-400'}`}>timer</span>
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overstaying</span>
                            </div>
                            <p className={`text-2xl font-bold ${overstayingCount > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-900 dark:text-slate-100'}`}>{overstayingCount}</p>
                            <span className="text-xs text-orange-600 font-medium">
                                {filterMode === 'overstaying' ? '✓ Filtering table' : '> 6 hours'}
                            </span>
                        </div>

                        {/* Deliveries */}
                        <div
                            onClick={() => toggleFilter('deliveries')}
                            className={`bg-white dark:bg-[#1a2632] p-4 rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition-all select-none ${filterMode === 'deliveries'
                                ? 'border-orange-400 ring-2 ring-orange-300/50'
                                : 'border-slate-200 dark:border-slate-800'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-slate-400 text-[20px]">local_shipping</span>
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Deliveries</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{deliveriesToday}</p>
                            <span className="text-xs text-slate-400">
                                {filterMode === 'deliveries' ? '✓ Filtering table' : 'Since 12 AM'}
                            </span>
                        </div>

                        {/* Workers */}
                        <div
                            onClick={() => toggleFilter('workers')}
                            className={`bg-white dark:bg-[#1a2632] p-4 rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition-all select-none ${filterMode === 'workers'
                                ? 'border-indigo-400 ring-2 ring-indigo-300/50'
                                : 'border-slate-200 dark:border-slate-800'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-indigo-500 text-[20px]">engineering</span>
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Workers</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{workerCount}</p>
                            <span className="text-xs text-slate-400">
                                {filterMode === 'workers' ? '✓ Filtering table' : 'Staff & Help'}
                            </span>
                        </div>

                        {/* Pending Approvals */}
                        <div
                            onClick={() => toggleFilter('pending')}
                            className={`bg-white dark:bg-[#1a2632] p-4 rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition-all select-none ${filterMode === 'pending'
                                ? 'border-amber-500 ring-2 ring-amber-400/50'
                                : 'border-slate-200 dark:border-slate-800 ring-1 ring-amber-500/20'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-amber-500 text-[20px]">pending_actions</span>
                                <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending Approvals</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                            </div>
                            <span className="text-xs text-slate-400">
                                {filterMode === 'pending' ? '✓ Filtering table' : 'Action Required'}
                            </span>
                        </div>
                    </div>

                    {/* Live Feed Table */}
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Live Visitor Feed</h3>
                                <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold border border-green-200 dark:border-green-800">Live</span>
                                {filterMode !== 'all' && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800">
                                        Filtered: {filterMode.charAt(0).toUpperCase() + filterMode.slice(1)}
                                        <button onClick={() => setFilterMode('all')} className="ml-1 hover:text-red-500 transition-colors">✕</button>
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <span className="absolute left-3 top-1.5 text-slate-400 material-symbols-outlined text-[16px]">search</span>
                                    <input
                                        className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary/50"
                                        placeholder="Search..."
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                        <th className="px-6 py-3 font-semibold w-12">Type</th>
                                        <th className="px-6 py-3 font-semibold">Visitor Name</th>
                                        <th className="px-6 py-3 font-semibold">Purpose</th>
                                        <th className="px-6 py-3 font-semibold">Host / Flat</th>
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
                                                {filterMode !== 'all'
                                                    ? `No visitors found for filter: "${filterMode}". Click the card again to clear.`
                                                    : 'No active visitors found matching criteria.'}
                                            </td>
                                        </tr>
                                    ) : filteredVisitors.map(visitor => {
                                        const purposeColor = getVisitorPurposeColor(visitor.type);
                                        const isOverstaying = visitor.status === 'checked_in' && new Date(visitor.createdAt) < sixHoursAgo;

                                        return (
                                            <tr key={visitor._id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800">
                                                <td className="px-6 py-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getVisitorTypeStyles(visitor.type)}`}>
                                                        <span className="material-symbols-outlined">{getVisitorIcon(visitor.type)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-slate-900 dark:text-slate-100">{visitor.name}</p>
                                                    <p className="text-xs text-slate-500">{visitor.phone}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getVisitorTypeStyles(visitor.type)}`}>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                        {visitor.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <a className="font-medium text-slate-900 dark:text-slate-100">{visitor.resident?.name || 'Unknown'}</a>
                                                    <p className="text-xs text-slate-500">Flat {visitor.resident?.flatNo || 'N/A'}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-slate-900 dark:text-slate-100">
                                                        {visitor.status === 'expected'
                                                            ? (visitor.expectedDate ? new Date(visitor.expectedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD')
                                                            : new Date(visitor.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                        }
                                                    </p>
                                                    <p className={`text-xs font-medium ${isOverstaying ? 'text-red-500' : 'text-slate-500'}`}>
                                                        {visitor.status === 'expected'
                                                            ? (visitor.expectedDate ? formatTimeAgo(visitor.expectedDate, true) : 'Pending')
                                                            : formatTimeAgo(visitor.createdAt, false)
                                                        }
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {visitor.status === 'pending' ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleUpdateStatus(visitor._id, 'approved')}
                                                                className="text-xs font-bold text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg transition-colors"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(visitor._id, 'denied')}
                                                                className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : visitor.status === 'expected' || visitor.status === 'approved' ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => setSelectedGatePass({
                                                                    id: visitor._id,
                                                                    name: visitor.name,
                                                                    details: `${visitor.type} • Flat ${visitor.resident?.flatNo}`,
                                                                    icon: getVisitorIcon(visitor.type),
                                                                    passCode: visitor.passCode,
                                                                    resident: visitor.resident?.name
                                                                })}
                                                                className="text-xs font-bold text-white bg-primary hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                                            >
                                                                <span className="material-symbols-outlined text-xs">qr_code_2</span> Pass
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(visitor._id, 'checked_in')}
                                                                className="text-xs font-bold text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                                            >
                                                                <span className="material-symbols-outlined text-xs">login</span> Check In
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(visitor._id, 'denied')}
                                                                className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : visitor.status === 'checked_in' ? (
                                                        <button onClick={() => handleCheckOut(visitor._id)} className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">
                                                            Check Out
                                                        </button>
                                                    ) : visitor.status === 'denied' ? (
                                                        <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg">Rejected</span>
                                                    ) : (
                                                        <span className="text-xs">Left</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="p-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 mt-auto">
                            <p className="text-sm text-slate-500">
                                Showing {filteredVisitors.length} {filterMode !== 'all' ? `"${filterMode}"` : 'active'} visitors
                                {filterMode !== 'all' && (
                                    <button onClick={() => setFilterMode('all')} className="ml-2 text-primary hover:underline font-semibold">Clear filter</button>
                                )}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Right Column: Alerts & Frequent */}
                <div className="xl:col-span-4 flex flex-col gap-6">


                    {/* Frequent Visitors */}
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col flex-1">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">Frequent Visitors</h3>
                            <a className="text-xs font-bold text-primary hover:underline cursor-pointer">View All</a>
                        </div>
                        <div className="p-2 space-y-1">
                            {frequentVisitors.length === 0 ? (
                                <div className="p-4 text-center text-slate-500 text-sm">Not enough data to calculate frequent visitors</div>
                            ) : (
                                frequentVisitors.map(freq => (
                                    <div key={freq.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                                            {freq.image ? (
                                                <img alt="Service Logo" className="w-full h-full object-cover" src={freq.image} />
                                            ) : (
                                                <span className="material-symbols-outlined">{freq.icon || 'person'}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{freq.name}</h4>
                                            <p className="text-xs text-slate-500 truncate">{freq.details}</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedGatePass(freq)}
                                            className="opacity-0 group-hover:opacity-100 text-xs font-bold text-white bg-primary hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-all shadow-sm flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">qr_code_2</span> Pass
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg p-5 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-bold text-lg mb-1">Gate Pass</h3>
                                <p className="text-blue-100 text-xs mb-4">Generate temporary QR codes for contractors.</p>
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="bg-white text-primary text-xs font-bold px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    Create Pass
                                </button>
                            </div>
                            <span className="material-symbols-outlined text-[48px] opacity-20">qr_code_2</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Create Pass Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setIsCreateModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">add_card</span>
                                    Create Gate Pass
                                </h3>
                                <button onClick={() => setIsCreateModalOpen(false)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <form onSubmit={handleCreatePass} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Visitor Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                                            placeholder="Full Name"
                                            value={createFormData.name}
                                            onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                                            placeholder="Optional"
                                            value={createFormData.phone}
                                            onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Visitor Type</label>
                                        <select
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                                            value={createFormData.type}
                                            onChange={(e) => setCreateFormData({ ...createFormData, type: e.target.value })}
                                        >
                                            <option value="Personal Guest">Personal Guest</option>
                                            <option value="Delivery Partner">Delivery Partner</option>
                                            <option value="Home Service">Home Service</option>
                                            <option value="Daily Help">Daily Help</option>
                                            <option value="Worker">Worker / Staff</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Host Resident</label>
                                        <select
                                            required
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                                            value={createFormData.residentId}
                                            onChange={(e) => setCreateFormData({ ...createFormData, residentId: e.target.value })}
                                        >
                                            <option value="">Select a Resident</option>
                                            {residents.map(res => (
                                                <option key={res._id} value={res._id}>
                                                    {res.name} (Flat {res.flatNo})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expected Arrival</label>
                                        <input
                                            required
                                            type="datetime-local"
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                                            value={createFormData.expectedDate}
                                            onChange={(e) => setCreateFormData({ ...createFormData, expectedDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm transition-colors hover:bg-slate-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-sm transition-colors hover:bg-blue-600 shadow-sm shadow-primary/30"
                                    >
                                        Create & Approve
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Gate Pass Modal */}
            <AnimatePresence>
                {selectedGatePass && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setSelectedGatePass(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">badge</span>
                                    Digital Gate Pass
                                </h3>
                                <button
                                    onClick={() => setSelectedGatePass(null)}
                                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            {/* Pass Content */}
                            <div className="p-8 flex flex-col items-center">
                                {/* Profile / Type */}
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 ring-4 ring-white dark:ring-slate-900 shadow-sm z-10">
                                    {selectedGatePass.image ? (
                                        <img src={selectedGatePass.image} alt={selectedGatePass.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-3xl">{selectedGatePass.icon || 'person'}</span>
                                    )}
                                </div>

                                <h2 className="text-xl font-black text-slate-900 dark:text-white text-center">{selectedGatePass.name}</h2>
                                <p className="text-sm font-medium text-slate-500 mb-6 text-center">{selectedGatePass.details}</p>

                                {/* QR Code Container */}
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6">
                                    <QRCodeSVG
                                        value={JSON.stringify({
                                            id: selectedGatePass.id,
                                            name: selectedGatePass.name,
                                            type: selectedGatePass?.details?.includes('•') ? selectedGatePass.details.split('•')[0].trim() : (selectedGatePass?.details || 'Visitor'),
                                            timestamp: Date.now()
                                        })}
                                        size={180}
                                        level="H"
                                        includeMargin={false}
                                    />
                                </div>

                                {/* Validity & Status */}
                                <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Status</p>
                                        <p className="font-bold text-green-600 dark:text-green-400">Approved</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 font-medium">Valid Until</p>
                                        <p className="font-bold text-slate-900 dark:text-slate-100">{new Date(Date.now() + 86400000).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-3 w-full mt-6">
                                    <div className="grid grid-cols-3 gap-3 w-full">
                                        <button
                                            onClick={() => {
                                                const text = encodeURIComponent(`Digital Gate Pass for ${selectedGatePass.name}\nPass Code: ${selectedGatePass.passCode}\nDetails: ${selectedGatePass.details}`);
                                                window.open(`https://wa.me/?text=${text}`, '_blank');
                                            }}
                                            className="flex flex-col items-center justify-center p-3 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl transition-all group"
                                            title="Share via WhatsApp"
                                        >
                                            <span className="material-symbols-outlined text-2xl mb-1 group-hover:scale-110 transition-transform">chat</span>
                                            <span className="text-[10px] font-bold uppercase tracking-tight">WhatsApp</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                const url = encodeURIComponent(window.location.origin);
                                                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                                            }}
                                            className="flex flex-col items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl transition-all group"
                                            title="Share via Facebook"
                                        >
                                            <span className="material-symbols-outlined text-2xl mb-1 group-hover:scale-110 transition-transform">share</span>
                                            <span className="text-[10px] font-bold uppercase tracking-tight">Facebook</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                const subject = encodeURIComponent(`Visitor Gate Pass: ${selectedGatePass.name}`);
                                                const body = encodeURIComponent(`Hello,\n\nHere is the digital gate pass for ${selectedGatePass.name}.\nPass Code: ${selectedGatePass.passCode}\nDetails: ${selectedGatePass.details}\n\nRegards,\nSociety Admin`);
                                                window.location.href = `mailto:?subject=${subject}&body=${body}`;
                                            }}
                                            className="flex flex-col items-center justify-center p-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl transition-all group"
                                            title="Share via Gmail"
                                        >
                                            <span className="material-symbols-outlined text-2xl mb-1 group-hover:scale-110 transition-transform">mail</span>
                                            <span className="text-[10px] font-bold uppercase tracking-tight">Gmail</span>
                                        </button>
                                    </div>
                                    <div className="flex gap-3 w-full">
                                        <button
                                            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm"
                                            onClick={() => { window.print(); }}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">print</span> Print Pass
                                        </button>
                                        <button
                                            className="flex-1 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold transition-colors shadow-sm shadow-primary/30 flex items-center justify-center gap-2 text-sm"
                                            onClick={() => setSelectedGatePass(null)}
                                        >
                                            Done
                                        </button>
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

export default AdminVisitorModule;
