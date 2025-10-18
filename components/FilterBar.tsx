import React from 'react';
import type { Category, SubCategory } from '../types';
import { Dietary } from '../types';
import { CATEGORIES, SUB_CATEGORIES_MAP } from '../constants';

interface FilterBarProps {
    activeCategory: Category | 'All';
    activeSubCategory: SubCategory | 'All';
    activeDietary: Dietary;
    onFilterChange: (category: Category | 'All', subCategory: SubCategory | 'All', dietary: Dietary) => void;
    disabled?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({ activeCategory, activeSubCategory, activeDietary, onFilterChange, disabled = false }) => {
    
    const dietaryOptions = [
        { label: 'All', value: Dietary.All, color: 'border-slate-300 text-slate-600 hover:bg-slate-200 hover:border-slate-400', activeColor: 'bg-red-600 text-white border-red-600' },
        { label: 'Veg', value: Dietary.Veg, color: 'border-green-500 text-green-600', activeColor: 'bg-green-500 text-white border-green-500' },
        { label: 'Non-Veg', value: Dietary.NonVeg, color: 'border-red-500 text-red-600', activeColor: 'bg-red-500 text-white border-red-500' }
    ];

    const handleCategoryChange = (category: Category | 'All') => {
        onFilterChange(category, 'All', activeDietary);
    };

    const handleSubCategoryChange = (subCategory: SubCategory | 'All') => {
        onFilterChange(activeCategory, subCategory, activeDietary);
    };

    const handleDietaryChange = (dietary: Dietary) => {
        onFilterChange(activeCategory, activeSubCategory, dietary);
    };

    const subCategories = activeCategory !== 'All' ? SUB_CATEGORIES_MAP[activeCategory] : [];

    return (
        <div className={`sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md py-4 shadow-md shadow-slate-900/5 transition-opacity ${disabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <fieldset disabled={disabled} className="px-4 space-y-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                {/* Dietary Toggles */}
                <div className="flex justify-center space-x-2">
                    {dietaryOptions.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => handleDietaryChange(opt.value)}
                            className={`px-5 py-1.5 text-sm font-semibold rounded-full border-2 transition-all duration-300 ${
                                activeDietary === opt.value
                                    ? opt.activeColor
                                    : opt.color
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                
                {/* Main Category Filters */}
                <div className="flex space-x-3 overflow-x-auto no-scrollbar justify-start sm:justify-center -mx-4 px-4 pb-2">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                                activeCategory === category
                                    ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm border border-slate-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Sub-Category Filters */}
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${subCategories.length > 0 ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                     {subCategories.length > 0 && (
                        <div className="flex space-x-2 overflow-x-auto no-scrollbar justify-start sm:justify-center -mx-4 px-4 pt-2 border-t border-slate-200">
                            {subCategories.map(subCat => (
                                <button
                                    key={subCat}
                                    onClick={() => handleSubCategoryChange(subCat)}
                                    className={`flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                                        activeSubCategory === subCat
                                            ? 'bg-red-600 text-white'
                                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                    }`}
                                >
                                    {subCat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </fieldset>
        </div>
    );
};

export default FilterBar;