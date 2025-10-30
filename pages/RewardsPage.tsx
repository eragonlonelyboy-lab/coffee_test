import React, { useState } from 'react';
import { rewards, pointTransactions } from '../data/mockData';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Reward } from '../types';

import PointsSummary from '../components/rewards/PointsSummary';
import RewardCard from '../components/rewards/RewardCard';
import PointsHistory from '../components/rewards/PointsHistory';
import RedeemModal from '../components/rewards/RedeemModal';
import { useNotification } from '../contexts/NotificationContext';


const RewardsPage: React.FC = () => {
    const currentUser = useCurrentUser();
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const { addNotification } = useNotification();

    if (!currentUser) return <p>Loading...</p>;

    const userTransactions = pointTransactions.filter(t => t.userId === currentUser.id);

    const handleRedeem = (reward: Reward) => {
        if (currentUser.points >= reward.pointsRequired) {
            setSelectedReward(reward);
        } else {
            addNotification("You don't have enough points for this reward.", 'error');
        }
    };
    
    const confirmRedemption = () => {
        if (selectedReward) {
            // Here you would typically call an API to update user points.
            // For now, we just show a notification.
            addNotification(`Successfully redeemed "${selectedReward.title}"!`, 'success');
            setSelectedReward(null);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Rewards</h1>
                <p className="text-gray-500 dark:text-gray-400">Use your points to redeem exclusive rewards.</p>
            </div>
            
            <PointsSummary points={currentUser.points} />

            <div>
                <h2 className="text-2xl font-semibold mb-4">Available Rewards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rewards.map(reward => (
                       <RewardCard 
                            key={reward.id} 
                            reward={reward} 
                            userPoints={currentUser.points} 
                            onRedeem={handleRedeem}
                        />
                    ))}
                </div>
            </div>

            <PointsHistory transactions={userTransactions} />
            
            {selectedReward && (
                <RedeemModal 
                    isOpen={!!selectedReward}
                    onClose={() => setSelectedReward(null)}
                    onConfirm={confirmRedemption}
                    reward={selectedReward}
                />
            )}
        </div>
    );
};

export default RewardsPage;
