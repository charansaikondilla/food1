import React, { useState } from 'react';
import type { MenuItem, CartItem } from '../types';
import { Dietary } from '../types';
import { HeartIcon, StarIcon, XMarkIcon, PlusIcon, MinusIcon } from './Icons';

interface ItemDetailModalProps {
    item: MenuItem;
    isFavorite: boolean;
    cartItem?: CartItem;
    onClose: () => void;
    onToggleFavorite: (id: number) => void;
    onUpdateQuantity: (id: number, quantity: number) => void;
}

const SpiceLevelDetail: React.FC<{ level: number }> = ({ level }) => {
    if (level === 0) return <div className="text-slate-500">Non-Spicy</div>;
    return (
        <div className="flex items-center space-x-1 text-red-500">
            {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={`text-2xl ${i < level ? 'opacity-100' : 'opacity-20'}`}>🌶️</span>
            ))}
            <span className="ml-2 font-medium">{['Mild', 'Medium', 'Hot'][level - 1]}</span>
        </div>
    );
};

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, isFavorite, cartItem, onClose, onToggleFavorite, onUpdateQuantity }) => {
    const [quantity, setQuantity] = useState(cartItem?.quantity || 1);
    
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(item.id);
    };
    
    const handleQuantityChange = (amount: number) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };

    const handleConfirm = () => {
        onUpdateQuantity(item.id, quantity);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white border border-slate-200 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl shadow-slate-900/10 relative animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="relative">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-64 object-cover rounded-t-2xl" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent"></div>
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-14 bg-black/30 p-2 rounded-full text-white hover:bg-black/50 transition-colors z-10"
                        aria-label="Close"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleFavoriteClick}
                        className="absolute top-3 right-3 bg-black/30 p-2 rounded-full text-white transition-all hover:bg-red-600 hover:scale-110 z-10"
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <HeartIcon className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
                    </button>
                </div>

                <div className="p-6 -mt-16 relative z-0">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{item.name}</h2>
                    
                    <div className="flex justify-between items-center mb-4 text-slate-700">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center bg-amber-400/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-400/20">
                                <StarIcon className="w-5 h-5 text-amber-500 mr-1" />
                                <span className="text-base font-semibold">{item.rating.toFixed(1)}</span>
                            </div>
                             <div className="flex items-center">
                                 <span className={`w-4 h-4 rounded-full mr-2 border-2 ${item.dietary === Dietary.Veg ? 'bg-green-500 border-green-300/50' : 'bg-red-500 border-red-300/50'}`}></span>
                                 <span className="font-medium text-sm">{item.dietary === Dietary.Veg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
                            </div>
                        </div>
                         <span className="text-3xl font-bold text-slate-800">₹{item.price}</span>
                    </div>

                    <p className="text-slate-600 mb-6">{item.description}</p>
                    
                    <div className="bg-slate-100 p-4 rounded-lg mb-6 border border-slate-200">
                        <h4 className="text-sm font-semibold text-slate-500 mb-2">Spice Level</h4>
                        <SpiceLevelDetail level={item.spiceLevel} />
                    </div>

                     <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center bg-slate-200 rounded-lg text-slate-800 font-bold flex-shrink-0">
                            <button onClick={() => handleQuantityChange(-1)} className="px-4 py-3 rounded-l-lg hover:bg-slate-300 transition-colors" aria-label="Decrease quantity">
                                <MinusIcon className="w-6 h-6" />
                            </button>
                            <span className="px-4 text-lg w-12 text-center" aria-live="polite">{quantity}</span>
                            <button onClick={() => handleQuantityChange(1)} className="px-4 py-3 rounded-r-lg hover:bg-slate-300 transition-colors" aria-label="Increase quantity">
                                <PlusIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <button
                            onClick={handleConfirm}
                            className="w-full bg-red-600 text-white hover:bg-red-700 font-bold text-lg py-3 px-6 rounded-lg transition-colors"
                        >
                            <span>{cartItem ? 'Update Cart' : 'Add to Cart'}</span>
                            <span className="mx-2">•</span>
                            <span>₹{item.price * quantity}</span>
                        </button>
                    </div>

                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ItemDetailModal;