import React from 'react';
import { Link } from 'react-router-dom';
import { orders } from '../../data/mockData';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { DocumentTextIcon } from '../../assets/icons';

const RecentOrders: React.FC = () => {
    const currentUser = useCurrentUser();
    const recentOrders = orders
        .filter(o => o.userId === currentUser?.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Orders</h2>
                <Link to="/orders" className="text-sm font-semibold text-brand-600 hover:underline">
                    View All
                </Link>
            </div>
             {recentOrders.length > 0 ? (
                <ul className="space-y-3">
                    {recentOrders.map(order => (
                        <li key={order.id} className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-medium">Order #{order.id.slice(-5)}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                            </div>
                             <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                             }`}>
                                {order.status}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                 <div className="text-center py-4">
                    <DocumentTextIcon className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">You haven't placed any orders yet.</p>
                </div>
            )}
        </div>
    );
};

export default RecentOrders;
