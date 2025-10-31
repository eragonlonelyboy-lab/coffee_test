import React, { useState, useEffect } from 'react';
import { StarIcon } from '../assets/icons';
import { PopularItemReportRow, Drink } from '../types';
import { useAuth } from '../contexts/AuthContext';

const TopDrinksLeaderboard: React.FC = () => {
    const [topDrinks, setTopDrinks] = useState<PopularItemReportRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();
    
    // We need a full menu list to enrich the report data with names/images
    const [menu, setMenu] = useState<Drink[]>([]);
    useEffect(() => {
        const fetchFullMenu = async () => {
            try {
                const res = await fetch('/api/menu');
                const data = await res.json();
                const menuItems: Drink[] = data.items.map((item: any) => ({
                  id: item.id, name: item.name, description: item.description, price: item.basePrice, category: item.category,
                  imageUrls: [item.imageUrl || `https://picsum.photos/seed/${item.id}/100/100`],
                  rating: 4.5, reviewCount: 50 // Dummy data
                }));
                setMenu(menuItems);
            } catch (e) {
                // Non-critical, leaderboard will just show IDs
                console.error("Failed to fetch menu for enrichment");
            }
        };
        fetchFullMenu();
    }, []);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!token) return;
            setIsLoading(true);
            try {
                const response = await fetch('/api/reports/popular-items');
                if (!response.ok) throw new Error('Failed to fetch popular items.');
                const data = await response.json();
                setTopDrinks(data.items || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeaderboard();
    }, [token]);
    
    const enrichedData = topDrinks.map(item => {
        const menuItem = menu.find(d => d.id === item.menuItemId);
        return {
            ...item,
            itemName: menuItem?.name || 'Unknown Item',
            itemImage: menuItem?.imageUrls[0] || 'https://picsum.photos/seed/default/100/100'
        }
    });

    const renderContent = () => {
        if (isLoading) return <p>Loading leaderboard...</p>;
        if (error) return <p className="text-red-500">{error}</p>;
        if (enrichedData.length === 0) return <p className="text-gray-500 dark:text-gray-400">No sales data available yet.</p>;

        return (
             <ul className="space-y-4">
                {enrichedData.map((drink, index) => (
                    <li key={drink.menuItemId} className="flex items-center gap-4">
                        <span className="font-bold text-lg text-gray-400 dark:text-gray-500 w-6">{index + 1}</span>
                        <img src={drink.itemImage} alt={drink.itemName} className="w-12 h-12 rounded-md object-cover" />
                        <div className="flex-grow">
                            <p className="font-semibold">{drink.itemName}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-bold">{drink._sum.quantity?.toLocaleString() || 0}</span> sold
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Most Popular Drinks</h2>
            {renderContent()}
        </div>
    );
};

export default TopDrinksLeaderboard;
