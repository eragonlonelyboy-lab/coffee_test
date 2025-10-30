import React from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import TierStatusCard from '../components/dashboard/TierStatusCard';
import QuickActions from '../components/dashboard/QuickActions';
import PromotionsCarousel from '../components/dashboard/PromotionsCarousel';
import MissionsWidget from '../components/dashboard/MissionsWidget';
import RecentOrders from '../components/dashboard/RecentOrders';

const DashboardPage: React.FC = () => {
  const currentUser = useCurrentUser();

  if (!currentUser) {
    return <div>Loading...</div>; // Or a redirect
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
        <p className="text-gray-500 dark:text-gray-400">Here's your loyalty summary at a glance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <TierStatusCard user={currentUser} />
          <QuickActions />
          <PromotionsCarousel />
        </div>
        <div className="space-y-8">
          <MissionsWidget />
          <RecentOrders />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;