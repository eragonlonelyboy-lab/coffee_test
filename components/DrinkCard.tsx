import React from 'react';
import { Drink } from '../types';
import { StarIcon, PlusIcon } from '../assets/icons';

interface DrinkCardProps {
  drink: Drink;
  onSelect?: (drink: Drink) => void;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ drink, onSelect }) => {
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(drink);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      onClick={handleSelect}
    >
      <div className="relative">
        <img
          src={drink.imageUrls[0]}
          alt={drink.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {onSelect && (
            <button
                onClick={handleSelect}
                aria-label={`Add ${drink.name} to cart`}
                className="absolute bottom-3 right-3 bg-brand-500 text-white rounded-full p-2 shadow-lg transition-transform duration-300 hover:scale-110 hover:bg-brand-600"
            >
                <PlusIcon className="w-5 h-5"/>
            </button>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold truncate group-hover:text-brand-500 dark:group-hover:text-brand-400">
            {drink.name}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex-grow line-clamp-2">
          {drink.description}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xl font-bold text-coffee-darker dark:text-white">
            ${drink.price.toFixed(2)}
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <StarIcon className="w-5 h-5 text-yellow-400" solid />
            <span className="font-semibold">{drink.rating.toFixed(1)}</span>
            <span>({drink.reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrinkCard;