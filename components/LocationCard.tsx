import React from 'react';
import { Link } from 'react-router-dom';
import { Outlet } from '../types';
import { ArrowRightIcon } from '../assets/icons';

interface LocationCardProps {
  outlet: Outlet;
}

const LocationCard: React.FC<LocationCardProps> = ({ outlet }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
      <img
        src={outlet.imageUrl}
        alt={outlet.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold">{outlet.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{outlet.address}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Hours: {outlet.hours}</p>
        <div className="mt-auto pt-4">
          <Link
            to={`/locations/${outlet.id}`}
            className="text-brand-600 dark:text-brand-400 font-semibold text-sm hover:underline flex items-center gap-1"
          >
            <span>View Details</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
