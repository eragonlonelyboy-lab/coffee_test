import React, { useState } from 'react';
import { rewards } from '../data/mockData';
import { Reward } from '../types';

import PointsSummary from '../components/rewards/PointsSummary';
import RewardCard from '../components/rewards/RewardCard';
import PointsHistory from '../components/rewards/PointsHistory';
import RedeemModal from '../components/rewards/RedeemModal';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';


const RewardsPage: React.FC = () => {
    const { currentUser, updateProfile, pointTransactions, addPointTransaction, addVoucher } = useAuth();
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const { addNotification } = useNotification();

    if (!currentUser) return <p>Loading...</p>;

    const handleRedeem = (reward: Reward) => {
        if (currentUser.points >= reward.pointsRequired) {
            setSelectedReward(reward);
        } else {
            addNotification("You don't have enough points for this reward.", 'error');
        }
    };
    
    const confirmRedemption = () => {
        if (selectedReward && currentUser) {
            // 1. Deduct points
            const newPoints = currentUser.points - selectedReward.pointsRequired;
            updateProfile({ points: newPoints });

            // 2. Log transaction locally for immediate UI update
            addPointTransaction({
                description: `Redeemed: ${selectedReward.title}`,
                points: -selectedReward.pointsRequired,
            });

            // 3. Create a voucher
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30); // Voucher expires in 30 days
            addVoucher({
                title: selectedReward.title,
                description: selectedReward.description,
                expiryDate: expiryDate.toISOString(),
                discountType: selectedReward.discountType,
                discountValue: selectedReward.discountValue,
            });

            addNotification(`Successfully redeemed "${selectedReward.title}"! Check your vouchers.`, 'success');
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

            <PointsHistory transactions={pointTransactions} />
            
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
