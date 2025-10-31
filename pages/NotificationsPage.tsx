import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BackendNotification } from '../types';
import NotificationItem from '../components/notifications/NotificationItem';
import { BellIcon } from '../assets/icons';

const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<BackendNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!token) return;
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/notifications/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch notifications.');
                }
                const data = await response.json();
                setNotifications(data.notifications || []);
            } catch (err) {
                setError('Could not load notifications at this time.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, [token]);
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm animate-pulse">
                            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <div className="flex-grow space-y-2">
                                <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
        
        if (error) {
            return <div className="text-center py-10 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg">{error}</div>;
        }

        if (notifications.length === 0) {
            return (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg">
                    <BellIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
                    <h2 className="mt-4 text-xl font-semibold">No Notifications Yet</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Important updates and alerts will appear here.</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {notifications.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} />
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Notifications</h1>
            {renderContent()}
        </div>
    );
};

export default NotificationsPage;
