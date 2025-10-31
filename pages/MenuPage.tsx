import React, { useState, useMemo, useEffect } from 'react';
import { Drink } from '../types';
import DrinkCard from '../components/DrinkCard';
import CustomizationModal from '../components/CustomizationModal';
import { MagnifyingGlassIcon } from '../assets/icons';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';

const MenuPage: React.FC = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalQuantity, setModalQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addNotification } = useNotification();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/menu?lang=${language}`);
        if (!response.ok) {
          throw new Error('Failed to fetch menu items.');
        }
        const data = await response.json();
        
        // Adapt backend data to frontend Drink type
        const menuItems: Drink[] = data.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.basePrice, // Corrected from `price` to `basePrice` to match schema
          category: item.category,
          // Augment with data needed for UI but not present in backend
          imageUrls: [`https://picsum.photos/seed/${item.id}/400/300`], // Use ID for consistent image
          customizations: [], // Backend doesn't provide this yet
          rating: 4.5 + (item.id.charCodeAt(0) % 5) / 10, // Generate plausible, consistent rating
          reviewCount: Math.floor(item.basePrice * 20) + 10, // Generate plausible, consistent review count
        }));
        setDrinks(menuItems);
      } catch (err: any) {
        setError(err.message || 'Could not load the menu. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, [language]); // Re-fetch when language changes

  const allCategories = useMemo(() => {
    if (drinks.length === 0) return ['All'];
    return ['All', ...Array.from(new Set(drinks.map(d => d.category)))];
  }, [drinks]);

  const [selectedCategory, setSelectedCategory] = useState(allCategories[0]);
  
  useEffect(() => {
    setSelectedCategory('All');
  }, [allCategories]);

  const filteredDrinks = useMemo(() => {
    return drinks.filter(drink => {
      const matchesCategory = selectedCategory === 'All' || drink.category === selectedCategory;
      const matchesSearch = drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (drink.description && drink.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, drinks]);

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
  
  const DrinkCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
        <div className="p-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="mt-4 flex justify-between items-center">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
        </div>
    </div>
  );
  
  const renderContent = () => {
      if (isLoading) {
          return (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => <DrinkCardSkeleton key={i} />)}
              </div>
          );
      }

      if (error) {
          return (
              <div className="text-center py-16 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-xl font-semibold text-red-700 dark:text-red-300">Oops! Something went wrong.</p>
                  <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>
              </div>
          );
      }

      if (filteredDrinks.length > 0) {
          return (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredDrinks.map(drink => (
                      <DrinkCard key={drink.id} drink={drink} onSelect={handleSelectDrink} />
                  ))}
              </div>
          );
      }

      return (
          <div className="text-center py-16">
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">No drinks found</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or category.</p>
          </div>
      );
  };


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
        
        {renderContent()}

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
