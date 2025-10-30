import React, { useState } from 'react';
import { XMarkIcon } from '../../assets/icons';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: number) => void;
  currentBalance: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, onWithdraw, currentBalance }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    const numericValue = parseFloat(value);
    if (value && (isNaN(numericValue) || numericValue <= 0)) {
        setError('Please enter a valid amount.');
    } else if (numericValue > currentBalance) {
        setError('Withdrawal amount cannot exceed your balance.');
    } else {
        setError('');
    }
  }

  const handleConfirm = () => {
    const numericAmount = parseFloat(amount);
    if (numericAmount > 0 && numericAmount <= currentBalance) {
      onWithdraw(numericAmount);
      setAmount('');
      setError('');
    } else {
        if (numericAmount > currentBalance) {
            setError('Withdrawal amount cannot exceed your balance.');
        } else {
            setError('Please enter a valid amount.');
        }
    }
  };
  
  const numericAmount = parseFloat(amount) || 0;
  const isButtonDisabled = numericAmount <= 0 || numericAmount > currentBalance || !!error;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Withdraw Funds</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Enter the amount you wish to withdraw.</p>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-300">Available balance: <span className="font-semibold">${currentBalance.toFixed(2)}</span></p>
            
            <div>
                 <label htmlFor="withdraw-amount" className="sr-only">Withdrawal Amount</label>
                 <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                        type="number"
                        name="withdraw-amount"
                        id="withdraw-amount"
                        className={`focus:ring-brand-500 focus:border-brand-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 ${error ? 'border-red-500' : ''}`}
                        placeholder="0.00"
                        value={amount}
                        onChange={handleAmountChange}
                        aria-describedby="withdraw-error"
                    />
                 </div>
                 {error && <p id="withdraw-error" className="mt-2 text-sm text-red-500">{error}</p>}
            </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
                Cancel
            </button>
            <button
                onClick={handleConfirm}
                disabled={isButtonDisabled}
                className="px-4 py-2 text-sm font-semibold rounded-md bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed"
            >
                Withdraw ${numericAmount > 0 ? numericAmount.toFixed(2) : '0.00'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;