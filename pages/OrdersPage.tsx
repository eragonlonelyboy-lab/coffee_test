import React, { useState } from 'react';
import { orders as mockOrders } from '../data/mockData';
import { useCurrentUser } from '../hooks/useCurrentUser';
import OrderCard from '../components/OrderCard';
import { DocumentTextIcon } from '../assets/icons';
import { useNotification } from '../contexts/NotificationContext';
import { Order, OrderStatus } from '../types';
import ReviewPromptModal from '../components/reviews/ReviewPromptModal';
import { useAuth } from '../contexts/AuthContext';

const OrdersPage: React.FC = () => {
    const currentUser = useCurrentUser();
    const { addNotification } = useNotification();
    const { addReview } = useAuth();
    
    const [userOrders, setUserOrders] = useState<Order[]>(() => 
        mockOrders
        .filter(order => order.userId === currentUser?.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );

    const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);

    const handleCancelOrder = (orderId: string) => {
        setUserOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === orderId ? { ...order, status: OrderStatus.Cancelled } : order
            )
        );
        addNotification(`Order #${orderId.slice(-5)} has been cancelled.`, 'success');
    };

    const handleAddReview = (order: Order, rating: number, comment: string) => {
        addReview({
            orderId: order.id,
            storeId: order.outletId,
            rating,
            comment,
        });
        
        // Update the order in the local state to mark it as reviewed
        const newReviewId = `rev-${Date.now()}`;
        setUserOrders(prev => prev.map(o => o.id === order.id ? {...o, reviewId: newReviewId} : o));
        
        // Also update the mock data source
        const orderInMock = mockOrders.find(o => o.id === order.id);
        if(orderInMock) orderInMock.reviewId = newReviewId;

        addNotification('Thank you for your review!', 'success');
        setReviewingOrder(null);
    };

    const currentOrders = userOrders.filter(o => o.status === OrderStatus.InProgress || o.status === OrderStatus.ReadyForPickup);
    const pastOrders = userOrders.filter(o => o.status === OrderStatus.Completed || o.status === OrderStatus.Cancelled);

    return (
        <>
            <div>
                <h1 className="text-3xl font-bold mb-6">My Orders</h1>
                
                {userOrders.length === 0 ? (
                     <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg">
                        <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
                        <h2 className="mt-4 text-xl font-semibold">No Orders Yet</h2>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Your past and current orders will appear here.</p>
                     </div>
                ) : (
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
                )}
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