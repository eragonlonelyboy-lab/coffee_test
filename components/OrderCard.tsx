import React from 'react';
import { Order, OrderStatus } from '../types';
import { outlets } from '../data/mockData';

interface OrderCardProps {
    order: Order;
}

const statusStyles: Record<OrderStatus, string> = {
    [OrderStatus.InProgress]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    [OrderStatus.ReadyForPickup]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    [OrderStatus.Completed]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    [OrderStatus.Cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
    const outlet = outlets.find(o => o.id === order.outletId);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-lg">{outlet?.name || 'Unknown Outlet'}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Order #{order.id} &bull; {new Date(order.date).toLocaleDateString()}
                    </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[order.status]}`}>
                    {order.status}
                </span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <ul className="space-y-2 text-sm">
                    {order.items.map(item => (
                        <li key={item.id} className="flex justify-between">
                            <span>{item.quantity}x {item.drink.name}</span>
                            <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3 flex justify-between items-center font-semibold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default OrderCard;
