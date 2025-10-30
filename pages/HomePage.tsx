import React from 'react';
import { Link } from 'react-router-dom';
import { drinks } from '../data/mockData';
import DrinkCard from '../components/DrinkCard';
import { CoffeeCupIcon, GiftIcon, SparklesIcon } from '../assets/icons';

const HomePage: React.FC = () => {
  const featuredDrinks = drinks.slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center bg-brand-50 dark:bg-brand-900/20 p-8 rounded-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-coffee-darker dark:text-white mb-4">
          Brewing Loyalty, One Cup at a Time.
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
          Join LoyalBrew to enjoy exclusive rewards, seamless ordering, and a world of delicious coffee. Your loyalty means everything to us.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-brand-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-brand-700 transition-colors"
          >
            Join Now
          </Link>
          <Link
            to="/menu"
            className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold px-6 py-3 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            View Menu
          </Link>
        </div>
      </section>

      {/* Featured Drinks Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-6">Our Fan Favorites</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDrinks.map(drink => (
            <DrinkCard key={drink.id} drink={drink} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold text-center mb-8">Why You'll Love LoyalBrew</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-brand-100 dark:bg-brand-900/50 p-4 rounded-full mb-4">
                <CoffeeCupIcon className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Order Ahead</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Skip the queue! Order your favorite drinks and snacks from anywhere and pick them up when you're ready.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-brand-100 dark:bg-brand-900/50 p-4 rounded-full mb-4">
                <GiftIcon className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Earn Rewards</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Collect points with every purchase and redeem them for free drinks, food, and exclusive merchandise.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-brand-100 dark:bg-brand-900/50 p-4 rounded-full mb-4">
                <SparklesIcon className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Exclusive Perks</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Unlock new tiers to get birthday treats, special offers, and early access to new menu items.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
