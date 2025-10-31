import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { XCircleIcon, PencilIcon } from '../assets/icons';

interface OrderCardProps {
    order: Order;
    onCancelOrder: (orderId: string) => void;
    onLeaveReview?: (order: Order) => void;
}

const getDisplayStatus = (status: OrderStatus) => {
    switch(status) {
        case OrderStatus.New:
        case OrderStatus.Confirmed:
        case OrderStatus.Preparing:
            return 'In Progress';
        case OrderStatus.Ready:
            return 'Ready for Pickup';
        default:
            return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
}

const statusStyles: Record<string, string> = {
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Ready for Pickup': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    'Refunded': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onCancelOrder, onLeaveReview }) => {
    const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
    
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

    const canCancel = [OrderStatus.New, OrderStatus.Confirmed, OrderStatus.Preparing].includes(order.status);
    // Let user attempt to review any completed order. Backend will handle if already reviewed.
    const canReview = order.status === OrderStatus.Completed && onLeaveReview;
    const displayStatus = getDisplayStatus(order.status);

    return (
        <>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-lg">{order.store?.name || 'Unknown Outlet'}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Order #{order.id} &bull; {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[displayStatus]}`}>
                    {displayStatus}
                </span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <ul className="space-y-2 text-sm">
                    {order.items.map(item => (
                        <li key={item.id} className="flex justify-between">
                            <span>{item.quantity}x {item.menuItem.name}</span>
                            <span>${item.linePrice.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3 flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
            </div>
            {(canCancel || canReview) && (
                 <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
                     {canCancel && (
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