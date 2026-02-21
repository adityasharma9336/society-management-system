import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Shield } from 'lucide-react';

export default function Sidebar() {
    return (
        <div className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen fixed">
            <div className="flex items-center justify-center h-16 border-b border-slate-800">
                <Link to="/" className="flex items-center space-x-2">
                    <Shield className="h-8 w-8 text-sky-500" />
                    <span className="text-xl font-bold text-white">SocietyManager</span>
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-2 space-y-1">
                    <Link to="/dashboard" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white bg-slate-800">
                        <LayoutDashboard className="mr-3 h-6 w-6 text-sky-500" />
                        Dashboard
                    </Link>
                    <Link to="/members" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                        <Users className="mr-3 h-6 w-6 text-slate-400 group-hover:text-slate-300" />
                        Members
                    </Link>
                    <Link to="/bills" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                        <FileText className="mr-3 h-6 w-6 text-slate-400 group-hover:text-slate-300" />
                        Bills
                    </Link>
                    <Link to="/settings" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                        <Settings className="mr-3 h-6 w-6 text-slate-400 group-hover:text-slate-300" />
                        Settings
                    </Link>
                </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-slate-800 p-4">
                <Link to="/logout" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white w-full">
                    <LogOut className="mr-3 h-6 w-6 text-slate-400 group-hover:text-red-400" />
                    Sign Out
                </Link>
            </div>
        </div>
    );
}
