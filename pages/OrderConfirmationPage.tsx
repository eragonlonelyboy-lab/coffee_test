import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircleIcon } from '../assets/icons';
import OrderStatusTracker from '../components/OrderStatusTracker';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types';

const OrderConfirmationPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { token } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!token || !orderId) return;
            try {
                const response = await fetch(`/api/orders/${orderId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Could not find order");
                const data = await response.json();
                setOrder(data.order);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, token]);

    if (isLoading) {
        return <div className="text-center">Loading order confirmation...</div>
    }
    
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
                   <OrderStatusTracker currentStatus={order?.status} />
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