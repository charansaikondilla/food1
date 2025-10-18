import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-red-500 mx-auto"></div>
                <h2 className="text-2xl font-semibold text-slate-800 mt-4">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">
                        Tastify
                    </span>
                </h2>
                <p className="text-slate-600">Preparing the flavors...</p>
            </div>
        </div>
    );
};

export default Loader;