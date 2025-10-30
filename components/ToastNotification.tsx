import React, { useEffect, useState } from 'react';
import { Notification } from '../types';
import { useNotification } from '../contexts/NotificationContext';
import { XMarkIcon, CheckIcon } from '../assets/icons';

interface ToastNotificationProps {
  notification: Notification;
}

const toastStyles = {
  success: {
    bg: 'bg-green-100 dark:bg-green-900',
    border: 'border-green-500',
    iconColor: 'text-green-500',
    textColor: 'text-green-800 dark:text-green-200'
  },
  error: {
    bg: 'bg-red-100 dark:bg-red-900',
    border: 'border-red-500',
    iconColor: 'text-red-500',
    textColor: 'text-red-800 dark:text-red-200'
  },
  info: {
    bg: 'bg-blue-100 dark:bg-blue-900',
    border: 'border-blue-500',
    iconColor: 'text-blue-500',
    textColor: 'text-blue-800 dark:text-blue-200'
  },
  warning: {
    bg: 'bg-yellow-100 dark:bg-yellow-900',
    border: 'border-yellow-500',
    iconColor: 'text-yellow-500',
    textColor: 'text-yellow-800 dark:text-yellow-200'
  },
};

const ToastNotification: React.FC<ToastNotificationProps> = ({ notification }) => {
  const { removeNotification } = useNotification();
  const [exiting, setExiting] = useState(false);
  const styles = toastStyles[notification.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => removeNotification(notification.id), 300); // Wait for exit animation
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification, removeNotification]);
  
  const handleClose = () => {
    setExiting(true);
    setTimeout(() => removeNotification(notification.id), 300);
  };

  return (
    <div
      className={`
        w-full p-4 rounded-lg shadow-lg flex items-start gap-3 border-l-4
        ${styles.bg} ${styles.border}
        transition-all duration-300 ease-in-out
        ${exiting ? 'opacity-0 transform translate-x-full' : 'opacity-100 transform translate-x-0'}
      `}
    >
      <div className={`flex-shrink-0 ${styles.iconColor}`}>
        <CheckIcon className="w-6 h-6" />
      </div>
      <div className={`flex-grow text-sm font-medium ${styles.textColor}`}>
        {notification.message}
      </div>
      <button onClick={handleClose} className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-200">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ToastNotification;