import React from 'react';
import { outlets } from '../../data/mockData';
import { Link } from 'react-router-dom';

const TopOutletsLeaderboard: React.FC = () => {
    // Since outlets don't have ratings in the mock data, we'll just feature some of our locations.
    const featuredOutlets = outlets.slice(0, 3);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Featured Locations</h2>
            <ul className="space-y-4">
                {featuredOutlets.map((outlet) => (
                    <li key={outlet.id}>
                        <Link to={`/locations/${outlet.id}`} className="flex items-center gap-4 group transition-opacity hover:opacity-80">
                            <img src={outlet.imageUrl} alt={outlet.name} className="w-12 h-12 rounded-md object-cover" />
                            <div className="flex-grow">
                                <p className="font-semibold group-hover:text-brand-500">{outlet.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{outlet.address}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopOutletsLeaderboard;
