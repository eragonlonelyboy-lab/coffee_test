import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon } from '../assets/icons';

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

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <UserIcon className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-full p-4 mb-4" />
                <h2 className="text-2xl font-semibold">{currentUser.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">{currentUser.email}</p>

                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4 text-left">
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

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                     <button
                        // onClick={() => { /* TODO: Implement Edit Profile */ }}
                        className="w-full sm:w-auto bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold px-6 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-not-allowed opacity-50"
                        disabled
                    >
                        Edit Profile
                    </button>
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
