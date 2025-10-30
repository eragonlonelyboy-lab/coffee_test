import React, { useState, useMemo } from 'react';
import { Drink } from '../types';
import { drinks as allDrinks } from '../data/mockData';
import DrinkCard from '../components/DrinkCard';
import CustomizationModal from '../components/CustomizationModal';
import { MagnifyingGlassIcon } from '../assets/icons';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';

const MenuPage: React.FC = () => {
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalQuantity, setModalQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addNotification } = useNotification();

  const allCategories = useMemo(() => ['All', ...Array.from(new Set(allDrinks.map(d => d.category)))], []);
  const [selectedCategory, setSelectedCategory] = useState(allCategories[0]);

  const filteredDrinks = useMemo(() => {
    return allDrinks.filter(drink => {
      const matchesCategory = selectedCategory === 'All' || drink.category === selectedCategory;
      const matchesSearch = drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            drink.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleSelectDrink = (drink: Drink, quantity: number) => {
    if (drink.customizations && drink.customizations.length > 0) {
        setModalQuantity(quantity);
        setSelectedDrink(drink);
    } else {
        addToCart(drink, quantity, {});
        addNotification(`${quantity}x ${drink.name} added to cart!`, 'success');
    }
  };

  const handleCloseModal = () => {
    setSelectedDrink(null);
  };

  const CategoryFilters = () => (
    <>
      {allCategories.map(category => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
            selectedCategory === category
              ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {category}
        </button>
      ))}
    </>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:block md:w-1/4 lg:w-1/5">
        <div className="sticky top-24">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <ul className="space-y-2">
            <CategoryFilters />
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        
        {/* Horizontal Filters for Mobile */}
        <div className="md:hidden mb-4">
           <h2 className="text-lg font-semibold mb-3">Categories</h2>
           <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4">
             <CategoryFilters />
           </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              name="search"
              id="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              placeholder="Search for a drink..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredDrinks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDrinks.map(drink => (
              <DrinkCard key={drink.id} drink={drink} onSelect={handleSelectDrink} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">No drinks found</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or category.</p>
          </div>
        )}
      </div>

      {selectedDrink && (
        <CustomizationModal
          drink={selectedDrink}
          isOpen={!!selectedDrink}
          onClose={handleCloseModal}
          initialQuantity={modalQuantity}
        />
      )}
    </div>
  );
};

export default MenuPage;