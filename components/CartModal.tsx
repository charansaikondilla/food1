import React, { useState, useMemo } from 'react';
import type { CartItem } from '../types';
import { XMarkIcon, PlusIcon, MinusIcon, TrashIcon, ShoppingCartIcon } from './Icons';

interface CartModalProps {
    cart: CartItem[];
    onClose: () => void;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onPlaceOrder: () => Promise<void>;
}

const CartModal: React.FC<CartModalProps> = ({ cart, onClose, onUpdateQuantity, onPlaceOrder }) => {
    const [orderState, setOrderState] = useState<'idle' | 'processing' | 'success'>('idle');

    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
    const taxes = subtotal * 0.05; // 5% tax
    const total = subtotal + taxes;

    const handlePlaceOrder = async () => {
        setOrderState('processing');
        await onPlaceOrder();
        setOrderState('success');
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={orderState === 'idle' ? onClose : undefined}
        >
            <div
                className="bg-slate-50 border border-slate-200 rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl shadow-slate-900/10 relative animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                {orderState === 'success' ? (
                     <div className="flex flex-col items-center justify-center text-center p-8 h-96">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-pop-in">
                            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Order Placed!</h2>
                        <p className="text-slate-600 mt-2">Your delicious meal is being prepared. Thank you!</p>
                    </div>
                ) : (
                <>
                <header className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-800">Your Order</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
                        aria-label="Close cart"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-16">
                            <ShoppingCartIcon className="w-16 h-16 text-slate-300 mb-4" />
                            <h3 className="text-lg font-semibold text-slate-700">Your cart is empty</h3>
                            <p className="text-slate-500 mt-1">Add some delicious items from the menu!</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
                                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                <div className="flex-grow">
                                    <p className="font-bold text-slate-800">{item.name}</p>
                                    <p className="text-sm text-slate-500">₹{item.price}</p>
                                </div>
                                <div className="flex items-center justify-center bg-slate-100 rounded-lg text-slate-800 font-bold">
                                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 rounded-l-lg hover:bg-slate-200 transition-colors">
                                        {item.quantity === 1 ? <TrashIcon className="w-5 h-5 text-red-500"/> : <MinusIcon className="w-5 h-5" />}
                                    </button>
                                    <span className="px-3 text-sm">{item.quantity}</span>
                                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 rounded-r-lg hover:bg-slate-200 transition-colors"><PlusIcon className="w-5 h-5" /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <footer className="p-4 border-t border-slate-200 bg-white/50 rounded-b-2xl flex-shrink-0">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Taxes (5%)</span>
                                <span className="font-medium">₹{taxes.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-slate-800">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={orderState === 'processing'}
                            className="w-full mt-4 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-all disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {orderState === 'processing' && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                            {orderState === 'processing' ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </footer>
                )}
                </>
                )}
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
                 @keyframes pop-in {
                    0% { transform: scale(0.5); opacity: 0; }
                    80% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-pop-in {
                    animation: pop-in 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default CartModal;
