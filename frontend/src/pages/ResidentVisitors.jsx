import React, { useState, useEffect } from 'react';
import { getMyVisitors, addVisitor } from '../services/dataService';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

export default function ResidentVisitors() {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', type: 'Personal Guest', expectedDate: '' });
    const [selectedGatePass, setSelectedGatePass] = useState(null);

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
            toast.success('Visitor registered! Awaiting admin approval.');
            setIsAddModalOpen(false);
            setFormData({ name: '', phone: '', type: 'Personal Guest', expectedDate: '' });
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
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                    Register Visitor
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
                ) : visitors.filter(v => {
                    if (activeTab === 'upcoming') {
                        return ['pending', 'approved', 'expected', 'checked_in'].includes(v.status);
                    } else {
                        return ['checked_out', 'denied'].includes(v.status);
                    }
                }).length === 0 ? (
                    <div className="text-center py-8 text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">No {activeTab} visitors found.</div>
                ) : (
                    visitors.filter(v => {
                        if (activeTab === 'upcoming') {
                            return ['pending', 'approved', 'expected', 'checked_in'].includes(v.status);
                        } else {
                            return ['checked_out', 'denied'].includes(v.status);
                        }
                    }).map(visitor => (
                        <div key={visitor._id} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-slate-500">
                                        {visitor.type.includes('Delivery') ? 'local_shipping' :
                                            ['Worker', 'Daily Help', 'Home Service'].includes(visitor.type) ? 'engineering' : 'person'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{visitor.name}</h3>
                                    <p className="text-sm text-slate-500">{visitor.type} • {new Date(visitor.expectedDate).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:items-end gap-2">
                                <span className={`text-xs px-2 py-1 rounded font-bold capitalize ${visitor.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' :
                                    ['approved', 'expected'].includes(visitor.status) ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' :
                                        visitor.status === 'denied' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                                            'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'}`}>
                                    {visitor.status === 'approved' ? 'Approved' : visitor.status === 'denied' ? 'Rejected' : visitor.status.replace('_', ' ')}
                                </span>
                                {['approved', 'expected', 'checked_in'].includes(visitor.status) && visitor.passCode && (
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 tracking-wider">CODE: {visitor.passCode}</span>
                                        {['approved', 'expected'].includes(visitor.status) && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedGatePass({
                                                        id: visitor._id,
                                                        name: visitor.name,
                                                        details: `${visitor.type} • Valid Entry`,
                                                        passCode: visitor.passCode
                                                    });
                                                }}
                                                className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
                                            >
                                                <span className="material-symbols-outlined text-[12px]">qr_code_2</span> View Pass
                                            </button>
                                        )}
                                    </div>
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
                            <h2 className="text-xl font-bold dark:text-white">Register Visitor</h2>
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
                                    <option value="Personal Guest">Personal Guest</option>
                                    <option value="Delivery Partner">Delivery Partner</option>
                                    <option value="Home Service">Home Service</option>
                                    <option value="Daily Help">Daily Help</option>
                                    <option value="Worker">Worker / Staff</option>
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
                                    Request Entry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">badge</span>
                                    Visitor Gate Pass
                                </h3>
                                <button onClick={() => setSelectedGatePass(null)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-8 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 ring-4 ring-white dark:ring-slate-900 shadow-sm z-10">
                                    <span className="material-symbols-outlined text-3xl">person</span>
                                </div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white text-center">{selectedGatePass.name}</h2>
                                <p className="text-sm font-medium text-slate-500 mb-6 text-center">{selectedGatePass.details}</p>
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6">
                                    <QRCodeSVG
                                        value={JSON.stringify({ id: selectedGatePass.id, code: selectedGatePass.passCode, type: 'Visitor' })}
                                        size={180}
                                        level="H"
                                    />
                                </div>
                                <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium font-mono uppercase tracking-tighter">Pass Code</p>
                                        <p className="font-bold text-primary">{selectedGatePass.passCode}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 font-medium">Status</p>
                                        <p className="font-bold text-green-600">Valid</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 w-full mt-6">
                                    <div className="grid grid-cols-3 gap-3 w-full">
                                        <button
                                            onClick={() => {
                                                const text = encodeURIComponent(`Visitor Pass for ${selectedGatePass.name}\nCode: ${selectedGatePass.passCode}\nDetails: ${selectedGatePass.details}`);
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
                                                const subject = encodeURIComponent(`Visitor Pass: ${selectedGatePass.name}`);
                                                const body = encodeURIComponent(`Hello,\n\nHere is the gate pass for ${selectedGatePass.name}.\nPass Code: ${selectedGatePass.passCode}\nDetails: ${selectedGatePass.details}\n\nRegards,\nSociety Management`);
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
}
