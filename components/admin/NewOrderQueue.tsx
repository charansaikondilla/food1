import React from 'react';
import type { Order } from '../../types';
import OrderCard from './OrderCard';

interface NewOrderQueueProps {
    newOrders: Order[];
    onToggleStatus: (orderId: string) => void;
}

const NewOrderQueue: React.FC<NewOrderQueueProps> = ({ newOrders, onToggleStatus }) => {
    return (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 h-full">
            <div className="p-4 border-b border-slate-700">
                 <h2 className="text-xl font-semibold text-white">New Order Queue</h2>
                 <p className="text-sm text-slate-400">Orders needing immediate attention.</p>
            </div>
            <div className="p-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                 {newOrders.length > 0 ? (
                    newOrders.map(order => (
                        <OrderCard key={order.id} order={order} onToggleStatus={onToggleStatus} />
                    ))
                ) : (
                    <div className="text-center py-12">
                         <p className="text-slate-400">No new orders at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewOrderQueue;
