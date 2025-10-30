import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, StarIcon, ArrowPathIcon } from '../assets/icons';
import { tierDetails } from '../components/tiers/CurrentTierCard';
import { pointTransactions } from '../data/mockData';

const ProfilePage: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!currentUser) {
        return <p>Loading profile...</p>;
    }
    
    const currentTierBenefits = tierDetails[currentUser.tier].benefits;
    const userTransactions = pointTransactions
        .filter(t => t.userId === currentUser.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5); // Get the 5 most recent transactions

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <UserIcon className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-full p-4 mb-4" />
                <h2 className="text-2xl font-semibold">{currentUser.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">{currentUser.email}</p>

                <div className="my-6 bg-brand-50 dark:bg-brand-900/20 p-4 rounded-lg text-left">
                    <h3 className="font-semibold mb-3 text-center text-gray-700 dark:text-gray-200">Your {currentUser.tier} Tier Benefits</h3>
                    <ul className="space-y-2">
                        {currentTierBenefits.map(benefit => (
                            <li key={benefit} className="flex items-center gap-3">
                                <StarIcon className="w-5 h-5 text-yellow-400 flex-shrink-0" solid/>
                                <span className="text-sm">{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4 text-left">
                    <div className="flex justify-between">
                        <span className="font-semibold">Loyalty Tier:</span>
                        <span className="text-brand-600 dark:text-brand-400 font-bold">{currentUser.tier}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Points Balance:</span>
                        <span>{currentUser.points.toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="font-semibold">Wallet Balance:</span>
                        <span>${currentUser.walletBalance.toFixed(2)}</span>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-left mb-4">Recent Points History</h3>
                    {userTransactions.length > 0 ? (
                        <ul className="space-y-3 text-left">
                            {userTransactions.map(t => (
                                <li key={t.id} className="flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-medium">{t.description}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                    <p className={`font-semibold ${t.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {t.points > 0 ? '+' : ''}{t.points.toLocaleString()} pts
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                             <ArrowPathIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p>No recent point transactions.</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                     <button
                        // onClick={() => { /* TODO: Implement Edit Profile */ }}
                        className="w-full sm:w-auto bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold px-6 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-not-allowed opacity-50"
                        disabled
                    >
                        Edit Profile
                    </button>
                    <Link
                        to="/referrals"
                        className="w-full sm:w-auto text-center bg-brand-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-brand-700 transition-colors"
                    >
                        Refer a Friend
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full sm:w-auto bg-red-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;