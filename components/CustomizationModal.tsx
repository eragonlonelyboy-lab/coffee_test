import React, { useState, useEffect } from 'react';
import { Drink } from '../types';
import { useCart } from '../contexts/CartContext';
import { XMarkIcon, MinusIcon, PlusIcon } from '../assets/icons';
import { useNotification } from '../contexts/NotificationContext';

interface CustomizationModalProps {
  drink: Drink;
  isOpen: boolean;
  onClose: () => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ drink, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addNotification } = useNotification();

  const getDefaultCustomizations = () => {
    const defaults: Record<string, string> = {};
    drink.customizations?.forEach(cust => {
      if (cust.options.length > 0) {
        defaults[cust.id] = cust.options[0].id;
      }
    });
    return defaults;
  };

  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string>>(getDefaultCustomizations());

  useEffect(() => {
    // Reset state when drink changes
    setQuantity(1);
    setSelectedCustomizations(getDefaultCustomizations());
  }, [drink]);

  if (!isOpen) return null;

  const handleCustomizationChange = (customizationId: string, optionId: string) => {
    setSelectedCustomizations(prev => ({
      ...prev,
      [customizationId]: optionId,
    }));
  };

  const calculateTotalPrice = () => {
    let price = drink.price;
    if (drink.customizations) {
      for (const custId in selectedCustomizations) {
        const customization = drink.customizations.find(c => c.id === custId);
        if (customization) {
          const option = customization.options.find(o => o.id === selectedCustomizations[custId]);
          if (option && option.priceModifier) {
            price += option.priceModifier;
          }
        }
      }
    }
    return price * quantity;
  };

  const handleAddToCart = () => {
    addToCart(drink, quantity, selectedCustomizations);
    addNotification(`${quantity}x ${drink.name} added to cart!`, 'success');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Customize your drink</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="flex gap-4 mb-6">
            <img src={drink.imageUrls[0]} alt={drink.name} className="w-24 h-24 rounded-md object-cover"/>
            <div>
                <h3 className="text-lg font-bold">{drink.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{drink.description}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {drink.customizations?.map(cust => (
              <div key={cust.id}>
                <h4 className="font-semibold mb-2">{cust.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {cust.options.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleCustomizationChange(cust.id, opt.id)}
                      className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                        selectedCustomizations[cust.id] === opt.id
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {opt.name} {opt.priceModifier ? `(+$${opt.priceModifier.toFixed(2)})` : ''}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"><MinusIcon className="w-5 h-5"/></button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"><PlusIcon className="w-5 h-5"/></button>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-brand-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-brand-700 transition-colors"
          >
            Add To Cart - ${calculateTotalPrice().toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;
