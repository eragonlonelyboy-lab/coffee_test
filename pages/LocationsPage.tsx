import React from 'react';
import { outlets } from '../data/mockData';
import LocationCard from '../components/LocationCard';

const LocationsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Our Locations</h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          Find a LoyalBrew near you.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {outlets.map(outlet => (
          <LocationCard key={outlet.id} outlet={outlet} />
        ))}
      </div>
    </div>
  );
};

export default LocationsPage;