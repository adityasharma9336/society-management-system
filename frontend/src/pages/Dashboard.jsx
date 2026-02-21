import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import { Bell, Search } from 'lucide-react';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-900">
            <Sidebar />
            <div className="md:pl-64 flex flex-col flex-1">
                <header className="flex-shrink-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <h1 className="text-xl font-bold text-white">Dashboard Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <button className="text-slate-400 hover:text-white">
                            <Search className="h-6 w-6" />
                        </button>
                        <button className="text-slate-400 hover:text-white">
                            <Bell className="h-6 w-6" />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">
                            US
                        </div>
                    </div>
                </header>

                <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Stats Card 1 */}
                        <div className="bg-slate-800 overflow-hidden shadow rounded-lg border border-slate-700">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-slate-400 truncate">Total Members</dt>
                                <dd className="mt-1 text-3xl font-semibold text-white">128</dd>
                            </div>
                        </div>

                        {/* Stats Card 2 */}
                        <div className="bg-slate-800 overflow-hidden shadow rounded-lg border border-slate-700">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-slate-400 truncate">Pending Complaints</dt>
                                <dd className="mt-1 text-3xl font-semibold text-white">4</dd>
                            </div>
                        </div>

                        {/* Stats Card 3 */}
                        <div className="bg-slate-800 overflow-hidden shadow rounded-lg border border-slate-700">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-slate-400 truncate">Maintenance Collected</dt>
                                <dd className="mt-1 text-3xl font-semibold text-white">₹4,50,000</dd>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg leading-6 font-medium text-white mb-4">Recent Activity</h2>
                        <div className="bg-slate-800 shadow overflow-hidden sm:rounded-md border border-slate-700">
                            <ul className="divide-y divide-slate-700">
                                <li className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-sky-400 truncate">New Complaint: Water Leakage</p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">High Priority</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-slate-400">Block A-101</p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-slate-400 sm:mt-0">
                                            <p>1 hour ago</p>
                                        </div>
                                    </div>
                                </li>
                                {/* More items... */}
                            </ul>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
