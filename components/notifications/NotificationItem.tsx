import React from 'react';
import { BackendNotification } from '../../types';
import { GiftIcon, DocumentTextIcon, SparklesIcon } from '../../assets/icons';

interface NotificationItemProps {
    notification: BackendNotification;
}

// A helper function to parse payload and format time
const parseNotification = (notification: BackendNotification) => {
    let title = 'New Notification';
    let body = notification.payload;
    const iconMap: Record<string, React.FC<any>> = {
        ORDER: DocumentTextIcon,
        PROMOTION: GiftIcon,
        GENERAL: SparklesIcon,
        EMAIL: SparklesIcon, // Fallback icon
    };

    try {
        const payload = JSON.parse(notification.payload);
        title = payload.title || title;
        body = payload.body || body;
    } catch (e) {
        // Payload is not JSON, use it as is
        body = notification.payload;
        if(notification.type === 'ORDER') title = 'Order Update';
        if(notification.type === 'PROMOTION') title = 'New Promotion';
    }

    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        if (seconds < 5) return 'just now';
        let interval = seconds / 31536000;
        if (interval > 1) return `${Math.floor(interval)} years ago`;
        interval = seconds / 2592000;
        if (interval > 1) return `${Math.floor(interval)} months ago`;
        interval = seconds / 86400;
        if (interval > 1) return `${Math.floor(interval)} days ago`;
        interval = seconds / 3600;
        if (interval > 1) return `${Math.floor(interval)} hours ago`;
        interval = seconds / 60;
        if (interval > 1) return `${Math.floor(interval)} minutes ago`;
        return `${Math.floor(seconds)} seconds ago`;
    };
    
    const Icon = iconMap[notification.type.toUpperCase()] || SparklesIcon;

    return { title, body, Icon, time: timeAgo(notification.createdAt) };
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
    const { title, body, Icon, time } = parseNotification(notification);

    return (
        <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex-shrink-0 bg-brand-100 dark:bg-brand-900/50 p-3 rounded-full">
                <Icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="flex-grow">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{body}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{time}</p>
            </div>
        </div>
    );
};

export default NotificationItem;
