import React, { useState, useEffect } from 'react';
import { getNotices, getPolls } from '../services/dataService';
import { toast } from 'react-toastify';

export default function ResidentCommunity() {
    const [activeTab, setActiveTab] = useState('notices');
    const [notices, setNotices] = useState([]);
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCommunityData = async () => {
            try {
                const [noticesData, pollsData] = await Promise.all([
                    getNotices(),
                    getPolls()
                ]);
                setNotices(noticesData);
                setPolls(pollsData);
            } catch (error) {
                toast.error('Failed to load community data.');
            } finally {
                setLoading(false);
            }
        };
        fetchCommunityData();
    }, []);

    return (
        <div className="flex-1 p-4 md:p-6 lg:p-10 w-full max-w-7xl mx-auto custom-scrollbar overflow-y-auto">
            <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Community Connect</h1>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                <button
                    onClick={() => setActiveTab('notices')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'notices' ? 'border-primary text-primary dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Notices & Alerts
                </button>
                <button
                    onClick={() => setActiveTab('polls')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'polls' ? 'border-primary text-primary dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Community Polls
                </button>
            </div>

            {/* Content area */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-8 text-slate-500">Loading community data...</div>
                ) : (
                    <>
                        {activeTab === 'notices' && (
                            notices.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">No notices found.</div>
                            ) : (
                                notices.map(notice => (
                                    <div key={notice._id} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div>
                                            <div className="flex gap-2 items-center mb-1">
                                                <span className={`text-xs px-2 py-0.5 rounded font-bold capitalize ${notice.category === 'maintenance' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400'}`}>
                                                    {notice.category}
                                                </span>
                                                <span className="text-xs text-slate-500">{new Date(notice.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{notice.title}</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{notice.content}</p>
                                        </div>
                                    </div>
                                ))
                            )
                        )}

                        {activeTab === 'polls' && (
                            polls.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">No active polls.</div>
                            ) : (
                                polls.map(poll => (
                                    <div key={poll._id} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{poll.question}</h3>
                                            <span className={`text-xs px-2 py-1 rounded font-bold capitalize ${poll.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                                                {poll.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                                            <p className="text-sm text-slate-500">
                                                {poll.options.reduce((sum, opt) => sum + opt.votes, 0)} responses
                                            </p>
                                            {poll.status === 'active' && (
                                                <button className="text-sm font-bold text-primary hover:underline">Vote Now</button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
