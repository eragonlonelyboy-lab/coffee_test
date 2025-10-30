import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ReviewCard from './ReviewCard';

interface UserReviewHistoryProps {
    userId: string;
}

const UserReviewHistory: React.FC<UserReviewHistoryProps> = ({ userId }) => {
    const { reviews } = useAuth();
    const userReviews = reviews.filter(r => r.userId === userId);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Your Reviews</h2>
            {userReviews.length > 0 ? (
                 <div className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700">
                    {userReviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">You haven't written any reviews yet.</p>
            )}
        </div>
    );
};

export default UserReviewHistory;
