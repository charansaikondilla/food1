import React, { useRef } from 'react';
import type { MenuItem } from '../types';
import MenuItemCard from './MenuItemCard';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

interface MenuGridProps {
    items: MenuItem[];
    favorites: number[];
    onToggleFavorite: (id: number) => void;
    onSelectItem: (item: MenuItem) => void;
    isAiFiltered?: boolean;
}

const AnimatedMenuItem: React.FC<{
    item: MenuItem;
    index: number;
    favorites: number[];
    onToggleFavorite: (id: number) => void;
    onSelectItem: (item: MenuItem) => void;
}> = ({ item, index, favorites, onToggleFavorite, onSelectItem }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1 });

    return (
        <div
            ref={cardRef}
            className={`reveal ${isVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: `${(index % 4) * 50}ms` }}
        >
            <MenuItemCard 
                item={item}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={() => onSelectItem(item)}
            />
        </div>
    );
};


const MenuGrid: React.FC<MenuGridProps> = ({ items, favorites, onToggleFavorite, onSelectItem, isAiFiltered = false }) => {
    return (
        <div id="menu-grid" className="px-4 py-8 bg-transparent">
            {items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item, index) => (
                        <AnimatedMenuItem
                            key={item.id}
                            item={item}
                            index={index}
                            favorites={favorites}
                            onToggleFavorite={onToggleFavorite}
                            onSelectItem={onSelectItem}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white/50 rounded-lg backdrop-blur-sm border border-slate-200">
                    <p className="text-slate-700 text-lg font-semibold">{isAiFiltered ? "I couldn't find any specific matches." : "No items match your search or filter."}</p>
                    <p className="text-slate-500 mt-1">{isAiFiltered ? "Try asking me something different!" : "Try adjusting your selection."}</p>
                </div>
            )}
        </div>
    );
};

export default MenuGrid;