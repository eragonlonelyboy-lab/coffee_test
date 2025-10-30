import React from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import QRCode from '../components/referrals/QRCode';
import { useNotification } from '../contexts/NotificationContext';

const ReferralsPage: React.FC = () => {
    const currentUser = useCurrentUser();
    const { addNotification } = useNotification();

    if (!currentUser) return <p>Loading...</p>;
    
    // Generate a mock referral link
    const referralLink = `https://loyalbrew.example.com/join?ref=${currentUser.id}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink);
        addNotification('Referral link copied to clipboard!', 'success');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 text-center">
            <div>
                <h1 className="text-3xl font-bold">Refer a Friend</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">
                    Share your love for LoyalBrew and earn points! When your friend signs up and makes their first purchase, you both get 200 bonus points.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h2 className="text-xl font-semibold mb-4">Your Unique Referral Link</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                        type="text"
                        readOnly
                        value={referralLink}
                        className="flex-grow bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-center sm:text-left"
                    />
                    <button 
                        onClick={handleCopyLink}
                        className="bg-brand-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-brand-700 transition-colors"
                    >
                        Copy Link
                    </button>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex flex-col items-center">
                 <h2 className="text-xl font-semibold mb-4">Or Scan QR Code</h2>
                 <QRCode value={referralLink} size={200} />
            </div>
        </div>
    );
};

export default ReferralsPage;
