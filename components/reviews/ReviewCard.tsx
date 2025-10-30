import React from 'react';
import { Review } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { StarIcon, PencilIcon, TrashIcon, UserIcon } from '../../assets/icons';

interface ReviewCardProps {
    review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    const { currentUser, deleteReview } = useAuth();
    const isOwner = currentUser?.id === review.userId;

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            deleteReview(review.id);
        }
    };

    return (
        <div className="pt-4">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-grow">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{review.userName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Reviewed: <span className="font-medium text-gray-600 dark:text-gray-300">{review.drinkName}</span>
                            </p>
                        </div>
                         {isOwner && (
                            <div className="flex gap-2">
                                <button className="p-1 text-gray-400 hover:text-blue-500" disabled>
                                    <PencilIcon className="w-5 h-5" />
                                </button>
                                <button onClick={handleDelete} className="p-1 text-gray-400 hover:text-red-500">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                         )}
                    </div>
                    <div className="flex items-center gap-1 my-2">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} solid/>
                        ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{new Date(review.date).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
