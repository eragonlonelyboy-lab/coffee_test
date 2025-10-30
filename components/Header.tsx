import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../App';
import { CoffeeCupIcon, UserIcon, SunIcon, MoonIcon, ShoppingCartIcon, Bars3Icon, XMarkIcon } from '../assets/icons';

const Header: React.FC = () => {
    const { currentUser } = useAuth();
    const { cart } = useCart();
    const { theme, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Close mobile menu on route change
        setIsMobileMenuOpen(false);
    }, [location]);
    
    useEffect(() => {
        // Prevent body scroll when mobile menu is open
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
             document.body.style.overflow = 'auto';
        }
    }, [isMobileMenuOpen]);

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `text-sm font-medium transition-colors ${isActive ? 'text-brand-500' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`;
    
    const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `block py-3 text-lg font-semibold transition-colors ${isActive ? 'text-brand-500' : 'text-gray-700 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400'}`;

    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const MobileMenu = () => (
        <div className={`fixed inset-0 z-50 md:hidden transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="relative w-full max-w-sm ml-auto h-full bg-white dark:bg-gray-900 shadow-xl flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="font-semibold">Menu</h2>
                    <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" className="p-2 -mr-2">
                        <XMarkIcon className="h-6 w-6"/>
                    </button>
                </div>
                <nav className="flex-grow p-6 space-y-4">
                    <NavLink to={currentUser ? "/dashboard" : "/"} end className={mobileNavLinkClasses}>Home</NavLink>
                    <NavLink to="/menu" className={mobileNavLinkClasses}>Menu</NavLink>
                    <NavLink to="/locations" className={mobileNavLinkClasses}>Locations</NavLink>
                    {currentUser && <NavLink to="/rewards" className={mobileNavLinkClasses}>Rewards</NavLink>}
                </nav>
                <div className="p-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                     {currentUser ? (
                            <Link to="/profile" className="flex items-center gap-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
                                <UserIcon className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 p-2" />
                                <span>{currentUser.name}</span>
                            </Link>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <Link to="/login" className="text-center font-semibold bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-md">Sign In</Link>
                                <Link to="/register" className="text-center font-semibold bg-brand-500 text-white px-4 py-3 rounded-md">Sign Up</Link>
                            </div>
                        )}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="w-full flex justify-between items-center p-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md"
                    >
                        <span className="font-semibold">Switch Theme</span>
                        {theme === 'dark' ? (
                            <SunIcon className="h-6 w-6 text-yellow-400" />
                        ) : (
                            <MoonIcon className="h-6 w-6 text-blue-500" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <header className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link to={currentUser ? "/dashboard" : "/"} className="flex items-center gap-2 text-xl font-bold text-coffee-darker dark:text-white">
                            <CoffeeCupIcon className="h-8 w-8 text-brand-500 icon-vapour" />
                            LoyalBrew
                        </Link>
                        <nav className="hidden md:flex items-center space-x-8">
                            <NavLink to={currentUser ? "/dashboard" : "/"} end className={navLinkClasses}>Home</NavLink>
                            <NavLink to="/menu" className={navLinkClasses}>Menu</NavLink>
                            <NavLink to="/locations" className={navLinkClasses}>Locations</NavLink>
                            {currentUser && <NavLink to="/rewards" className={navLinkClasses}>Rewards</NavLink>}
                        </nav>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                                className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-offset-gray-900"
                            >
                                {theme === 'dark' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                            </button>
                            <Link to="/cart" aria-label="View shopping cart" className="relative p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                <ShoppingCartIcon className="h-6 w-6" />
                                {cartItemCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{cartItemCount}</span>
                                )}
                            </Link>
                            <div className="hidden md:flex items-center">
                                {currentUser ? (
                                    <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                        <UserIcon className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 p-1" />
                                        <span className="font-semibold">{currentUser.name.split(' ')[0]}</span>
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link to="/login" className="text-sm font-medium text-brand-500 hover:text-brand-600">Sign In</Link>
                                        <Link to="/register" className="text-sm font-medium bg-brand-500 text-white px-4 py-2 rounded-md hover:bg-brand-600">Sign Up</Link>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu" className="md:hidden p-2 -mr-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                <Bars3Icon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <MobileMenu />
        </>
    );
};

export default Header;