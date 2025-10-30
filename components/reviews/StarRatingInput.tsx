import React, { useState } from 'react';
import { StarIcon } from '../../assets/icons';

interface StarRatingInputProps {
  rating: number;
  setRating: (rating: number) => void;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`Set rating to ${star} star${star > 1 ? 's' : ''}`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="p-1"
        >
          <StarIcon
            className={`w-8 h-8 transition-colors ${
              (hoverRating || rating) >= star
                ? 'text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRatingInput;