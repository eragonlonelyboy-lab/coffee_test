import React, { useState } from 'react';
import { XMarkIcon } from '../../assets/icons';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopUp: (amount: number) => void;
}

const presetAmounts = [10, 20, 50, 100];

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, onTopUp }) => {
  const [amount, setAmount] = useState(20);
  const [customAmount, setCustomAmount] = useState('');

  if (!isOpen) return null;

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value && !isNaN(parseFloat(value))) {
        setAmount(parseFloat(value));
    } else {
        setAmount(0);
    }
  }

  const handleConfirm = () => {
    if (amount > 0) {
      onTopUp(amount);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Funds to Wallet</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Select an amount to add to your wallet.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {presetAmounts.map(preset => (
                     <button
                        key={preset}
                        onClick={() => handleAmountSelect(preset)}
                        className={`p-4 rounded-lg text-lg font-bold border-2 transition-colors ${
                            amount === preset && !customAmount ? 'bg-brand-600 border-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-700 border-gray-100 dark:border-gray-700 hover:border-brand-500'
                        }`}
                     >
                        ${preset}
                    </button>
                ))}
            </div>
            <div>
                 <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Or enter a custom amount</label>
                 <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                        type="number"
                        name="custom-amount"
                        id="custom-amount"
                        className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                        placeholder="0.00"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                    />
                 </div>
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
                disabled={amount <= 0}
                className="px-4 py-2 text-sm font-semibold rounded-md bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed"
            >
                Add ${amount.toFixed(2)}
            </button>
        </div>
      </div>
    </div>
  );
};

export default TopUpModal;