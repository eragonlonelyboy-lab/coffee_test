import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { MinusIcon, PlusIcon, TrashIcon, ShoppingCartIcon } from '../assets/icons';
import { useNotification } from '../contexts/NotificationContext';

const CartPage: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const handleCheckout = () => {
        // In a real app, this would create an order and redirect to a payment page.
        // Here, we'll simulate order creation and redirect to a confirmation page.
        const newOrderId = `ord-${Date.now()}`;
        addNotification('Order placed successfully!', 'success');
        clearCart();
        navigate(`/order-confirmation/${newOrderId}`);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
            {cart.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg">
                    <ShoppingCartIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
                    <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/menu" className="mt-6 inline-block bg-brand-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-brand-700 transition-colors">
                        Browse Menu
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
                       {cart.map(item => (
                           <div key={item.id} className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                               <img src={item.drink.imageUrls[0]} alt={item.drink.name} className="w-20 h-20 rounded-md object-cover"/>
                               <div className="flex-grow">
                                   <h3 className="font-semibold">{item.drink.name}</h3>
                                   <p className="text-sm text-gray-500 dark:text-gray-400">${item.unitPrice.toFixed(2)} each</p>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-sm mt-1 flex items-center gap-1">
                                        <TrashIcon className="w-4 h-4" /> Remove
                                    </button>
                               </div>
                               <div className="flex items-center gap-2">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"><MinusIcon className="w-5 h-5"/></button>
                                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"><PlusIcon className="w-5 h-5"/></button>
                               </div>
                               <div className="w-20 text-right font-semibold">
                                   ${(item.unitPrice * item.quantity).toFixed(2)}
                               </div>
                           </div>
                       ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4 sticky top-24">
                            <h2 className="text-xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-3">Order Summary</h2>
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Taxes & Fees</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-3">
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <button 
                                onClick={handleCheckout}
                                className="w-full bg-brand-600 text-white font-semibold py-3 rounded-md hover:bg-brand-700 transition-colors"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
