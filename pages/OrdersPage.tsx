import React, { useState, useEffect } from 'react';
import OrderCard from '../components/OrderCard';
import { DocumentTextIcon } from '../assets/icons';
import { useNotification } from '../contexts/NotificationContext';
import { Order, OrderStatus } from '../types';
import ReviewPromptModal from '../components/reviews/ReviewPromptModal';
import { useAuth } from '../contexts/AuthContext';

const OrdersPage: React.FC = () => {
    const { addNotification } = useNotification();
    const { token } = useAuth();
    
    const [userOrders, setUserOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                setError("You must be logged in to view orders.");
                setIsLoading(false);
                return;
            }
            try {
                const response = await fetch('/api/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Failed to fetch orders.");
                const data = await response.json();
                setUserOrders(data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const handleCancelOrder = async (orderId: string) => {
        if (!token) return;
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: 'CANCELLED' })
            });
            if (!response.ok) throw new Error("Failed to cancel order.");
            
            setUserOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, status: OrderStatus.Cancelled } : order
                )
            );
            addNotification(`Order #${orderId.slice(-5)} has been cancelled.`, 'success');

        } catch (err) {
            addNotification('Could not cancel the order. Please try again.', 'error');
        }
    };

    const handleAddReview = async (order: Order, rating: number, comment: string) => {
        if (!token) {
            addNotification('You must be logged in to leave a review.', 'error');
            return;
        }

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderId: order.id,
                    storeId: order.storeId,
                    rating,
                    comment
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit review.');
            }
            
            // Refetch orders to get updated review status, though the backend doesn't link them directly.
            // For now, simply close the modal.
            addNotification('Thank you for your review!', 'success');
            
        } catch (err: any) {
            addNotification(err.message, 'error');
        } finally {
            setReviewingOrder(null);
        }
    };
    
    const renderContent = () => {
        if (isLoading) return <p>Loading your orders...</p>;
        if (error) return <p className="text-red-500">{error}</p>;
        if (userOrders.length === 0) {
            return (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg">
                    <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
                    <h2 className="mt-4 text-xl font-semibold">No Orders Yet</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Your past and current orders will appear here.</p>
                </div>
            );
        }

        const currentOrders = userOrders.filter(o => ![OrderStatus.Completed, OrderStatus.Cancelled, OrderStatus.Refunded].includes(o.status));
        const pastOrders = userOrders.filter(o => [OrderStatus.Completed, OrderStatus.Cancelled, OrderStatus.Refunded].includes(o.status));

        return (
            <div className="space-y-8">
                {currentOrders.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Current Orders</h2>
                        <div className="space-y-4">
                            {currentOrders.map(order => 
                                <OrderCard 
                                    key={order.id} 
                                    order={order} 
                                    onCancelOrder={handleCancelOrder} 
                                />
                            )}
                        </div>
                    </div>
                )}

                {pastOrders.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Past Orders</h2>
                        <div className="space-y-4">
                            {pastOrders.map(order => 
                                <OrderCard 
                                    key={order.id} 
                                    order={order} 
                                    onCancelOrder={handleCancelOrder} 
                                    onLeaveReview={() => setReviewingOrder(order)}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <div>
                <h1 className="text-3xl font-bold mb-6">My Orders</h1>
                {renderContent()}
            </div>
             {reviewingOrder && (
                <ReviewPromptModal
                    isOpen={!!reviewingOrder}
                    onClose={() => setReviewingOrder(null)}
                    onSubmit={handleAddReview}
                    order={reviewingOrder}
                />
            )}
        </>
    );
};

export default OrdersPage;