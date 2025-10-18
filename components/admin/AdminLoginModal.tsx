import React, { useState } from 'react';
import { XMarkIcon, LockClosedIcon } from '../Icons';

interface AdminLoginModalProps {
    onClose: () => void;
    onLogin: (code: string) => boolean;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLogin }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = onLogin(code);
        if (!success) {
            setError('Invalid access code. Please try again.');
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm shadow-2xl shadow-slate-900/10 relative animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center">
                        <LockClosedIcon className="w-5 h-5 mr-2 text-slate-500" />
                        Admin Access
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                        aria-label="Close"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="p-6">
                    <label htmlFor="admin-code" className="block text-sm font-medium text-slate-700 mb-2">
                        Enter Access Code
                    </label>
                    <input
                        id="admin-code"
                        type="password"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        className="w-full px-3 py-2 text-base bg-white border border-slate-300 text-slate-900 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition placeholder-slate-400"
                        placeholder="••••••••"
                        autoFocus
                    />
                    {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                    <button
                        type="submit"
                        className="w-full mt-4 bg-red-600 text-white font-bold py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
                        disabled={!code}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginModal;