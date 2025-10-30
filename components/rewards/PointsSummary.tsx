import React from 'react';
import { GiftIcon } from '../../assets/icons';

interface PointsSummaryProps {
  points: number;
}

const PointsSummary: React.FC<PointsSummaryProps> = ({ points }) => {
  return (
    <div className="bg-brand-50 dark:bg-brand-900/20 p-6 rounded-lg flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Your Points Balance</h2>
        <p className="text-4xl font-bold text-brand-600 dark:text-brand-400">{points.toLocaleString()}</p>
      </div>
      <GiftIcon className="w-16 h-16 text-brand-300 dark:text-brand-700 opacity-50" />
    </div>
  );
};

export default PointsSummary;
