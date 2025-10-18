import React, { useMemo } from 'react';
import type { Order } from '../../types';
import AdminNav from './AdminNav';
import NewOrderQueue from './NewOrderQueue';
import OrderCard from './OrderCard';

interface AdminPanelProps {
    orders: Order[];
    onLogout: () => void;
    onToggleStatus: (orderId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ orders, onLogout, onToggleStatus }) => {
    const newOrders = useMemo(() => orders.filter(o => o.status === 'new').sort((a, b) => a.timestamp - b.timestamp), [orders]);
    const completedOrders = useMemo(() => orders.filter(o => o.status === 'completed').sort((a, b) => b.timestamp - a.timestamp), [orders]);
    const totalSales = useMemo(() => completedOrders.reduce((sum, order) => sum + order.total, 0), [completedOrders]);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-300">
            <AdminNav onLogout={onLogout} />
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                        <p className="text-slate-400 mt-1">Live order management and analytics.</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <h3 className="text-sm font-medium text-slate-400">Total Sales (Completed)</h3>
                            <p className="text-3xl font-bold text-white mt-2">₹{totalSales.toFixed(2)}</p>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <h3 className="text-sm font-medium text-slate-400">Pending Orders</h3>
                            <p className="text-3xl font-bold text-blue-400 mt-2">{newOrders.length}</p>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <h3 className="text-sm font-medium text-slate-400">Completed Orders</h3>
                            <p className="text-3xl font-bold text-green-400 mt-2">{completedOrders.length}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* New Order Queue */}
                        <div className="lg:col-span-1">
                            <NewOrderQueue newOrders={newOrders} onToggleStatus={onToggleStatus} />
                        </div>

                        {/* Order History */}
                        <div className="lg:col-span-2">
                             <h2 className="text-xl font-semibold text-white mb-4">Order History</h2>
                             <div className="space-y-4">
                                {completedOrders.length > 0 ? (
                                    completedOrders.map(order => (
                                        <OrderCard key={order.id} order={order} onToggleStatus={onToggleStatus} />
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
                                        <p className="text-slate-400">No completed orders yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
