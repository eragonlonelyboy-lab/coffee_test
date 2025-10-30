import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../App';
import { CoffeeCupIcon, UserIcon, SunIcon, MoonIcon } from '../assets/icons';

const Header: React.FC = () => {
    const { currentUser } = useAuth();
    const { cart } = useCart();
    const { theme, toggleTheme } = useTheme();

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `text-sm font-medium transition-colors ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`;

    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to={currentUser ? "/dashboard" : "/"} className="flex items-center gap-2 text-xl font-bold text-coffee-darker dark:text-white">
                        <CoffeeCupIcon className="h-6 w-6 text-brand-600 icon-vapour" />
                        LoyalBrew
                    </Link>
                    <nav className="hidden md:flex items-center space-x-8">
                        <NavLink to={currentUser ? "/dashboard" : "/"} end className={navLinkClasses}>Home</NavLink>
                        <NavLink to="/menu" className={navLinkClasses}>Menu</NavLink>
                        <NavLink to="/locations" className={navLinkClasses}>Locations</NavLink>
                        <NavLink to="/rewards" className={navLinkClasses}>Rewards</NavLink>
                    </nav>
                    <div className="flex items-center gap-4">
                         <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-offset-gray-900"
                        >
                            {theme === 'dark' ? (
                                <SunIcon className="h-6 w-6" />
                            ) : (
                                <MoonIcon className="h-6 w-6" />
                            )}
                        </button>
                        <Link to="/cart" aria-label="View shopping cart" className="relative p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            {cartItemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{cartItemCount}</span>
                            )}
                        </Link>
                        {currentUser ? (
                            <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                <UserIcon className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 p-0.5" />
                                <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="text-sm font-medium text-brand-600 hover:text-brand-700">Sign In</Link>
                                <Link to="/register" className="hidden sm:inline-block text-sm font-medium bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;