import React from 'react';
import { OrderStatus } from '../types';
import { CheckIcon, ClockIcon } from '../assets/icons';

const statuses = [
    OrderStatus.New, // Represents the "In Progress" start
    OrderStatus.Ready,
    OrderStatus.Completed,
];

const statusDisplayMap: Record<string, string> = {
    [OrderStatus.New]: 'In Progress',
    [OrderStatus.Confirmed]: 'In Progress',
    [OrderStatus.Preparing]: 'In Progress',
    [OrderStatus.Ready]: 'Ready for Pickup',
    [OrderStatus.Completed]: 'Completed',
};

interface OrderStatusTrackerProps {
    currentStatus?: OrderStatus;
}

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ currentStatus }) => {
    
    const getStatusIndex = (status: OrderStatus | undefined) => {
        if (!status) return -1;
        switch(status) {
            case OrderStatus.New:
            case OrderStatus.Confirmed:
            case OrderStatus.Preparing:
                return 0;
            case OrderStatus.Ready:
                return 1;
            case OrderStatus.Completed:
                return 2;
            case OrderStatus.Cancelled:
            case OrderStatus.Refunded:
                return -2; // Special case for cancelled
            default:
                return -1;
        }
    };

    const currentStatusIndex = getStatusIndex(currentStatus);

    if (currentStatusIndex === -2) {
        return <p className="font-semibold text-red-500">This order has been cancelled.</p>
    }

    return (
        <div className="w-full px-4 sm:px-8">
            <div className="relative flex items-center justify-between">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700">
                     <div 
                        className="h-1 bg-brand-600 transition-all duration-500"
                        style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                    ></div>
                </div>
                {statuses.map((status, index) => {
                    const isActive = index <= currentStatusIndex;
                    return (
                        <div key={status} className="relative z-10 flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${
                                isActive ? 'bg-brand-600 text-white' : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-400'
                            }`}>
                               {isActive ? <CheckIcon className="w-5 h-5" /> : <ClockIcon className="w-5 h-5"/>}
                            </div>
                            <p className={`mt-2 text-xs sm:text-sm font-semibold transition-colors duration-500 ${
                                isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500'
                            }`}>{statusDisplayMap[status]}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStatusTracker;