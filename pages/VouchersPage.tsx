import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GiftIcon } from '../assets/icons';
import { Voucher } from '../types';

const VouchersPage: React.FC = () => {
    const { currentUser, vouchers } = useAuth();
    const userVouchers = vouchers.filter(v => v.userId === currentUser?.id);

    const availableVouchers = userVouchers.filter(v => !v.used);
    const usedVouchers = userVouchers.filter(v => v.used);

    const VoucherCard: React.FC<{ voucher: Voucher }> = ({ voucher }) => {
        
        const discountText = voucher.discountType === 'PERCENTAGE' 
            ? `${voucher.discountValue}% OFF`
            : `$${voucher.discountValue.toFixed(2)} OFF`;

        return (
            <div className={`p-6 rounded-lg shadow-md relative overflow-hidden flex flex-col justify-between ${
                voucher.used ? 'bg-gray-100 dark:bg-gray-800 opacity-60' : 'bg-gradient-to-br from-brand-50 to-yellow-50 dark:from-brand-900/50 dark:to-yellow-900/30'
            }`}>
                <GiftIcon className="absolute -right-4 -top-4 w-24 h-24 text-brand-100 dark:text-brand-900 opacity-50" />
                <div className="relative">
                    <h3 className="text-xl font-bold text-brand-800 dark:text-brand-200">{voucher.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{voucher.description}</p>
                </div>
                 <div className="relative mt-4">
                    <div className="bg-white/60 dark:bg-gray-900/30 inline-block px-3 py-1 rounded-full font-bold text-2xl text-brand-600 dark:text-brand-300">
                        {discountText}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        {voucher.used ? 'Used' : `Expires: ${new Date(voucher.expiryDate).toLocaleDateString()}`}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">My Vouchers</h1>
                <p className="text-gray-500 dark:text-gray-400">Your collection of special offers and discounts.</p>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Available</h2>
                {availableVouchers.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {availableVouchers.map(v => <VoucherCard key={v.id} voucher={v} />)}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-6 rounded-lg">You have no available vouchers right now.</p>
                )}
            </div>

             <div>
                <h2 className="text-2xl font-semibold mb-4">Used / Expired</h2>
                {usedVouchers.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {usedVouchers.map(v => <VoucherCard key={v.id} voucher={v} />)}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-6 rounded-lg">No past vouchers to show.</p>
                )}
            </div>
        </div>
    );
};

export default VouchersPage;