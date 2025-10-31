import React from 'react';
import { PointTransaction } from '../../types';
import { ArrowPathIcon } from '../../assets/icons';

interface PointsHistoryProps {
  transactions: PointTransaction[];
}

const PointsHistory: React.FC<PointsHistoryProps> = ({ transactions }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Points History</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.length > 0 ? (
            transactions.slice(0, 10).map(t => ( // Show top 10 most recent
              <li key={t.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{t.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(t.date).toLocaleDateString()}
                  </p>
                </div>
                <p className={`font-semibold text-lg ${t.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {t.points > 0 ? '+' : ''}{t.points.toLocaleString()}
                </p>
              </li>
            ))
          ) : (
             <li className="p-8 text-center text-gray-500 dark:text-gray-400">
                <ArrowPathIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                No transactions yet. Start ordering to earn points!
             </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PointsHistory;
