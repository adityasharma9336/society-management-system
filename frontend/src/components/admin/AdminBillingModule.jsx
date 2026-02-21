import React, { useState, useEffect } from 'react';
import { getBills, getBillingStats, payBill } from '../../services/dataService'; // Assuming path

const AdminBillingModule = () => {
    const [bills, setBills] = useState([]);
    const [stats, setStats] = useState({ totalCollected: 0, outstandingDues: 0, pendingApprovals: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBillingData = async () => {
            setLoading(true);
            try {
                const [billsData, statsData] = await Promise.all([
                    getBills(),
                    getBillingStats()
                ]);
                setBills(billsData);
                setStats(statsData);
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

            // Optimistically update UI
            setBills(bills.map(b => b._id === id ? { ...b, status: 'paid', amountPaid: amountDue } : b));

            // Recalculate stats optimistically (simple version)
            setStats(prev => ({
                ...prev,
                totalCollected: prev.totalCollected + amountDue,
                outstandingDues: prev.outstandingDues - amountDue
            }));

        } catch (error) {
            console.error("Failed to record payment", error);
        }
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
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">file_upload</span>
                        <span>Export Report</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-all shadow-sm shadow-blue-500/20">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Generate Invoices</span>
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
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">${stats.totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
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
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">${stats.outstandingDues.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
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
                        <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm min-w-max">
                            <span className="material-symbols-outlined text-[18px]">send</span>
                            <span>Send Bulk Reminders</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm min-w-max">
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
                                        ${(bill.amount - (bill.amountPaid || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        {bill.status === 'partial' && <span className="text-xs font-normal text-slate-400 ml-1">(${bill.amountPaid} pd)</span>}
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
        </div>
    );
};

export default AdminBillingModule;
