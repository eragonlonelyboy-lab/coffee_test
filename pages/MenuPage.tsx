import React, { useState } from 'react';
import { Drink } from '../types';
import { drinks as allDrinks } from '../data/mockData';
import DrinkCard from '../components/DrinkCard';
import CustomizationModal from '../components/CustomizationModal';
import { MagnifyingGlassIcon } from '../assets/icons';

const MenuPage: React.FC = () => {
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDrinks = allDrinks.filter(drink =>
    drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    drink.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(filteredDrinks.map(d => d.category)));

  const handleSelectDrink = (drink: Drink) => {
    if (drink.customizations && drink.customizations.length > 0) {
      setSelectedDrink(drink);
    } else {
      // If no customizations, maybe add directly to cart in future?
      // For now, we open modal even without customizations for quantity selection.
      setSelectedDrink(drink);
    }
  };

  const handleCloseModal = () => {
    setSelectedDrink(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Our Menu</h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          Crafted with care, just for you.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            name="search"
            id="search"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            placeholder="Search for a drink..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredDrinks.length > 0 ? (
        categories.map(category => {
          const drinksInCategory = filteredDrinks.filter(drink => drink.category === category);
          if (drinksInCategory.length === 0) return null; // Don't render category if no drinks match search

          return (
            <section key={category}>
              <h2 className="text-2xl font-semibold border-b-2 border-brand-200 dark:border-brand-800 pb-2 mb-6">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {drinksInCategory.map(drink => (
                    <DrinkCard key={drink.id} drink={drink} onSelect={() => handleSelectDrink(drink)} />
                  ))}
              </div>
            </section>
          );
        })
      ) : (
        <div className="text-center py-16">
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">No drinks found</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search.</p>
        </div>
      )}

      {selectedDrink && (
        <CustomizationModal
          drink={selectedDrink}
          isOpen={!!selectedDrink}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MenuPage;