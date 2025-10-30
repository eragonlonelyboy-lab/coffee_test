import React from 'react';
import { Link } from 'react-router-dom';
import { User, UserTier } from '../../types';
import { ShieldCheckIcon } from '../../assets/icons';

interface TierStatusCardProps {
  user: User;
}

const tierData = {
  [UserTier.Bronze]: { next: UserTier.Silver, goal: 1000, color: 'text-yellow-600 dark:text-yellow-500' },
  [UserTier.Silver]: { next: UserTier.Gold, goal: 2000, color: 'text-gray-400' },
  [UserTier.Gold]: { next: UserTier.Platinum, goal: 5000, color: 'text-yellow-500 dark:text-yellow-400' },
  [UserTier.Platinum]: { next: UserTier.Elite, goal: 10000, color: 'text-blue-400' },
  [UserTier.Elite]: { next: null, goal: Infinity, color: 'text-purple-400' },
};

const TierStatusCard: React.FC<TierStatusCardProps> = ({ user }) => {
  const currentTierInfo = tierData[user.tier];
  const progress = currentTierInfo.goal !== Infinity ? (user.points / currentTierInfo.goal) * 100 : 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Loyalty Status</h2>
          <p className={`text-2xl font-bold ${currentTierInfo.color} flex items-center gap-2`}>
            <ShieldCheckIcon className="w-7 h-7" />
            <span>{user.tier} Tier</span>
          </p>
        </div>
        <Link to="/tier-status" className="text-sm font-semibold text-brand-600 hover:underline">
          View Benefits
        </Link>
      </div>
      
      <div className="mt-4">
        {currentTierInfo.next ? (
            <>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-brand-600 h-2.5 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <span>{user.points.toLocaleString()} pts</span>
                    <span>{currentTierInfo.goal.toLocaleString()} pts to {currentTierInfo.next}</span>
                </div>
            </>
        ) : (
            <p className="text-center font-semibold text-brand-500">You've reached the highest tier!</p>
        )}
      </div>

      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 grid grid-cols-2 gap-4">
        <div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Points Balance</h3>
            <p className="text-xl font-semibold">{user.points.toLocaleString()}</p>
        </div>
        <div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Wallet Balance</h3>
            <p className="text-xl font-semibold">${user.walletBalance.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default TierStatusCard;