import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TopUpModal from '../components/wallet/TopUpModal';
import WithdrawModal from '../components/wallet/WithdrawModal';
import { useNotification } from '../contexts/NotificationContext';

const WalletPage: React.FC = () => {
    const { currentUser, updateProfile, addWalletTransaction, walletTransactions } = useAuth();
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const { addNotification } = useNotification();
    
    if (!currentUser) return <p>Loading...</p>;

    const userTransactions = walletTransactions
        .filter(t => t.userId === currentUser.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
    const handleTopUp = (amount: number) => {
        const newBalance = currentUser.walletBalance + amount;
        updateProfile({ walletBalance: newBalance });
        addWalletTransaction({
            description: 'Wallet Top-Up',
            amount: amount,
        });
        addNotification(`$${amount.toFixed(2)} successfully added to your wallet!`, 'success');
        setIsTopUpModalOpen(false);
    };

    const handleWithdraw = (amount: number) => {
        if (amount > currentUser.walletBalance) {
            addNotification('Withdrawal amount exceeds your current balance.', 'error');
            return;
        }
        const newBalance = currentUser.walletBalance - amount;
        updateProfile({ walletBalance: newBalance });
        addWalletTransaction({
            description: 'Wallet Withdrawal',
            amount: -amount,
        });
        addNotification(`$${amount.toFixed(2)} successfully withdrawn from your wallet!`, 'success');
        setIsWithdrawModalOpen(false);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">My Wallet</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your balance and view your transaction history.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Balance</h2>
                    <p className="text-4xl font-bold">${currentUser.walletBalance.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                    <button
                        onClick={() => setIsWithdrawModalOpen(true)}
                        className="w-full sm:w-auto bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold px-6 py-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Withdraw
                    </button>
                    <button
                        onClick={() => setIsTopUpModalOpen(true)}
                        className="w-full sm:w-auto bg-brand-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-brand-700 transition-colors"
                    >
                        Top-Up
                    </button>
                </div>
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
                isOpen={isTopUpModalOpen}
                onClose={() => setIsTopUpModalOpen(false)}
                onTopUp={handleTopUp}
            />
            <WithdrawModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                onWithdraw={handleWithdraw}
                currentBalance={currentUser.walletBalance}
            />
        </div>
    );
};

export default WalletPage;