import React, { useState } from 'react';
import { Drink } from '../types';
import { StarIcon, PlusIcon, MinusIcon } from '../assets/icons';

interface DrinkCardProps {
  drink: Drink;
  onSelect?: (drink: Drink, quantity: number) => void;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ drink, onSelect }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    setQuantity(q => Math.max(1, q + delta));
  };
  
  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(drink, quantity);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative">
        <img
          src={drink.imageUrls[0]}
          alt={drink.name}
          className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        {onSelect && (
           <div 
            className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => e.stopPropagation()}
           >
            <div className="flex items-center gap-3 transition-transform duration-300 transform scale-90 group-hover:scale-100">
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg">
                <button onClick={(e) => handleQuantityChange(e, -1)} className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-full">
                  <MinusIcon className="w-5 h-5"/>
                </button>
                <span className="w-10 text-center font-bold text-lg text-gray-800 dark:text-gray-100">{quantity}</span>
                <button onClick={(e) => handleQuantityChange(e, 1)} className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full">
                  <PlusIcon className="w-5 h-5"/>
                </button>
              </div>
              <button
                onClick={handleAddClick}
                aria-label={`Add ${quantity} of ${drink.name} to cart`}
                className="bg-brand-500 text-white font-semibold px-5 py-2.5 rounded-full shadow-lg hover:bg-brand-600"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold truncate group-hover:text-brand-500 dark:group-hover:text-brand-400">
            {drink.name}
        </h3>
        <div className="mt-1 flex-grow">
          {/* The 'group' class here scopes the hover effect for the tooltip to just this description area */}
          <div className="relative group">
            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
              {drink.description}
            </p>
            {/* This tooltip becomes visible when the parent 'group' is hovered */}
            <div
              className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 w-max max-w-xs transform -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-normal text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-gray-700"
              role="tooltip"
            >
              {drink.description}
            </div>
          </div>
        </div>
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