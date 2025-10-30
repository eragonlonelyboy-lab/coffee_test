import React from 'react';
import { Link } from 'react-router-dom';
import { drinks } from '../data/mockData';
import DrinkCard from '../components/DrinkCard';
import { CoffeeCupIcon, GiftIcon, SparklesIcon } from '../assets/icons';

const HomePage: React.FC = () => {
  const featuredDrinks = drinks.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center bg-gradient-to-b from-brand-50 to-white dark:from-brand-950/50 dark:to-gray-950 py-12 sm:py-16 px-4 rounded-lg">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-coffee-darker dark:text-white mb-4">
          Brewing Loyalty, One Cup at a Time.
        </h1>
        <p className="text-md md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Join LoyalBrew to enjoy exclusive rewards, seamless ordering, and a world of delicious coffee. Your loyalty means everything to us.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/register"
            className="bg-brand-500 text-white font-semibold px-8 py-3 rounded-md hover:bg-brand-600 transition-transform hover:scale-105"
          >
            Join Now
          </Link>
          <Link
            to="/menu"
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold px-8 py-3 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            View Menu
          </Link>
        </div>
      </section>

      {/* Featured Drinks Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Our Fan Favorites</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDrinks.map(drink => (
            <DrinkCard key={drink.id} drink={drink} onSelect={(drink, quantity) => {
                // To fully implement this, HomePage would need to manage the CustomizationModal
                // For now, this is a no-op to satisfy the type change. A user could be navigated to the menu.
            }} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 px-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-10">Why You'll Love LoyalBrew</h2>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-brand-100 dark:bg-brand-900/50 p-5 rounded-full mb-4">
                <CoffeeCupIcon className="w-10 h-10 text-brand-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Order Ahead</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Skip the queue! Order your favorite drinks and snacks from anywhere and pick them up when you're ready.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-brand-100 dark:bg-brand-900/50 p-5 rounded-full mb-4">
                <GiftIcon className="w-10 h-10 text-brand-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Earn Rewards</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Collect points with every purchase and redeem them for free drinks, food, and exclusive merchandise.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-brand-100 dark:bg-brand-900/50 p-5 rounded-full mb-4">
                <SparklesIcon className="w-10 h-10 text-brand-500" />
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