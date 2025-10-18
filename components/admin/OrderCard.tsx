import React, { useState } from 'react';
import type { Order } from '../../types';
import { ChevronDownIcon, CheckCircleIcon } from '../Icons';

interface OrderCardProps {
    order: Order;
    onToggleStatus: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onToggleStatus }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const isNew = order.status === 'new';
    const time = new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxes = order.total - subtotal;
    
    const statusConfig = {
        new: {
            borderColor: 'border-blue-500/40',
            bgColor: 'bg-slate-800',
            tagColor: 'bg-blue-500/20 text-blue-300',
            tagText: 'New'
        },
        completed: {
            borderColor: 'border-slate-700',
            bgColor: 'bg-slate-800/50',
            tagColor: 'bg-green-500/20 text-green-300',
            tagText: 'Completed'
        }
    };
    
    const currentStatus = statusConfig[order.status];

    return (
        <div className={`rounded-xl border transition-all duration-300 ${currentStatus.borderColor} ${currentStatus.bgColor}`}>
            <div 
                className="flex items-center p-4 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                    <div>
                        <span className="text-xs text-slate-500 block">Order ID</span>
                        <span className="font-semibold text-slate-300">{order.id}</span>
                    </div>
                     <div>
                        <span className="text-xs text-slate-500 block">Status</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${currentStatus.tagColor}`}>{currentStatus.tagText}</span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 block">Time</span>
                        <span className="font-semibold text-slate-300">{time}</span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 block">Total</span>
                        <span className="font-bold text-lg text-white">₹{order.total.toFixed(2)}</span>
                    </div>
                </div>
                <ChevronDownIcon className={`w-6 h-6 text-slate-500 ml-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
                <div className="border-t border-slate-700 mx-4"></div>
                <div className="p-4">
                    <h4 className="font-semibold text-slate-300 mb-3">Order Details ({order.items.reduce((acc, item) => acc + item.quantity, 0)} items)</h4>
                    <div className="space-y-3">
                        {order.items.map(item => (
                            <div key={item.id} className="flex items-center gap-4 text-sm">
                                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className="font-semibold text-slate-200">{item.name}</p>
                                    <p className="text-slate-400">{item.quantity} x ₹{item.price.toFixed(2)}</p>
                                </div>
                                <p className="font-medium text-slate-300">₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-1 text-sm">
                         <div className="flex justify-between text-slate-400">
                            <span>Subtotal</span>
                            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                            <span>Taxes</span>
                            <span className="font-medium">₹{taxes.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-white mt-1">
                            <span>Total</span>
                            <span>₹{order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {isNew && (
                     <div className="p-4 border-t border-slate-700 bg-slate-800/50 rounded-b-xl">
                        <button 
                            onClick={() => onToggleStatus(order.id)}
                            className="w-full py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center bg-green-600/20 text-green-300 hover:bg-green-600/40"
                        >
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                            Mark as Complete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderCard;