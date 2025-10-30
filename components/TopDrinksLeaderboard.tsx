import React from 'react';
import { drinks } from '../data/mockData';
import { StarIcon } from '../assets/icons';

const TopDrinksLeaderboard: React.FC = () => {
    const topDrinks = [...drinks].sort((a, b) => b.rating - a.rating).slice(0, 5);
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Top Rated Drinks</h2>
            <ul className="space-y-4">
                {topDrinks.map((drink, index) => (
                    <li key={drink.id} className="flex items-center gap-4">
                        <span className="font-bold text-lg text-gray-400 w-6">{index + 1}</span>
                        <img src={drink.imageUrls[0]} alt={drink.name} className="w-12 h-12 rounded-md object-cover" />
                        <div className="flex-grow">
                            <p className="font-semibold">{drink.name}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <StarIcon className="w-4 h-4 text-yellow-400" solid />
                                <span>{drink.rating.toFixed(1)}</span>
                                <span className="text-xs">({drink.reviewCount} reviews)</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopDrinksLeaderboard;
