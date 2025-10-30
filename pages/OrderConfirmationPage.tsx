import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircleIcon } from '../assets/icons';
import OrderStatusTracker from '../components/OrderStatusTracker';

const OrderConfirmationPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();

    // In a real app, you'd fetch order details using the orderId.
    // Here we'll just display a generic confirmation.
    
    return (
        <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500" />
                <h1 className="mt-4 text-3xl font-bold">Thank You For Your Order!</h1>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Your order <span className="font-semibold text-gray-700 dark:text-gray-200">#{orderId}</span> has been placed.
                </p>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                    You can track its progress below.
                </p>

                <div className="mt-8">
                   <OrderStatusTracker />
                </div>

                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        to="/menu"
                        className="w-full sm:w-auto bg-brand-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-brand-700 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                     <Link
                        to="/orders"
                        className="w-full sm:w-auto bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold px-6 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        View My Orders
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;