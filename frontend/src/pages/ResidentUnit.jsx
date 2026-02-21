import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function ResidentUnit() {
    const { user, updateProfile } = useAuth();

    const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
    const [familyData, setFamilyData] = useState({ name: '', relation: '', age: '' });

    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
    const [vehicleData, setVehicleData] = useState({ type: '4 Wheeler', number: '', make: '' });

    const handleAddFamily = async (e) => {
        e.preventDefault();
        try {
            const currentMembers = user?.familyMembers || [];
            await updateProfile({
                ...user,
                familyMembers: [...currentMembers, { ...familyData, age: Number(familyData.age) }]
            });
            toast.success('Family member added!');
            setIsFamilyModalOpen(false);
            setFamilyData({ name: '', relation: '', age: '' });
        } catch (error) {
            toast.error(error.message || 'Failed to add family member');
        }
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            const currentVehicles = user?.vehicles || [];
            await updateProfile({
                ...user,
                vehicles: [...currentVehicles, vehicleData]
            });
            toast.success('Vehicle added!');
            setIsVehicleModalOpen(false);
            setVehicleData({ type: '4 Wheeler', number: '', make: '' });
        } catch (error) {
            toast.error(error.message || 'Failed to add vehicle');
        }
    };

    return (
        <div className="flex-1 p-4 md:p-6 lg:p-10 w-full max-w-7xl mx-auto custom-scrollbar overflow-y-auto">
            <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">My Unit</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Unit Info */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined">door_front</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Flat {user?.flatNo || 'A-101'}</h2>
                            <p className="text-sm text-slate-500">Golden Oaks Society</p>
                        </div>
                    </div>
                    <div className="space-y-4 pt-2">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Primary Resident</p>
                            <p className="text-base font-bold text-slate-900 dark:text-white">{user?.name || 'John Doe'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Contact Number</p>
                            <p className="text-base font-bold text-slate-900 dark:text-white">{user?.phone || '+1 (555) 123-4567'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Email Address</p>
                            <p className="text-base font-bold text-slate-900 dark:text-white">{user?.email || 'john@example.com'}</p>
                        </div>
                    </div>
                </div>

                {/* Family Members */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">family_restroom</span>
                            Family Members
                        </h2>
                        <button onClick={() => setIsFamilyModalOpen(true)} className="text-sm font-bold text-primary hover:underline">Add</button>
                    </div>
                    <div className="space-y-3 pt-2">
                        {(!user?.familyMembers || user.familyMembers.length === 0) ? (
                            <p className="text-sm text-slate-500">No family members added yet.</p>
                        ) : (
                            user.familyMembers.map((member, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{member.name}</p>
                                        <p className="text-xs text-slate-500">{member.relation} {member.age ? `• ${member.age} yrs` : ''}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Vehicles */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4 md:col-span-2">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">directions_car</span>
                            Registered Vehicles
                        </h2>
                        <button onClick={() => setIsVehicleModalOpen(true)} className="text-sm font-bold text-primary hover:underline">Add Vehicle</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {(!user?.vehicles || user.vehicles.length === 0) ? (
                            <p className="text-sm text-slate-500 col-span-2">No vehicles registered.</p>
                        ) : (
                            user.vehicles.map((vehicle, index) => (
                                <div key={index} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-500">
                                            {vehicle.type === '2 Wheeler' ? 'two_wheeler' : 'directions_car'}
                                        </span>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{vehicle.make || vehicle.type}</p>
                                            <p className="text-xs font-mono text-slate-500 uppercase">{vehicle.number}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Add Family Modal */}
            {isFamilyModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold dark:text-white">Add Family Member</h2>
                            <button onClick={() => setIsFamilyModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddFamily} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                <input type="text" required value={familyData.name} onChange={e => setFamilyData({ ...familyData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:outline-none focus:border-primary" placeholder="Enter name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Relationship</label>
                                <select required value={familyData.relation} onChange={e => setFamilyData({ ...familyData, relation: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:outline-none focus:border-primary">
                                    <option value="">Select Relation</option>
                                    <option value="Spouse">Spouse</option>
                                    <option value="Child">Child</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Sibling">Sibling</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Age</label>
                                <input type="number" required min="0" value={familyData.age} onChange={e => setFamilyData({ ...familyData, age: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:outline-none focus:border-primary" placeholder="Age" />
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button type="button" onClick={() => setIsFamilyModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-300 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">Save Details</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Vehicle Modal */}
            {isVehicleModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold dark:text-white">Register Vehicle</h2>
                            <button onClick={() => setIsVehicleModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddVehicle} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vehicle Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button type="button" onClick={() => setVehicleData({ ...vehicleData, type: '2 Wheeler' })} className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 border ${vehicleData.type === '2 Wheeler' ? 'bg-primary/10 border-primary text-primary' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                                        <span className="material-symbols-outlined">two_wheeler</span> 2 Wheeler
                                    </button>
                                    <button type="button" onClick={() => setVehicleData({ ...vehicleData, type: '4 Wheeler' })} className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 border ${vehicleData.type === '4 Wheeler' ? 'bg-primary/10 border-primary text-primary' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                                        <span className="material-symbols-outlined">directions_car</span> 4 Wheeler
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Make & Model</label>
                                <input type="text" required value={vehicleData.make} onChange={e => setVehicleData({ ...vehicleData, make: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:outline-none focus:border-primary" placeholder="e.g. Honda City" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Registration Number</label>
                                <input type="text" required value={vehicleData.number} onChange={e => setVehicleData({ ...vehicleData, number: e.target.value.toUpperCase() })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:outline-none focus:border-primary font-mono uppercase" placeholder="e.g. MH 01 AB 1234" />
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button type="button" onClick={() => setIsVehicleModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-300 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">Register Vehicle</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
