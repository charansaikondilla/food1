import React from 'react';
import { ArrowLeftOnRectangleIcon } from '../Icons';

interface AdminNavProps {
    onLogout: () => void;
}

const AdminNav: React.FC<AdminNavProps> = ({ onLogout }) => {
    return (
        <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                         <h1 className="text-xl font-bold text-white">
                             <span className="text-red-500">Tastify</span> Admin
                         </h1>
                    </div>
                    <div>
                         <button
                            onClick={onLogout}
                            className="flex items-center text-sm font-semibold text-slate-300 hover:text-red-400 transition-colors"
                        >
                            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminNav;
