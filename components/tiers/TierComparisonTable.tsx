import React from 'react';
import { UserTier } from '../../types';
import { CheckIcon, XMarkIcon } from '../../assets/icons';
import { tierPointMultipliers } from '../../utils/tierUtils';

const tiers = [
  { name: UserTier.Bronze, points: 0, color: 'text-yellow-600 dark:text-yellow-500' },
  { name: UserTier.Silver, points: 1000, color: 'text-gray-400' },
  { name: UserTier.Gold, points: 2000, color: 'text-yellow-500 dark:text-yellow-400' },
  { name: UserTier.Platinum, points: 5000, color: 'text-blue-400' },
  { name: UserTier.Elite, points: 10000, color: 'text-purple-400' },
];

const benefits = [
    { name: 'Base Point Earning', tiers: [
        // FIX: Used enum members to correctly access properties on tierPointMultipliers.
        `${tierPointMultipliers[UserTier.Bronze]}x`,
        `${tierPointMultipliers[UserTier.Silver]}x`,
        `${tierPointMultipliers[UserTier.Gold]}x`,
        `${tierPointMultipliers[UserTier.Platinum]}x`,
        `${tierPointMultipliers[UserTier.Elite]}x`,
    ] },
    { name: 'Member-Only Offers', tiers: [true, true, true, true, true] },
    { name: 'Free Birthday Drink', tiers: [false, true, true, true, true] },
    { name: 'Free Monthly Pastry', tiers: [false, false, true, true, true] },
    { name: 'Early Access to New Items', tiers: [false, false, false, true, true] },
    { name: 'Exclusive Event Invites', tiers: [false, false, false, false, true] },
];

const TierComparisonTable: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Tier Benefits at a Glance</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="py-3 px-4 font-semibold">Benefit</th>
                            {tiers.map(tier => (
                                <th key={tier.name} className={`py-3 px-4 font-bold text-center ${tier.color}`}>
                                    {tier.name}
                                    <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">
                                        {tier.points > 0 ? `${tier.points.toLocaleString()}+ pts` : 'Base Tier'}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {benefits.map(benefit => (
                            <tr key={benefit.name} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                <td className="py-3 px-4 font-medium">{benefit.name}</td>
                                {benefit.tiers.map((value, index) => (
                                    <td key={index} className="py-3 px-4 text-center">
                                        {typeof value === 'boolean' ? (
                                            value ? <CheckIcon className="w-6 h-6 text-green-500 mx-auto" /> : <XMarkIcon className="w-6 h-6 text-red-500 mx-auto opacity-50" />
                                        ) : (
                                            <span className="font-semibold">{value}</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TierComparisonTable;