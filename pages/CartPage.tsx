import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { MinusIcon, PlusIcon, TrashIcon, ShoppingCartIcon } from '../assets/icons';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { orders as mockOrders } from '../data/mockData';
import { Order, OrderStatus } from '../types';
import { calculatePoints } from '../utils/tierUtils';

const CartPage: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const { currentUser, updateProfile, addWalletTransaction, addPointTransaction, vouchers, useVoucher } = useAuth();
    const [selectedVoucherId, setSelectedVoucherId] = useState<string>('');

    const availableVouchers = useMemo(() => {
        if (!currentUser) return [];
        return vouchers.filter(v => 
            v.userId === currentUser.id && 
            !v.used && 
            new Date(v.expiryDate) > new Date()
        );
    }, [vouchers, currentUser]);

    const { discount, finalTotal } = useMemo(() => {
        const selectedVoucher = availableVouchers.find(v => v.id === selectedVoucherId);
        let calculatedDiscount = 0;
        if (selectedVoucher) {
            if (selectedVoucher.discountType === 'PERCENTAGE') {
                calculatedDiscount = cartTotal * (selectedVoucher.discountValue / 100);
            } else { // FIXED_AMOUNT
                calculatedDiscount = selectedVoucher.discountValue;
            }
        }
        // Ensure discount doesn't exceed total
        calculatedDiscount = Math.min(calculatedDiscount, cartTotal);
        const calculatedFinalTotal = cartTotal - calculatedDiscount;
        return { discount: calculatedDiscount, finalTotal: calculatedFinalTotal };
    }, [selectedVoucherId, cartTotal, availableVouchers]);

    const createOrder = (): Order | null => {
        if (!currentUser) {
            addNotification("You must be logged in to place an order.", "error");
            navigate('/login');
            return null;
        }
        const newOrderId = `ord-${Date.now()}`;
        
        // Award points on the final amount paid
        const pointsEarned = calculatePoints(finalTotal, currentUser.tier);
        updateProfile({ points: currentUser.points + pointsEarned });
        addPointTransaction({
            description: `Order #${newOrderId.slice(-5)}`,
            points: pointsEarned,
        });

        // Use selected voucher
        if (selectedVoucherId) {
            useVoucher(selectedVoucherId);
        }

        return {
            id: newOrderId,
            userId: currentUser.id,
            outletId: 'o-1', // Mock outlet for simplicity
            date: new Date().toISOString(),
            items: cart.map(cartItem => ({
                id: `oi-${cartItem.id}-${Math.random()}`,
                drink: cartItem.drink,
                quantity: cartItem.quantity,
                unitPrice: cartItem.unitPrice,
                customizations: cartItem.customizations,
            })),
            total: finalTotal,
            status: OrderStatus.InProgress,
            preparationTime: Math.floor(Math.random() * 10) + 5,
        };
    };

    const handleWalletCheckout = () => {
        if (!currentUser) return;

        if (currentUser.walletBalance >= finalTotal) {
            const newOrder = createOrder();
            if (!newOrder) return;

            mockOrders.unshift(newOrder);

            const newBalance = currentUser.walletBalance - finalTotal;
            updateProfile({ walletBalance: newBalance });

            addWalletTransaction({
                description: `Payment for Order #${newOrder.id.slice(-5)}`,
                amount: -finalTotal,
            });

            addNotification('Paid successfully with your wallet!', 'success');
            clearCart();
            navigate(`/order-confirmation/${newOrder.id}`);
        } else {
            addNotification('Insufficient wallet balance for the final amount.', 'error');
        }
    };

    const handleCheckout = () => {
        const newOrder = createOrder();
        if (!newOrder) return;

        mockOrders.unshift(newOrder);
        addNotification('Order placed successfully!', 'success');
        clearCart();
        navigate(`/order-confirmation/${newOrder.id}`);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            {cart.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-800/50 rounded-lg">
                    <ShoppingCartIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
                    <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/menu" className="mt-6 inline-block bg-brand-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-brand-600 transition-colors">
                        Browse Menu
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
                    <div className="lg:col-span-2 space-y-4 pb-32 lg:pb-0">
                       {cart.map(item => (
                           <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                               <img src={item.drink.imageUrls[0]} alt={item.drink.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover"/>
                               <div className="flex-grow">
                                   <h3 className="font-semibold text-lg">{item.drink.name}</h3>
                                   <p className="text-sm text-gray-500 dark:text-gray-400">${item.unitPrice.toFixed(2)} each</p>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600 text-sm mt-2 flex items-center gap-1">
                                        <TrashIcon className="w-4 h-4" /> Remove
                                    </button>
                               </div>
                               <div className="flex items-center gap-1 sm:gap-2">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"><MinusIcon className="w-5 h-5"/></button>
                                    <span className="w-8 text-center font-semibold text-lg">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"><PlusIcon className="w-5 h-5"/></button>
                               </div>
                               <div className="w-20 sm:w-24 text-right font-semibold text-lg">
                                   ${(item.unitPrice * item.quantity).toFixed(2)}
                               </div>
                           </div>
                       ))}
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-700 p-4 lg:static lg:bg-gray-50 dark:lg:bg-gray-800 lg:border lg:rounded-lg lg:shadow-md lg:p-6 lg:sticky lg:top-24">
                        <div className="space-y-4 max-w-7xl mx-auto lg:max-w-none">
                            <h2 className="text-xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-4">Order Summary</h2>
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            
                            {/* Voucher Selection */}
                            <div className="space-y-2">
                                <label htmlFor="voucher" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Apply Voucher</label>
                                <select 
                                    id="voucher" 
                                    value={selectedVoucherId}
                                    onChange={(e) => setSelectedVoucherId(e.target.value)}
                                    className="block w-full text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-brand-500 focus:border-brand-500"
                                    disabled={availableVouchers.length === 0}
                                >
                                    <option value="">{availableVouchers.length > 0 ? 'Select a voucher' : 'No available vouchers'}</option>
                                    {availableVouchers.map(v => (
                                        <option key={v.id} value={v.id}>
                                            {v.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                             {discount > 0 && (
                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                    <span>Discount</span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between font-bold text-lg border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
                                <span>Total</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>
                            
                            <div className="space-y-2">
                                <button 
                                    onClick={handleWalletCheckout}
                                    disabled={!currentUser}
                                    className="w-full bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    Pay with Wallet (${currentUser?.walletBalance.toFixed(2)})
                                </button>
                                <button 
                                    onClick={handleCheckout}
                                    className="w-full bg-brand-500 text-white font-semibold py-3 rounded-md hover:bg-brand-600 transition-colors"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;