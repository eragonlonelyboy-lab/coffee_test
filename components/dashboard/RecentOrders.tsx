import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useNotification } from '../../contexts/NotificationContext';
import { DocumentTextIcon, ArrowPathIcon } from '../../assets/icons';
import { Order } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const RecentOrders: React.FC = () => {
    const { addToCart } = useCart();
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            if (!token) return;
            try {
                const response = await fetch('/api/orders?limit=3', { // Assuming the API supports a limit
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) return;
                const data = await response.json();
                // Filter for completed orders suitable for reordering
                const completedOrders = data.filter((o: Order) => o.status === 'COMPLETED').slice(0, 3);
                setRecentOrders(completedOrders);
            } catch (e) {
                console.error("Failed to fetch recent orders");
            }
        };
        fetchRecentOrders();
    }, [token]);

    const handleReorder = (order: Order) => {
        // The addToCart function in the context now requires the full Drink object.
        // The order.items from the backend only have basic details (name, price).
        // This is a limitation. For now, we cannot directly re-add to cart without
        // fetching full drink details first. We will navigate to the menu instead.
        addNotification(`Feature coming soon! View the menu to order again.`, 'info');
        navigate('/menu');
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Quick Reorder</h2>
                <Link to="/orders" className="text-sm font-semibold text-brand-600 hover:underline">
                    View All Orders
                </Link>
            </div>
             {recentOrders.length > 0 ? (
                <ul className="space-y-3">
                    {recentOrders.map(order => (
                        <li key={order.id} className="flex items-center justify-between text-sm p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md gap-2">
                            <div className="flex-grow min-w-0">
                                <p className="font-medium truncate">
                                    {order.items.map(i => i.menuItem.name).join(', ')}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => handleReorder(order)}
                                className="flex-shrink-0 flex items-center gap-2 bg-brand-100 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold px-3 py-1.5 rounded-md hover:bg-brand-200 dark:hover:bg-brand-500/20 transition-colors"
                                aria-label={`Reorder items from order #${order.id.slice(-5)}`}
                            >
                                <ArrowPathIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">Reorder</span>
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                 <div className="text-center py-4">
                    <DocumentTextIcon className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Your past completed orders will appear here for quick reordering.
                    </p>
                </div>
            )}
        </div>
    );
};

export default RecentOrders;