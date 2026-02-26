import React, { useState, useEffect } from 'react';
import { getMyComplaints, createComplaint, addComplaintMessage } from '../services/dataService';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResidentComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [formData, setFormData] = useState({ subject: '', description: '', category: 'Maintenance', priority: 'Medium' });
    const [messageContent, setMessageContent] = useState('');

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

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageContent.trim()) return;

        try {
            const updated = await addComplaintMessage(selectedComplaint._id, { content: messageContent });
            setSelectedComplaint(updated);
            setMessageContent('');
            fetchComplaints(); // Refresh list to sync
            toast.success('Message sent');
        } catch (error) {
            toast.error('Failed to send message');
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
                        <div key={complaint._id}
                            onClick={() => setSelectedComplaint(complaint)}
                            className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-primary/50 transition-colors">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{complaint.category}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${complaint.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : complaint.priority === 'Low' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'}`}>
                                        {complaint.priority} Priority
                                    </span>
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{complaint.subject}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <p className="text-sm text-slate-500">Reported on {new Date(complaint.createdAt).toLocaleDateString()}</p>
                                    {complaint.assignedTo && (
                                        <p className="text-sm font-medium text-primary">Assigned to: {complaint.assignedTo}</p>
                                    )}
                                </div>
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

            {/* Detail View Modal */}
            <AnimatePresence>
                {selectedComplaint && (
                    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${selectedComplaint.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {selectedComplaint.status.replace('_', ' ')}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400 uppercase">{selectedComplaint.category}</span>
                                    </div>
                                    <h2 className="text-xl font-bold dark:text-white">{selectedComplaint.subject}</h2>
                                </div>
                                <button onClick={() => setSelectedComplaint(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800 h-full">
                                    {/* Left: Progress & Details */}
                                    <div className="p-6 space-y-8">
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Description</h4>
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-inner">
                                                {selectedComplaint.description}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Progress Timeline</h4>
                                            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                                                {selectedComplaint.timeline?.map((item, idx) => (
                                                    <div key={idx} className="relative pl-8">
                                                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-primary z-10 flex items-center justify-center">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between items-start">
                                                                <h5 className="font-bold text-slate-900 dark:text-white text-sm capitalize">{item.status.replace('_', ' ')}</h5>
                                                                <span className="text-[10px] text-slate-400 font-medium">{new Date(item.date).toLocaleString()}</span>
                                                            </div>
                                                            <p className="text-sm text-slate-500 mt-1">{item.note}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {selectedComplaint.assignedTo && (
                                            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-xl p-4 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                                    <span className="material-symbols-outlined">engineering</span>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-primary uppercase leading-none mb-1">Assigned Technician</p>
                                                    <p className="font-bold text-slate-900 dark:text-white">{selectedComplaint.assignedTo}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Messages */}
                                    <div className="p-6 flex flex-col bg-slate-50/30 dark:bg-slate-900/50 min-h-[400px]">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Messages</h4>
                                        <div className="flex-1 space-y-4 mb-4 overflow-y-auto custom-scrollbar px-1">
                                            {selectedComplaint.messages?.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center opacity-40">
                                                    <span className="material-symbols-outlined text-4xl mb-2">forum</span>
                                                    <p className="text-sm">No messages yet</p>
                                                </div>
                                            ) : (
                                                selectedComplaint.messages?.map((msg, idx) => (
                                                    <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 rounded-tl-none'}`}>
                                                            {msg.content}
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 mt-1 px-1">{new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <form onSubmit={handleSendMessage} className="relative mt-auto">
                                            <input
                                                type="text"
                                                value={messageContent}
                                                onChange={(e) => setMessageContent(e.target.value)}
                                                placeholder="Ask for an update..."
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary shadow-sm"
                                            />
                                            <button
                                                type="submit"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">send</span>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
