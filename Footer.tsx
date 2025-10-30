import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>&copy; {new Date().getFullYear()} LoyalBrew. All Rights Reserved.</p>
                    <nav className="flex justify-center gap-4 mt-2" aria-label="Footer navigation">
                        <Link to="/menu" className="hover:underline">Menu</Link>
                        <Link to="/locations" className="hover:underline">Locations</Link>
                        <Link to="/reviews" className="hover:underline">Reviews</Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;