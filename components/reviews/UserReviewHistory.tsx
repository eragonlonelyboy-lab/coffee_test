import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Review } from '../../types';
import ReviewCard from './ReviewCard';
import { useNotification } from '../../contexts/NotificationContext';

interface UserReviewHistoryProps {
    userId: string;
}

const UserReviewHistory: React.FC<UserReviewHistoryProps> = ({ userId }) => {
    const { token } = useAuth();
    const { addNotification } = useNotification();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!token) return;
            setIsLoading(true);
            try {
                const response = await fetch('/api/reviews/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch your reviews.');
                }
                const data = await response.json();
                
                // The backend returns user name nested, so we adapt it for the ReviewCard
                const adaptedReviews = data.reviews.map((r: Review) => ({
                    ...r,
                    userName: r.user?.name || 'You', // Backend doesn't return user name for this query
                    storeName: r.store?.name || 'Unknown Store'
                }));
                
                setReviews(adaptedReviews);
            } catch (err) {
                setError("Could not load your reviews at this time.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, [token]);

    const handleDeleteReview = async (reviewId: string) => {
        if (!token) {
            addNotification('You must be logged in to delete reviews.', 'error');
            return;
        };
        try {
            const response = await fetch(`/api/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete review.');
            }
            setReviews(prev => prev.filter(r => r.id !== reviewId));
            addNotification('Review successfully deleted.', 'success');
        } catch(err: any) {
            addNotification(err.message, 'error');
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <p className="text-center py-8">Loading your reviews...</p>;
        }
        if (error) {
            return <p className="text-center py-8 text-red-500">{error}</p>;
        }
        if (reviews.length > 0) {
            return (
                <div className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700">
                    {reviews.map(review => (
                        <ReviewCard key={review.id} review={review} onDelete={handleDeleteReview} />
                    ))}
                </div>
            );
        }
        return <p className="text-gray-500 dark:text-gray-400 text-center py-8">You haven't written any reviews yet.</p>;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Your Reviews</h2>
            {renderContent()}
        </div>
    );
};

export default UserReviewHistory;
