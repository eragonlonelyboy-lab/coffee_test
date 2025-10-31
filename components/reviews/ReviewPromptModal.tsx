import React, { useState } from 'react';
import { Order } from '../../types';
import StarRatingInput from './StarRatingInput';
import { XMarkIcon } from '../../assets/icons';

interface ReviewPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: Order, rating: number, comment: string) => void;
  order: Order;
}

const ReviewPromptModal: React.FC<ReviewPromptModalProps> = ({ isOpen, onClose, onSubmit, order }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit(order, rating, comment);
    }
  };

  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Leave a Review</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6">
                <p className="mb-4">
                    How was your experience for order <span className="font-semibold">#{order.id.slice(-5)}</span> at <span className="font-semibold">{order.store?.name}</span>?
                </p>
                <div className="flex justify-center mb-4">
                     <StarRatingInput rating={rating} setRating={setRating} />
                </div>
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Add a comment (optional)
                    </label>
                    <textarea
                        id="comment"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                        placeholder="What did you like or dislike?"
                    />
                </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                 <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-semibold rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={rating === 0}
                    className="px-4 py-2 text-sm font-semibold rounded-md bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed"
                >
                    Submit Review
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewPromptModal;