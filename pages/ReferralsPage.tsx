import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import QRCode from '../components/referrals/QRCode';
import { useNotification } from '../contexts/NotificationContext';

const ReferralsPage: React.FC = () => {
    const { token } = useAuth();
    const { addNotification } = useNotification();
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generateCode = async () => {
            if (!token) {
                setError("You must be logged in to generate a referral code.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/referrals/generate', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error('Failed to generate referral code.');
                }

                const data = await response.json();
                setReferralCode(data.referral.code);
            } catch (err) {
                setError("Could not generate a referral code. Please try again later.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        generateCode();
    }, [token]);
    
    const referralLink = referralCode ? `https://loyalbrew.example.com/join?ref=${referralCode}` : '';

    const handleCopyLink = () => {
        if (referralLink) {
            navigator.clipboard.writeText(referralLink);
            addNotification('Referral link copied to clipboard!', 'success');
        }
    };

    const Content = () => {
        if (isLoading) {
            return (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 animate-pulse">
                    <div className="h-6 w-3/4 mx-auto bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            );
        }
        if (error || !referralCode) {
            return <p className="text-red-500 text-center">{error || 'Something went wrong.'}</p>
        }

        return (
            <>
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
            </>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 text-center">
            <div>
                <h1 className="text-3xl font-bold">Refer a Friend</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">
                    Share your love for LoyalBrew and earn points! When your friend signs up and makes their first purchase, you both get 200 bonus points.
                </p>
            </div>

            <Content />
        </div>
    );
};

export default ReferralsPage;