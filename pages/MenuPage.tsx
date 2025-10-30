import React, { useState } from 'react';
import { Drink } from '../types';
import { drinks as allDrinks } from '../data/mockData';
import DrinkCard from '../components/DrinkCard';
import CustomizationModal from '../components/CustomizationModal';

const MenuPage: React.FC = () => {
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);

  const categories = Array.from(new Set(allDrinks.map(d => d.category)));

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

      {categories.map(category => (
        <section key={category}>
          <h2 className="text-2xl font-semibold border-b-2 border-brand-200 dark:border-brand-800 pb-2 mb-6">
            {category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allDrinks
              .filter(drink => drink.category === category)
              .map(drink => (
                <DrinkCard key={drink.id} drink={drink} onSelect={() => handleSelectDrink(drink)} />
              ))}
          </div>
        </section>
      ))}

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
