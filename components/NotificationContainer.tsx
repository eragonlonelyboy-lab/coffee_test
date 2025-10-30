import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import ToastNotification from './ToastNotification';

const NotificationContainer: React.FC = () => {
  const { notifications } = useNotification();

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 w-full max-w-sm">
      {notifications.map(notification => (
        <ToastNotification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationContainer;
