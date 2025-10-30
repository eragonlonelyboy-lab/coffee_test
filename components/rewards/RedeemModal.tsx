import React from 'react';
import { Reward } from '../../types';
import { XMarkIcon, GiftIcon } from '../../assets/icons';

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reward: Reward;
}

const RedeemModal: React.FC<RedeemModalProps> = ({ isOpen, onClose, onConfirm, reward }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm m-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Confirm Redemption</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 text-center">
            <GiftIcon className="w-16 h-16 mx-auto text-brand-500 mb-4" />
            <p className="mb-2">
                Are you sure you want to redeem <span className="font-bold">{reward.title}</span>?
            </p>
            <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-4">
                {reward.pointsRequired.toLocaleString()} points
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                This amount will be deducted from your points balance.
            </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-semibold rounded-md bg-brand-600 text-white hover:bg-brand-700"
            >
                Confirm
            </button>
        </div>
      </div>
    </div>
  );
};

export default RedeemModal;
