import React, { useState, useEffect } from 'react';
import { Outlet } from '../types';
import LocationCard from '../components/LocationCard';

const LocationsPage: React.FC = () => {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOutlets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/menu/stores/all');
        if (!response.ok) {
          throw new Error('Failed to fetch locations.');
        }
        const data = await response.json();
        // Augment backend data with generated imageUrl for frontend display
        const outletsWithImages = data.stores.map((store: Outlet) => ({
          ...store,
          imageUrl: `https://picsum.photos/seed/${store.name.split(' ').join('-')}/400/300`,
        }));
        setOutlets(outletsWithImages);
      } catch (err: any) {
        setError(err.message || 'Could not load locations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOutlets();
  }, []);
  
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
        <div className="p-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="mt-4 h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
    </div>
  );
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-xl font-semibold text-red-700 dark:text-red-300">Oops! Something went wrong.</p>
          <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>
        </div>
      );
    }
    
    return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {outlets.map(outlet => (
          <LocationCard key={outlet.id} outlet={outlet} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Our Locations</h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          Find a LoyalBrew near you.
        </p>
      </div>
      {renderContent()}
    </div>
  );
};

export default LocationsPage;