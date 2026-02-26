import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUserRole, createUser } from '../../services/dataService';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const AdminResidentModule = () => {
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    // View Profile State
    const [selectedResident, setSelectedResident] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Invite Modal State
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteFormData, setInviteFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'member',
        block: '',
        flatNo: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchResidents();
    }, []);

    const fetchResidents = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setResidents(data);
        } catch (error) {
            console.error("Failed to fetch residents", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const newUser = await createUser(inviteFormData);
            setResidents([newUser, ...residents]);
            setIsInviteModalOpen(false);
            setInviteFormData({ name: '', email: '', password: '', role: 'member', block: '', flatNo: '' });
            toast.success('Resident invited successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to invite resident');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this resident? This action cannot be undone.")) return;
        try {
            await deleteUser(id);
            setResidents(residents.filter(r => r._id !== id));
            toast.success('Resident removed successfully');
        } catch (error) {
            console.error("Failed to delete resident", error);
            toast.error("Failed to delete resident.");
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await updateUserRole(id, { role: newRole });
            setResidents(residents.map(r => r._id === id ? { ...r, role: newRole } : r));
            toast.success(`Role updated to ${newRole}`);
        } catch (error) {
            console.error("Failed to update role", error);
            toast.error("Failed to update user role.");
        }
    };

    const handleViewProfile = (resident) => {
        setSelectedResident(resident);
        setIsProfileModalOpen(true);
    };

    const filteredResidents = residents.filter(r => {
        const matchesRole = filterRole === 'all' || r.role === filterRole;
        const matchesSearch = searchTerm === '' ||
            r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.flatNo?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesRole && matchesSearch;
    });

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Resident Directory</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Manage society members, update their roles, or remove accounts.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-all shadow-sm shadow-blue-500/20"
                    >
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        <span>Invite Resident</span>
                    </button>
                </div>
            </div>

            {/* Invite Resident Modal */}
            <AnimatePresence>
                {isInviteModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Invite Resident</h2>
                                <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                <form id="invite-form" onSubmit={handleInvite} className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white transition-all shadow-sm"
                                            value={inviteFormData.name}
                                            onChange={(e) => setInviteFormData({ ...inviteFormData, name: e.target.value })}
                                            placeholder="Resident's Full Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white transition-all shadow-sm"
                                            value={inviteFormData.email}
                                            onChange={(e) => setInviteFormData({ ...inviteFormData, email: e.target.value })}
                                            placeholder="Resident's Email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password *</label>
                                        <input
                                            required
                                            type="password"
                                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white transition-all shadow-sm"
                                            value={inviteFormData.password}
                                            onChange={(e) => setInviteFormData({ ...inviteFormData, password: e.target.value })}
                                            placeholder="Initial Password"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Block</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white transition-all shadow-sm"
                                                value={inviteFormData.block}
                                                onChange={(e) => setInviteFormData({ ...inviteFormData, block: e.target.value })}
                                                placeholder="e.g., A"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Flat No</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white transition-all shadow-sm"
                                                value={inviteFormData.flatNo}
                                                onChange={(e) => setInviteFormData({ ...inviteFormData, flatNo: e.target.value })}
                                                placeholder="e.g., 101"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                                        <select
                                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white transition-all shadow-sm cursor-pointer"
                                            value={inviteFormData.role}
                                            onChange={(e) => setInviteFormData({ ...inviteFormData, role: e.target.value })}
                                        >
                                            <option value="member">Resident Member</option>
                                            <option value="admin">Administrator</option>
                                            <option value="guard">Security Guard</option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="invite-form"
                                    disabled={isSubmitting}
                                    className="flex justify-center items-center px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed min-w-[100px]"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        "Invite Resident"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* View Profile Modal */}
            <AnimatePresence>
                {isProfileModalOpen && selectedResident && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Resident Profile</h2>
                                <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                                {/* Basic Info */}
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl uppercase">
                                        {selectedResident.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold dark:text-white">{selectedResident.name}</h3>
                                        <p className="text-sm text-slate-500">{selectedResident.email}</p>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded font-medium">Flat {selectedResident.flatNo || 'N/A'}</span>
                                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium uppercase">{selectedResident.role}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Family Details */}
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[20px]">family_restroom</span>
                                        Family Members
                                    </h4>
                                    <div className="space-y-3">
                                        {!selectedResident.familyMembers || selectedResident.familyMembers.length === 0 ? (
                                            <p className="text-sm text-slate-500 italic">No family details provided.</p>
                                        ) : (
                                            selectedResident.familyMembers.map((member, i) => (
                                                <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                                                    <div>
                                                        <p className="text-sm font-bold dark:text-white">{member.name}</p>
                                                        <p className="text-xs text-slate-500">{member.relation}</p>
                                                    </div>
                                                    <span className="text-xs text-slate-500">{member.age} yrs</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Vehicles */}
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[20px]">directions_car</span>
                                        Vehicles
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {!selectedResident.vehicles || selectedResident.vehicles.length === 0 ? (
                                            <p className="text-sm text-slate-500 italic col-span-2">No vehicles registered.</p>
                                        ) : (
                                            selectedResident.vehicles.map((v, i) => (
                                                <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="material-symbols-outlined text-[16px] text-slate-400">
                                                            {v.type === '4 Wheeler' ? 'directions_car' : 'two_wheeler'}
                                                        </span>
                                                        <p className="text-xs font-bold dark:text-white">{v.make}</p>
                                                    </div>
                                                    <p className="text-[10px] font-mono text-slate-500 uppercase">{v.number}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                                <button
                                    onClick={() => setIsProfileModalOpen(false)}
                                    className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toolbar */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:max-w-md group">
                    <span className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-primary transition-colors material-symbols-outlined text-[20px]">search</span>
                    <input
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                        placeholder="Search by name, email, or flat no..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <select
                        className="w-full sm:w-auto px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer shadow-sm"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="member">Members</option>
                        <option value="admin">Admins</option>
                        <option value="guard">Security Guards</option>
                    </select>
                </div>
            </div>

            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : filteredResidents.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">group_off</span>
                        <p>No residents found matching your criteria.</p>
                    </div>
                ) : (
                    filteredResidents.map((resident) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={resident._id}
                            className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
                        >
                            <div className="p-6 pb-4 flex flex-col items-center flex-grow text-center relative">
                                <div className="absolute top-4 right-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button onClick={() => handleDelete(resident._id)} className="hover:text-red-500 transition-colors" title="Remove Resident">
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </div>
                                <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-xl uppercase mb-3">
                                    {(resident.name || '?').charAt(0)}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{resident.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{resident.email}</p>

                                <div className="mt-4 flex flex-col w-full gap-2">
                                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                        <span className="material-symbols-outlined mr-1 text-[14px]">apartment</span>
                                        {resident.flatNo || 'N/A'}
                                    </span>
                                    <button
                                        onClick={() => handleViewProfile(resident)}
                                        className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-primary transition-all"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                                <span className={`font-semibold uppercase tracking-wider ${resident.role === 'admin' ? 'text-purple-600 dark:text-purple-400' :
                                    resident.role === 'guard' ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'
                                    }`}>
                                    {resident.role}
                                </span>
                                <select
                                    className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md text-slate-700 dark:text-slate-300 focus:outline-none focus:border-primary shadow-sm"
                                    value={resident.role}
                                    onChange={(e) => handleRoleChange(resident._id, e.target.value)}
                                >
                                    <option value="member">Member</option>
                                    <option value="admin">Admin</option>
                                    <option value="guard">Guard</option>
                                </select>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Pagination Placeholder */}
            {!loading && filteredResidents.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        Showing all <span className="font-medium text-slate-900 dark:text-white">{filteredResidents.length}</span> residents
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminResidentModule;
