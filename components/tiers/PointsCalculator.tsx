import React, { useState } from 'react';
import { User } from '../../types';
import { calculatePoints, tierPointMultipliers } from '../../utils/tierUtils';
import { SparklesIcon } from '../../assets/icons';

interface PointsCalculatorProps {
    user: User;
}

const PointsCalculator: React.FC<PointsCalculatorProps> = ({ user }) => {
    const [spendAmount, setSpendAmount] = useState<string>('10.00');

    const handleSpendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allow empty string or valid number format (up to 2 decimal places)
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
             setSpendAmount(value);
        }
    };

    const numericSpend = parseFloat(spendAmount) || 0;
    const earnedPoints = calculatePoints(numericSpend, user.tier);
    const multiplier = tierPointMultipliers[user.tier];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Points Earning Calculator</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                <div className="flex items-center gap-2">
                    <label htmlFor="spend-amount" className="font-medium">If I spend</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input
                            id="spend-amount"
                            type="number"
                            value={spendAmount}
                            onChange={handleSpendChange}
                            className="w-32 pl-7 py-2 text-center font-bold text-lg border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-brand-500 focus:border-brand-500"
                            placeholder="0.00"
                            step="0.01"
                            aria-label="Spend amount"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-medium">I will earn</span>
                    <div className="relative flex items-center gap-2 bg-brand-50 dark:bg-brand-900/20 px-4 py-3 rounded-md">
                        <SparklesIcon className="w-6 h-6 text-brand-500" />
                        <span className="font-bold text-2xl text-brand-600 dark:text-brand-400">{earnedPoints.toLocaleString()}</span>
                        <span className="font-medium">points</span>
                    </div>
                </div>
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                As a <span className="font-semibold">{user.tier}</span> member, you earn points at a <span className="font-semibold">{multiplier}x</span> rate.
            </p>
        </div>
    );
};

export default PointsCalculator;
