import React from 'react';
import { Link } from 'react-router-dom';
import { CoffeeCupIcon, FacebookIcon, TwitterIcon, InstagramIcon } from '../assets/icons';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="sm:col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-coffee-darker dark:text-white mb-4">
                            <CoffeeCupIcon className="h-8 w-8 text-brand-500" />
                            LoyalBrew
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Brewing Loyalty, One Cup at a Time.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="#" className="text-gray-500 dark:text-gray-400 hover:text-brand-500">About Us</Link></li>
                            <li><Link to="/menu" className="text-gray-500 dark:text-gray-400 hover:text-brand-500">Menu</Link></li>
                            <li><Link to="/locations" className="text-gray-500 dark:text-gray-400 hover:text-brand-500">Locations</Link></li>
                            <li><Link to="/reviews" className="text-gray-500 dark:text-gray-400 hover:text-brand-500">Reviews</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Account</h3>
                         <ul className="space-y-2 text-sm">
                            <li><Link to="/profile" className="text-gray-500 dark:text-gray-400 hover:text-brand-500">My Profile</Link></li>
                            <li><Link to="/orders" className="text-gray-500 dark:text-gray-400 hover:text-brand-500">My Orders</Link></li>
                            <li><Link to="/rewards" className="text-gray-500 dark:text-gray-400 hover:text-brand-500">Rewards</Link></li>
                            <li><Link to="/referrals" className="text-gray-500 dark:text-gray-400 hover:text-brand-500">Refer a Friend</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
                        <div className="flex items-center gap-4">
                            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-brand-500"><FacebookIcon className="h-6 w-6" /></a>
                            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-brand-500"><TwitterIcon className="h-6 w-6" /></a>
                            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-brand-500"><InstagramIcon className="h-6 w-6" /></a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>&copy; {new Date().getFullYear()} LoyalBrew. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;