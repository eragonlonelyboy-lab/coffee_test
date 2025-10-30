import React from 'react';
import { Drink } from '../types';
import { StarIcon } from '../assets/icons';

interface DrinkCardProps {
  drink: Drink;
  onSelect?: (drink: Drink) => void;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ drink, onSelect }) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(drink);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col group transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <div className="relative">
        <img
          src={drink.imageUrls[0]}
          alt={drink.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <StarIcon className="w-4 h-4 text-yellow-400" solid />
          <span>{drink.rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">
            {drink.name}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex-grow">
          {drink.description}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xl font-bold text-coffee-darker dark:text-white">
            ${drink.price.toFixed(2)}
          </p>
          {onSelect && (
             <button
                onClick={handleSelect}
                className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-700 transition-colors"
             >
                Add
             </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrinkCard;
