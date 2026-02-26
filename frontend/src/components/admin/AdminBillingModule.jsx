import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBills, getBillingStats, payBill, createBill, generateBulkBills, getUsers } from '../../services/dataService';
import { toast } from 'react-toastify';

const AdminBillingModule = () => {
    const [bills, setBills] = useState([]);
    const [residents, setResidents] = useState([]);
    const [stats, setStats] = useState({ totalCollected: 0, outstandingDues: 0, pendingApprovals: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [activeModal, setActiveModal] = useState(null); // 'generate', 'reminders', 'offline', 'assign', null
    const [actionLoading, setActionLoading] = useState(false);

    // Form States
    const [assignFormData, setAssignFormData] = useState({
        userId: '',
        amount: '',
        type: 'maintenance',
        dueDate: '',
        invoiceNumber: ''
    });

    const [bulkFormData, setBulkFormData] = useState({
        amount: '',
        type: 'maintenance',
        dueDate: ''
    });

    // Offline Payment States
    const [offlineFlatNo, setOfflineFlatNo] = useState('');
    const [offlineAmount, setOfflineAmount] = useState('');
    const [offlineSelectedBills, setOfflineSelectedBills] = useState([]);

    useEffect(() => {
        const fetchBillingData = async () => {
            setLoading(true);
            try {
                const [billsData, statsData, residentsData] = await Promise.all([
                    getBills(),
                    getBillingStats(),
                    getUsers()
                ]);

                const validBillsData = Array.isArray(billsData) ? billsData : [];
                setBills(validBillsData);
                setResidents(residentsData.filter(r => r.role === 'member' || r.role === 'resident'));

                const calculatedTotalCollected = validBillsData.reduce((sum, b) => sum + (b.amountPaid || (b.status === 'paid' ? b.amount : 0)), 0);
                const calculatedOutstandingDues = validBillsData.reduce((sum, b) => sum + (b.status !== 'paid' ? (b.amount - (b.amountPaid || 0)) : 0), 0);

                setStats({
                    totalCollected: calculatedTotalCollected,
                    outstandingDues: calculatedOutstandingDues,
                    pendingApprovals: statsData?.pendingBillsCount || 0
                });
            } catch (error) {
                console.error("Failed to fetch billing data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBillingData();
    }, []);

    const filteredBills = bills.filter(b => {
        return searchTerm === '' ||
            b.user?.flatNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleRecordPayment = async (id, amountDue) => {
        try {
            await payBill(id, { paymentMethod: 'offline' });
            setBills(bills.map(b => b._id === id ? { ...b, status: 'paid', amountPaid: amountDue } : b));
            setStats(prev => ({
                ...prev,
                totalCollected: prev.totalCollected + amountDue,
                outstandingDues: prev.outstandingDues - amountDue
            }));
            toast.success('Payment recorded successfully');
        } catch (error) {
            console.error("Failed to record payment", error);
            toast.error('Failed to record payment');
        }
    };

    const handleExportReport = () => {
        if (bills.length === 0) {
            toast.info("No bills available to export.");
            return;
        }

        const headers = ["Flat No", "Resident Name", "Bill Period", "Amount", "Amount Paid", "Status", "Due Date"];
        const rows = bills.map(b => [
            b.user?.flatNo || 'N/A',
            b.user?.name || 'Unknown',
            new Date(b.dueDate).toLocaleDateString([], { month: 'short', year: 'numeric' }),
            b.amount,
            b.amountPaid || 0,
            b.status,
            new Date(b.dueDate).toLocaleDateString()
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `billing_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAssignBill = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const newBill = await createBill(assignFormData);
            // Refresh bills or add to list
            const billsData = await getBills();
            setBills(billsData);
            setActiveModal(null);
            setAssignFormData({ userId: '', amount: '', type: 'maintenance', dueDate: '', invoiceNumber: '' });
            toast.success('Bill assigned successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to assign bill');
        } finally {
            setActionLoading(false);
        }
    };

    const confirmGenerateInvoices = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await generateBulkBills(bulkFormData);
            const billsData = await getBills();
            setBills(billsData);
            setActiveModal(null);
            setBulkFormData({ amount: '', type: 'maintenance', dueDate: '' });
            toast.success('Bulk invoices generated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate bulk bills');
        } finally {
            setActionLoading(false);
        }
    };

    const handleBulkReminders = () => {
        setActiveModal('reminders');
    };

    const confirmBulkReminders = async () => {
        setActionLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setActionLoading(false);
        setActiveModal(null);
    };

    const handleRecordOffline = () => {
        setOfflineFlatNo('');
        setOfflineAmount('');
        setOfflineSelectedBills([]);
        setActiveModal('offline');
    };

    const searchOfflineBills = () => {
        if (!offlineFlatNo.trim()) return;
        const found = bills.filter(b => b.user?.flatNo?.toLowerCase() === offlineFlatNo.toLowerCase() && b.status !== 'paid');
        setOfflineSelectedBills(found);
        setOfflineAmount(found.reduce((sum, b) => sum + (b.amount - (b.amountPaid || 0)), 0).toString());
    };

    const confirmRecordOffline = async () => {
        if (!offlineAmount || isNaN(offlineAmount) || parseFloat(offlineAmount) <= 0) return;

        setActionLoading(true);
        // Optimistically auto-resolve the oldest bill for demo purposes
        if (offlineSelectedBills.length > 0) {
            await handleRecordPayment(offlineSelectedBills[0]._id, parseFloat(offlineAmount));
        }
        setActionLoading(false);
        setActiveModal(null);
    };


    // Status formatting helpers
    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
            case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
            case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300';
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Top Action Bar & Title */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Financial Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Track payments, manage dues, and generate invoices for residents.</p>
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={handleExportReport} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">file_upload</span>
                        <span>Export Report</span>
                    </button>
                    <button onClick={() => setActiveModal('assign')} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        <span>Assign Bill</span>
                    </button>
                    <button type="button" onClick={() => setActiveModal('generate')} className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-all shadow-sm shadow-blue-500/20">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Generate Monthly</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Collected */}
                <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            12.5%
                        </span>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Collected</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">₹{stats.totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    </div>
                </div>

                {/* Outstanding Dues */}
                <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                            <span className="material-symbols-outlined">assignment_late</span>
                        </div>
                        <button className="text-xs font-semibold text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">View Defaulters</button>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Outstanding Dues</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">₹{stats.outstandingDues.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    </div>
                </div>

                {/* Pending Approvals */}
                <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
                            <span className="material-symbols-outlined">pending_actions</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Pending Approvals</p>
                        <div className="flex items-end gap-2">
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.pendingApprovals}</h3>
                            <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">requests</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Table Section */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col flex-1 min-h-[500px]">
                {/* Toolbar */}
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64 group">
                            <span className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-primary transition-colors material-symbols-outlined text-[20px]">search</span>
                            <input
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                                placeholder="Search flat no. or name"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">filter_list</span>
                        </button>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto justify-end overflow-x-auto pb-2 sm:pb-0">
                        <button type="button" onClick={handleBulkReminders} className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm min-w-max">
                            <span className="material-symbols-outlined text-[18px]">send</span>
                            <span>Send Bulk Reminders</span>
                        </button>
                        <button type="button" onClick={handleRecordOffline} className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm min-w-max">
                            <span className="material-symbols-outlined text-[18px]">receipt</span>
                            <span>Record Offline</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Flat No</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resident Name</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bill Period</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount Due</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Status</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-slate-500">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                    </td>
                                </tr>
                            ) : filteredBills.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-slate-500">
                                        No bills found matching criteria.
                                    </td>
                                </tr>
                            ) : filteredBills.map(bill => (
                                <tr key={bill._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="py-4 px-6 text-sm font-medium text-slate-900 dark:text-white">{bill.user?.flatNo || 'N/A'}</td>
                                    <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-8 w-8 shrink-0 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-xs uppercase">
                                                {(bill.user?.name || '?').charAt(0)}
                                            </div>
                                            <span className="font-medium text-slate-900 dark:text-slate-100">{bill.user?.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">
                                        {new Date(bill.dueDate).toLocaleDateString([], { month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white text-right whitespace-nowrap">
                                        ₹{(bill.amount - (bill.amountPaid || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        {bill.status === 'partial' && <span className="text-xs font-normal text-slate-400 ml-1">(₹{bill.amountPaid} pd)</span>}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase ${getStatusBadgeClass(bill.status)}`}>
                                            {bill.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            {bill.status !== 'paid' && (
                                                <>
                                                    <button className="text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-md hover:bg-primary/10 transition-colors" title="Send Reminder">
                                                        <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                                                    </button>
                                                    <button onClick={() => handleRecordPayment(bill._id, bill.amount)} className="text-slate-400 hover:text-primary dark:hover:text-blue-400 p-1 rounded-md hover:bg-primary/10 transition-colors" title="Record Full Payment">
                                                        <span className="material-symbols-outlined text-[20px]">payments</span>
                                                    </button>
                                                </>
                                            )}
                                            {bill.status === 'paid' && (
                                                <button className="text-slate-400 hover:text-primary dark:hover:text-blue-400 p-1 rounded-md hover:bg-primary/10 transition-colors" title="View Receipt">
                                                    <span className="material-symbols-outlined text-[20px]">description</span>
                                                </button>
                                            )}
                                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="More">
                                                <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 mt-auto">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Showing <span className="font-medium text-slate-900 dark:text-white">{filteredBills.length > 0 ? 1 : 0}</span> to <span className="font-medium text-slate-900 dark:text-white">{Math.min(5, filteredBills.length)}</span> of <span className="font-medium text-slate-900 dark:text-white">{filteredBills.length}</span> results
                    </p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md text-sm font-medium text-slate-500 disabled:opacity-50 hover:bg-white dark:hover:bg-slate-700 transition-colors" disabled>Previous</button>
                        <button className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors" disabled={filteredBills.length <= 5}>Next</button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => !actionLoading && setActiveModal(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    {activeModal === 'assign' && <><span className="material-symbols-outlined text-primary">person_add</span> Assign Individual Bill</>}
                                    {activeModal === 'generate' && <><span className="material-symbols-outlined text-primary">add_circle</span> Bulk Generate Invoices</>}
                                    {activeModal === 'reminders' && <><span className="material-symbols-outlined text-amber-500">campaign</span> Send Bulk Reminders</>}
                                    {activeModal === 'offline' && <><span className="material-symbols-outlined text-green-500">payments</span> Record Offline Payment</>}
                                </h3>
                                {!actionLoading && (
                                    <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
                                        <span className="material-symbols-outlined md-18">close</span>
                                    </button>
                                )}
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                {activeModal === 'assign' && (
                                    <form onSubmit={handleAssignBill} className="flex flex-col gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Resident</label>
                                            <select
                                                required
                                                className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                                value={assignFormData.userId}
                                                onChange={e => setAssignFormData({ ...assignFormData, userId: e.target.value })}
                                            >
                                                <option value="">Choose a resident...</option>
                                                {residents.map(r => (
                                                    <option key={r._id} value={r._id}>{r.name} - {r.flatNo}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                                                <input
                                                    required type="number"
                                                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                                    value={assignFormData.amount}
                                                    onChange={e => setAssignFormData({ ...assignFormData, amount: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                                                <select
                                                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                                    value={assignFormData.type}
                                                    onChange={e => setAssignFormData({ ...assignFormData, type: e.target.value })}
                                                >
                                                    <option value="maintenance">Maintenance</option>
                                                    <option value="utility">Utility</option>
                                                    <option value="penalty">Penalty</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                                            <input
                                                required type="date"
                                                className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                                value={assignFormData.dueDate}
                                                onChange={e => setAssignFormData({ ...assignFormData, dueDate: e.target.value })}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={actionLoading}
                                            className="w-full py-3 bg-primary hover:bg-blue-600 text-white rounded-lg font-bold mt-2 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {actionLoading ? <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> Assigning...</> : 'Assign Bill'}
                                        </button>
                                    </form>
                                )}

                                {activeModal === 'generate' && (
                                    <form onSubmit={confirmGenerateInvoices} className="flex flex-col gap-4">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-sm border border-blue-100 dark:border-blue-900/30">
                                            This action will generate new monthly maintenance invoices for all registered flats and notify residents.
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Standard Amount (₹)</label>
                                            <input
                                                required type="number"
                                                className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                                value={bulkFormData.amount}
                                                onChange={e => setBulkFormData({ ...bulkFormData, amount: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                                                <select
                                                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                                    value={bulkFormData.type}
                                                    onChange={e => setBulkFormData({ ...bulkFormData, type: e.target.value })}
                                                >
                                                    <option value="maintenance">Maintenance</option>
                                                    <option value="utility">Utility</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                                                <input
                                                    required type="date"
                                                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                                    value={bulkFormData.dueDate}
                                                    onChange={e => setBulkFormData({ ...bulkFormData, dueDate: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={actionLoading}
                                            className="w-full py-3 bg-primary hover:bg-blue-600 text-white rounded-lg font-bold mt-2 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {actionLoading ? <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> Generating...</> : 'Confirm & Generate'}
                                        </button>
                                    </form>
                                )}

                                {activeModal === 'reminders' && (() => {
                                    const pendingCount = bills.filter(b => b.status === 'pending' || b.status === 'overdue').length;
                                    return (
                                        <div className="flex flex-col gap-4">
                                            {pendingCount > 0 ? (
                                                <>
                                                    <div className="flex items-center justify-center p-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
                                                        <div className="text-center">
                                                            <div className="text-4xl font-black text-amber-600 dark:text-amber-400 mb-1">{pendingCount}</div>
                                                            <div className="text-sm font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Pending Bills Found</div>
                                                        </div>
                                                    </div>
                                                    <p className="text-slate-600 dark:text-slate-400 text-sm">This will send an automated Email and SMS reminder to all residents with outstanding dues. Continue?</p>
                                                </>
                                            ) : (
                                                <div className="text-center p-6">
                                                    <span className="material-symbols-outlined text-4xl text-green-500 mb-2">check_circle</span>
                                                    <p className="text-slate-700 dark:text-slate-300 font-medium">All clear! There are no pending or overdue bills at this time.</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}

                                {activeModal === 'offline' && (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter Flat No. (e.g. A-101)"
                                                className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white"
                                                value={offlineFlatNo}
                                                onChange={e => setOfflineFlatNo(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && searchOfflineBills()}
                                            />
                                            <button
                                                onClick={searchOfflineBills}
                                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold transition-colors flex items-center gap-2 border border-slate-200 dark:border-slate-700"
                                            >
                                                <span className="material-symbols-outlined md-18">search</span> Find
                                            </button>
                                        </div>

                                        {offlineSelectedBills.length > 0 ? (
                                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col gap-3">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500 dark:text-slate-400">Resident Found:</span>
                                                    <span className="font-bold text-slate-900 dark:text-white">{offlineSelectedBills[0].user?.name}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500 dark:text-slate-400">Pending Bills:</span>
                                                    <span className="font-bold text-amber-600 dark:text-amber-400">{offlineSelectedBills.length} found</span>
                                                </div>
                                                <hr className="border-slate-200 dark:border-slate-700" />
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Amount Paid Offline (₹)</label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                                                        <input
                                                            type="number"
                                                            className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-slate-900 dark:text-white font-bold"
                                                            value={offlineAmount}
                                                            onChange={e => setOfflineAmount(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            offlineFlatNo && <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">Search for a flat number to view pending dues.</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                                <button
                                    onClick={() => setActiveModal(null)}
                                    disabled={actionLoading}
                                    className="px-4 py-2 rounded-lg font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                {activeModal === 'generate' && (
                                    <button
                                        onClick={confirmGenerateInvoices}
                                        disabled={actionLoading}
                                        className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {actionLoading ? <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> Generating...</> : 'Confirm & Generate'}
                                    </button>
                                )}

                                {activeModal === 'reminders' && bills.filter(b => b.status === 'pending' || b.status === 'overdue').length > 0 && (
                                    <button
                                        onClick={confirmBulkReminders}
                                        disabled={actionLoading}
                                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {actionLoading ? <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> Sending...</> : 'Send Reminders'}
                                    </button>
                                )}

                                {activeModal === 'offline' && offlineSelectedBills.length > 0 && (
                                    <button
                                        onClick={confirmRecordOffline}
                                        disabled={actionLoading || !offlineAmount || parseFloat(offlineAmount) <= 0}
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {actionLoading ? <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> Processing...</> : 'Record Payment'}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminBillingModule;
