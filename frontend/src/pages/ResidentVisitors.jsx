import React, { useState, useEffect } from 'react';
import { getMyVisitors, addVisitor } from '../services/dataService';
import { toast } from 'react-toastify';

export default function ResidentVisitors() {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', type: 'Guest', expectedDate: '' });

    const fetchVisitors = async () => {
        try {
            const data = await getMyVisitors();
            setVisitors(data);
        } catch (error) {
            toast.error('Failed to load visitors.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    const handleAddVisitor = async (e) => {
        e.preventDefault();
        try {
            await addVisitor(formData);
            toast.success('Visitor pre-approved successfully!');
            setIsAddModalOpen(false);
            setFormData({ name: '', phone: '', type: 'Guest', expectedDate: '' });
            fetchVisitors();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add visitor');
        }
    };

    return (
        <div className="flex-1 p-4 md:p-6 lg:p-10 w-full max-w-7xl mx-auto custom-scrollbar overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Visitors & Gate Pass</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Pre-approve Visitor
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'upcoming' ? 'border-primary text-primary dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'history' ? 'border-primary text-primary dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Past History
                </button>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-8 text-slate-500">Loading visitors...</div>
                ) : visitors.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">No visitors found.</div>
                ) : (
                    visitors.map(visitor => (
                        <div key={visitor._id} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-slate-500">
                                        {visitor.type.includes('Delivery') ? 'local_shipping' : 'person'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{visitor.name}</h3>
                                    <p className="text-sm text-slate-500">{visitor.type} • {new Date(visitor.expectedDate).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:items-end gap-2">
                                <span className={`text-xs px-2 py-1 rounded font-bold capitalize ${visitor.status === 'expected' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'}`}>
                                    {visitor.status.replace('_', ' ')}
                                </span>
                                {visitor.passCode && (
                                    <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 tracking-wider">CODE: {visitor.passCode}</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Visitor Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold dark:text-white">Pre-approve Visitor</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddVisitor} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Visitor Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:outline-none focus:border-primary"
                                    placeholder="Enter visitor name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number (Optional)</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:outline-none focus:border-primary"
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Visitor Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:outline-none focus:border-primary"
                                >
                                    <option value="Guest">Guest</option>
                                    <option value="Delivery">Delivery</option>
                                    <option value="Service">Service</option>
                                    <option value="Maid/Staff">Maid/Staff</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expected Date & Time</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.expectedDate}
                                    onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                                    Approve Pass
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
