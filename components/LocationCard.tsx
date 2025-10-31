import React from 'react';
import { Link } from 'react-router-dom';
import { Outlet } from '../types';
import { ArrowRightIcon } from '../assets/icons';

interface LocationCardProps {
  outlet: Outlet;
}

const LocationCard: React.FC<LocationCardProps> = ({ outlet }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group">
      <div className="relative">
        <img src={outlet.imageUrl} alt={outlet.name} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-xl font-bold text-white">{outlet.name}</h3>
          <p className="text-sm text-gray-200">{outlet.city}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{outlet.address}</p>
        <Link
          to={`/locations/${outlet.id}`}
          className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700"
        >
          View Details <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default LocationCard;
