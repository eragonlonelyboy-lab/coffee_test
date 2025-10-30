import React, { useState } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { walletTransactions } from '../data/mockData';
import TopUpModal from '../components/wallet/TopUpModal';
import { useNotification } from '../contexts/NotificationContext';

const WalletPage: React.FC = () => {
    const currentUser = useCurrentUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addNotification } = useNotification();
    
    // This state would normally be managed in a context or fetched, 
    // but for this demo, we'll manage it locally on this page.
    const [balance, setBalance] = useState(currentUser?.walletBalance || 0);

    if (!currentUser) return <p>Loading...</p>;

    const userTransactions = walletTransactions
        .filter(t => t.userId === currentUser.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
    const handleTopUp = (amount: number) => {
        setBalance(prev => prev + amount);
        addNotification(`$${amount.toFixed(2)} successfully added to your wallet!`, 'success');
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">My Wallet</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your balance and view your transaction history.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex justify-between items-center">
                <div>
                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Balance</h2>
                    <p className="text-4xl font-bold">${balance.toFixed(2)}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-brand-700 transition-colors"
                >
                    Top-Up Wallet
                </button>
            </div>
            
             <div>
                <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {userTransactions.map(t => (
                        <li key={t.id} className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-medium">{t.description}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(t.date).toLocaleDateString()}
                                </p>
                            </div>
                            <p className={`font-semibold text-lg ${t.amount > 0 ? 'text-green-500' : 'text-gray-800 dark:text-gray-200'}`}>
                                {t.amount > 0 ? `+$${t.amount.toFixed(2)}` : `-$${Math.abs(t.amount).toFixed(2)}`}
                            </p>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>

            <TopUpModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTopUp={handleTopUp}
            />
        </div>
    );
};

export default WalletPage;
