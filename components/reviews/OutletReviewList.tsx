import React from 'react';
import { Review } from '../../types';
import ReviewCard from './ReviewCard';

interface OutletReviewListProps {
    reviews: Review[];
}

const OutletReviewList: React.FC<OutletReviewListProps> = ({ reviews }) => {
    if (reviews.length === 0) {
        return <p className="text-gray-500 dark:text-gray-400 text-center py-8">No reviews yet for this outlet.</p>;
    }
    return (
        <div className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700">
            {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
    );
};

export default OutletReviewList;