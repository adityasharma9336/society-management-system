import React, { useState, useEffect } from 'react';
import { getMyComplaints, createComplaint } from '../services/dataService';
import { toast } from 'react-toastify';

export default function ResidentComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({ subject: '', description: '', category: 'Maintenance', priority: 'Medium' });

    const fetchComplaints = async () => {
        try {
            const data = await getMyComplaints();
            setComplaints(data);
        } catch (error) {
            toast.error('Failed to load complaints.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleCreateComplaint = async (e) => {
        e.preventDefault();
        try {
            await createComplaint(formData);
            toast.success('Complaint raised successfully!');
            setIsAddModalOpen(false);
            setFormData({ subject: '', description: '', category: 'Maintenance', priority: 'Medium' });
            fetchComplaints();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to raise complaint');
        }
    };

    return (
        <div className="flex-1 p-4 md:p-6 lg:p-10 w-full max-w-7xl mx-auto custom-scrollbar overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Complaints</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    New Complaint
                </button>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-8 text-slate-500">Loading complaints...</div>
                ) : complaints.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">No complaints found.</div>
                ) : (
                    complaints.map(complaint => (
                        <div key={complaint._id} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-primary/50 transition-colors">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{complaint.category}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${complaint.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : complaint.priority === 'Low' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'}`}>
                                        {complaint.priority} Priority
                                    </span>
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{complaint.subject}</h3>
                                <p className="text-sm text-slate-500 mt-1">Reported on {new Date(complaint.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-xs px-2 py-1 rounded font-bold capitalize ${complaint.status === 'resolved' || complaint.status === 'closed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'}`}>
                                    {complaint.status.replace('_', ' ')}
                                </span>
                                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Complaint Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold dark:text-white">Raise New Request</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreateComplaint} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject / Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:outline-none focus:border-primary"
                                    placeholder="Brief description of the issue"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:outline-none focus:border-primary"
                                >
                                    <option value="Plumbing">Plumbing</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Carpentry">Carpentry</option>
                                    <option value="Security">Security</option>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Noise">Noise</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:outline-none focus:border-primary"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Detailed Description</label>
                                <textarea
                                    required
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:outline-none focus:border-primary resize-none"
                                    placeholder="Provide more details about your request..."
                                ></textarea>
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
