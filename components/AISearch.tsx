import React from 'react';
import { SearchIcon, SparklesIcon } from './Icons';

interface AISearchProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onAiSearch: () => void;
    isLoading: boolean;
}

const AISearch: React.FC<AISearchProps> = ({ searchQuery, setSearchQuery, onAiSearch, isLoading }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onAiSearch();
        }
    };
    
    return (
        <div id="ai-search" className="bg-transparent pt-2 pb-6 px-4">
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    placeholder="Ask me anything... (e.g., 'spicy chicken')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-11 pr-24 py-3.5 text-base bg-white border border-slate-300 text-slate-900 rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition placeholder-slate-400"
                />
                 <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                    <button 
                        onClick={onAiSearch}
                        disabled={isLoading}
                        className="flex items-center text-xs font-semibold text-red-500 bg-red-500/10 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <SparklesIcon className={`w-4 h-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`}/>
                        {isLoading ? 'Thinking...' : 'Ask AI'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AISearch;