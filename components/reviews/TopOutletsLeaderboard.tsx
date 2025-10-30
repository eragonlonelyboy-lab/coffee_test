import React from 'react';
import { outlets } from '../../data/mockData';
import { CoffeeCupIcon } from '../../assets/icons';
import { Link } from 'react-router-dom';

const TopOutletsLeaderboard: React.FC = () => {
    // Since outlets don't have ratings, we'll just feature them.
    const featuredOutlets = outlets.slice(0, 3);
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Featured Outlets</h2>
            <ul className="space-y-4">
                {featuredOutlets.map((outlet, index) => (
                    <li key={outlet.id} className="flex items-center gap-4">
                        <span className="font-bold text-lg text-gray-400 w-6">{index + 1}</span>
                        <img src={outlet.imageUrl} alt={outlet.name} className="w-12 h-12 rounded-md object-cover" />
                        <div className="flex-grow">
                            <Link to={`/locations/${outlet.id}`} className="font-semibold hover:underline">{outlet.name}</Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{outlet.address}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopOutletsLeaderboard;
