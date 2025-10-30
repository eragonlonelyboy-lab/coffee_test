import React from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import UserReviewHistory from '../components/reviews/UserReviewHistory';
import TopOutletsLeaderboard from '../components/reviews/TopOutletsLeaderboard';

const ReviewsPage: React.FC = () => {
    const currentUser = useCurrentUser();
    
    return (
        <div className="space-y-12">
             <div>
                <h1 className="text-3xl font-bold">Reviews & Ratings</h1>
                <p className="text-gray-500 dark:text-gray-400">See what's popular and manage your own reviews.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                     {currentUser && <UserReviewHistory userId={currentUser.id} />}
                </div>
                <div className="space-y-8">
                    <TopOutletsLeaderboard />
                </div>
            </div>
        </div>
    );
};

export default ReviewsPage;