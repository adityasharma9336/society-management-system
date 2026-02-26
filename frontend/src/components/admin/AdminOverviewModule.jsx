import React, { useState, useEffect } from 'react';
import { getAdminDashboardStats, getAuditLogs } from '../../services/dataService';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function AdminOverviewModule({ setActiveTab, stats: propStats, loading: propLoading, refreshStats }) {
    const [stats, setStats] = useState(propStats || null);
    const [activity, setActivity] = useState(propStats?.recentPendingComplaints || []);
    const [chartData, setChartData] = useState(propStats?.revenueData || []);
    const [loading, setLoading] = useState(propLoading !== undefined ? propLoading : !propStats);
    const [error, setError] = useState('');

    useEffect(() => {
        if (propStats) {
            setStats(propStats);
            setActivity(propStats.recentPendingComplaints || []);
            setChartData(propStats.revenueData || []);
            setLoading(false);
        } else if (propLoading !== undefined) {
            setLoading(propLoading);
        }
    }, [propStats, propLoading]);

    const fetchStats = async () => {
        if (refreshStats) {
            await refreshStats();
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl shadow-sm border border-red-200 dark:border-red-800">
                {error}
            </div>
        );
    }

    const statCards = [
        { title: 'Total Users', value: stats?.users || 0, icon: 'group', color: 'bg-blue-500', tab: 'residents' },
        { title: 'New Members', value: stats?.newUsersThisMonth || 0, icon: 'person_add', color: 'bg-cyan-500', tab: 'residents', subtitle: 'This Month' },
        { title: 'Total Visitors', value: stats?.visitors || 0, icon: 'shield_person', color: 'bg-indigo-500', tab: 'visitors' },
        { title: 'Total Complaints', value: stats?.complaints || 0, icon: 'forum', color: 'bg-purple-500', tab: 'complaints' },
        { title: 'Resolved', value: stats?.resolvedThisMonth || 0, icon: 'task_alt', color: 'bg-green-500', tab: 'complaints', subtitle: 'This Month' },
        { title: 'Total Bills', value: stats?.bills || 0, icon: 'receipt_long', color: 'bg-emerald-500', tab: 'billing' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">A quick glance at your society statistics</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                    title="Refresh Stats"
                >
                    <span className="material-symbols-outlined text-[20px]">refresh</span>
                </button>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {statCards.map((card, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        onClick={() => card.tab && setActiveTab(card.tab)}
                        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex items-center gap-4 hover:shadow-md transition-shadow ${card.tab ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50' : ''}`}
                    >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-inner flex-shrink-0 ${card.color}`}>
                            <span className="material-symbols-outlined text-[28px]">{card.icon}</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {card.title}
                                {card.subtitle && <span className="ml-1.5 text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{card.subtitle}</span>}
                            </p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{card.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Dashboard Insights: Financial & Complaints */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
                {/* Financial Overview (Revenue Chart) */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 min-h-[400px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-500">payments</span>
                                Financial Overview
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">Paid vs Pending Revenue (Last 6 Months)</p>
                        </div>
                       <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">INR (₹)</span>
                    </div>
                    <div className="flex-1 w-full h-full min-h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
                                />
                                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }} />
                                <Bar dataKey="paid" name="Paid" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Pending Complaints */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 min-h-[400px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-500">priority_high</span>
                                Pending Complaints
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">Issues requiring immediate attention</p>
                        </div>
                        <button
                            onClick={() => setActiveTab('complaints')}
                            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                            Manage All
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                    </div>
                    <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
                        {activity.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center py-10">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-3xl opacity-30">check_circle</span>
                                </div>
                                <p className="text-sm font-medium">All caught up!</p>
                                <p className="text-xs mt-1">No pending complaints at the moment.</p>
                            </div>
                        ) : (
                            activity.slice(0, 5).map(complaint => (
                                <div
                                    key={complaint._id}
                                    onClick={() => setActiveTab('complaints')}
                                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h5 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-primary transition-colors">{complaint.subject}</h5>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${complaint.priority === 'High' || complaint.priority === 'Urgent'
                                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                            : complaint.priority === 'Medium'
                                                ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                                                : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                            }`}>
                                            {complaint.priority}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">person</span>
                                            {complaint.user?.name || 'Resident'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">apartment</span>
                                            Flat {complaint.user?.flatNo || 'N/A'}
                                        </div>
                                        <div className="ml-auto flex items-center gap-1 opacity-60">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                            {new Date(complaint.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions & System Health */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Immediate Attention */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                        <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">notification_important</span>
                            Attention Needed
                        </h4>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                        <div
                            onClick={() => setActiveTab('billing')}
                            className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform"
                        >
                            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-orange-600 dark:text-orange-400">{stats?.pendingBills || 0}</p>
                                <p className="text-xs font-bold text-slate-500 uppercase">Pending Bills</p>
                            </div>
                        </div>

                        <div
                            onClick={() => setActiveTab('visitors')}
                            className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined">shield_person</span>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats?.pendingVisitorsCount || 0}</p>
                                <p className="text-xs font-bold text-slate-500 uppercase">Visitor Approvals</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Quick Actions */}
                <div className="bg-primary dark:bg-indigo-600 rounded-2xl shadow-lg shadow-primary/20 p-6 text-white flex flex-col justify-between">
                    <div>
                        <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">bolt</span>
                            Quick Actions
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setActiveTab('notices')}
                                className="flex flex-col items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/5 text-center"
                            >
                                <span className="material-symbols-outlined">campaign</span>
                                <span className="text-[10px] font-bold uppercase">New Notice</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('billing')}
                                className="flex flex-col items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/5 text-center"
                            >
                                <span className="material-symbols-outlined">add_card</span>
                                <span className="text-[10px] font-bold uppercase">Add Bill</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('residents')}
                                className="flex flex-col items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/5 text-center"
                            >
                                <span className="material-symbols-outlined">person_add</span>
                                <span className="text-[10px] font-bold uppercase">Add Member</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('visitors')}
                                className="flex flex-col items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/5 text-center"
                            >
                                <span className="material-symbols-outlined">badge</span>
                                <span className="text-[10px] font-bold uppercase">Guest Pass</span>
                            </button>
                        </div>
                    </div>
                    <p className="mt-4 text-[10px] opacity-60 font-medium italic text-center text-white/80">Select an action to navigate quickly</p>
                </div>
            </div>
        </div>
    );
}
