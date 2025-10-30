import React from 'react';
import { User, UserTier } from '../../types';
import { ShieldCheckIcon, StarIcon } from '../../assets/icons';
import { tierPointMultipliers } from '../../utils/tierUtils';

interface CurrentTierCardProps {
    user: User;
}

export const tierDetails = {
  [UserTier.Bronze]: { color: 'bg-yellow-600', benefits: [`${tierPointMultipliers[UserTier.Bronze]}x Points per $1`, 'Member-only offers'] },
  [UserTier.Silver]: { color: 'bg-gray-400', benefits: [`${tierPointMultipliers[UserTier.Silver]}x Points per $1`, 'Free Birthday Drink'] },
  [UserTier.Gold]: { color: 'bg-yellow-500', benefits: [`${tierPointMultipliers[UserTier.Gold]}x Points per $1`, 'Free monthly pastry'] },
  [UserTier.Platinum]: { color: 'bg-blue-400', benefits: [`${tierPointMultipliers[UserTier.Platinum]}x Points per $1`, 'Early access to new items'] },
  [UserTier.Elite]: { color: 'bg-purple-500', benefits: [`${tierPointMultipliers[UserTier.Elite]}x Points per $1`, 'Exclusive events'] },
};

const tierData = {
  [UserTier.Bronze]: { next: UserTier.Silver, goal: 1000 },
  [UserTier.Silver]: { next: UserTier.Gold, goal: 2000 },
  [UserTier.Gold]: { next: UserTier.Platinum, goal: 5000 },
  [UserTier.Platinum]: { next: UserTier.Elite, goal: 10000 },
  [UserTier.Elite]: { next: null, goal: Infinity },
};


const CurrentTierCard: React.FC<CurrentTierCardProps> = ({ user }) => {
    const currentTier = tierDetails[user.tier];
    const tierProgress = tierData[user.tier];
    const progressPercentage = tierProgress.goal !== Infinity ? (user.points / tierProgress.goal) * 100 : 100;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className={`p-6 text-white ${currentTier.color}`}>
                <div className="flex items-center gap-4">
                    <ShieldCheckIcon className="w-12 h-12" />
                    <div>
                        <p className="text-sm font-medium opacity-80">YOUR CURRENT TIER</p>
                        <h2 className="text-3xl font-bold">{user.tier}</h2>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <h3 className="font-semibold mb-3">Your Progress</h3>
                 {tierProgress.next ? (
                    <>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div className={`h-3 rounded-full ${currentTier.color}`} style={{ width: `${Math.min(progressPercentage, 100)}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                            You're <span className="font-bold">{(tierProgress.goal - user.points).toLocaleString()}</span> points away from {tierProgress.next} tier.
                        </p>
                    </>
                 ) : (
                    <p className="text-center font-medium text-purple-500">You're at the top! Thank you for your loyalty.</p>
                 )}

                 <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                     <h3 className="font-semibold mb-3">Your {user.tier} Benefits</h3>
                     <ul className="space-y-2">
                        {currentTier.benefits.map(benefit => (
                            <li key={benefit} className="flex items-center gap-2 text-sm">
                                <StarIcon className="w-5 h-5 text-yellow-400" solid/>
                                <span>{benefit}</span>
                            </li>
                        ))}
                     </ul>
                 </div>
            </div>
        </div>
    );
};

export default CurrentTierCard;
