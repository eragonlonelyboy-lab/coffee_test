import React, { useState, useEffect } from 'react';
import { StarIcon, TrophyIcon } from '../../assets/icons';
import { Link } from 'react-router-dom';

interface TopOutlet {
    storeId: string;
    storeName: string;
    averageRating: number;
    reviewCount: number;
}

const TopOutletsLeaderboard: React.FC = () => {
    const [topOutlets, setTopOutlets] = useState<TopOutlet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setIsLoading(true);
            try {
                // NOTE: This API endpoint is hypothetical as it's not defined in the backend files.
                // It would perform an aggregation to calculate top stores.
                const response = await fetch('/api/reviews/leaderboard/stores?limit=5');
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard data.');
                }
                const data = await response.json();
                setTopOutlets(data.leaderboard || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 py-2">
                        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="flex-grow h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-red-500">
                <p>{error}</p>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrophyIcon className="w-6 h-6 text-yellow-400" />
                Top Rated Outlets
            </h2>
            {topOutlets.length > 0 ? (
                <ul className="space-y-4">
                    {topOutlets.map((outlet, index) => (
                        <li key={outlet.storeId} className="flex items-center gap-4">
                            <span className="font-bold text-lg text-gray-400 dark:text-gray-500 w-6">{index + 1}</span>
                            <div className="flex-grow">
                                <Link to={`/locations/${outlet.storeId}`} className="font-semibold hover:underline">
                                    {outlet.storeName}
                                </Link>
                                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                    <StarIcon className="w-4 h-4 text-yellow-400" solid />
                                    <span>{outlet.averageRating.toFixed(1)}</span>
                                    <span className="text-xs">({outlet.reviewCount} reviews)</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 dark:text-gray-400">Not enough review data to create a leaderboard yet.</p>
            )}
        </div>
    );
};

export default TopOutletsLeaderboard;
