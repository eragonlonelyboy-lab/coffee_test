import React from 'react';
import { orders } from '../data/mockData';
import { useCurrentUser } from '../hooks/useCurrentUser';
import OrderCard from '../components/OrderCard';
import { DocumentTextIcon } from '../assets/icons';

const OrdersPage: React.FC = () => {
    const currentUser = useCurrentUser();
    const userOrders = orders.filter(order => order.userId === currentUser?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const currentOrders = userOrders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled');
    const pastOrders = userOrders.filter(o => o.status === 'Completed' || o.status === 'Cancelled');

    return (
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
                                {currentOrders.map(order => <OrderCard key={order.id} order={order} />)}
                            </div>
                        </div>
                    )}

                    {pastOrders.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Past Orders</h2>
                             <div className="space-y-4">
                                {pastOrders.map(order => <OrderCard key={order.id} order={order} />)}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
