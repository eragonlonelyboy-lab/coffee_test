import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { outlets } from '../data/mockData';
import { XCircleIcon, PencilIcon } from '../assets/icons';

interface OrderCardProps {
    order: Order;
    onCancelOrder: (orderId: string) => void;
    onLeaveReview?: (order: Order) => void;
}

const statusStyles: Record<OrderStatus, string> = {
    [OrderStatus.InProgress]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    [OrderStatus.ReadyForPickup]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    [OrderStatus.Completed]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    [OrderStatus.Cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onCancelOrder, onLeaveReview }) => {
    const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
    const outlet = outlets.find(o => o.id === order.outletId);

    const handleCancelClick = () => {
        setIsConfirmingCancel(true);
    };

    const handleConfirmCancel = () => {
        onCancelOrder(order.id);
        setIsConfirmingCancel(false);
    };
    
    const CancelConfirmationModal = () => (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={() => setIsConfirmingCancel(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm text-center p-6" onClick={(e) => e.stopPropagation()}>
                <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Are you sure?</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Do you really want to cancel this order? This action cannot be undone.</p>
                <div className="flex justify-center gap-4">
                    <button 
                        onClick={() => setIsConfirmingCancel(false)}
                        className="px-6 py-2 font-semibold rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Keep Order
                    </button>
                    <button 
                        onClick={handleConfirmCancel}
                        className="px-6 py-2 font-semibold rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                        Yes, Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    const canReview = order.status === OrderStatus.Completed && !order.reviewId && onLeaveReview;

    return (
        <>
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
            <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3 flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">${order.total.toFixed(2)}</span>
            </div>
            {(order.status === OrderStatus.InProgress || canReview) && (
                 <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
                     {order.status === OrderStatus.InProgress && (
                         <button
                            onClick={handleCancelClick}
                            className="w-full text-center px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                        >
                            Cancel Order
                        </button>
                     )}
                     {canReview && (
                          <button
                            onClick={() => onLeaveReview(order)}
                            className="w-full flex items-center justify-center gap-2 text-center px-4 py-2 text-sm font-semibold text-brand-600 bg-brand-50 dark:bg-brand-900/20 rounded-md hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
                        >
                            <PencilIcon className="w-4 h-4" />
                            Leave a Review
                        </button>
                     )}
                </div>
            )}
        </div>
        {isConfirmingCancel && <CancelConfirmationModal />}
        </>
    );
};

export default OrderCard;