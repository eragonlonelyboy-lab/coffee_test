import React from 'react';
import { Reward } from '../../types';

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  onRedeem: (reward: Reward) => void;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward, userPoints, onRedeem }) => {
  const canAfford = userPoints >= reward.pointsRequired;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
      <img src={reward.imageUrl} alt={reward.title} className="w-full h-40 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold">{reward.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex-grow">{reward.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
            {reward.pointsRequired.toLocaleString()} pts
          </p>
          <button
            onClick={() => onRedeem(reward)}
            disabled={!canAfford}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              canAfford
                ? 'bg-brand-600 text-white hover:bg-brand-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Redeem
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;
