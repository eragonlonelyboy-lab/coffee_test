import React, { useState, useEffect } from 'react';
import { Drink } from '../types';
import { useCart } from '../contexts/CartContext';
import { XMarkIcon, MinusIcon, PlusIcon } from '../assets/icons';
import { useNotification } from '../contexts/NotificationContext';

interface CustomizationModalProps {
  drink: Drink;
  isOpen: boolean;
  onClose: () => void;
  initialQuantity: number;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ drink, isOpen, onClose, initialQuantity }) => {
  const [quantity, setQuantity] = useState(initialQuantity || 1);
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
    if (isOpen) {
        // Reset state when modal opens for a new drink
        setQuantity(initialQuantity || 1);
        setSelectedCustomizations(getDefaultCustomizations());
    }
  }, [drink, isOpen, initialQuantity]);

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
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Customize Your Drink</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6">
                <img src={drink.imageUrls[0]} alt={drink.name} className="w-full h-64 rounded-md object-cover"/>
            </div>
            <div className="p-6">
                <h3 className="text-2xl font-bold">{drink.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-6">{drink.description}</p>
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
                                ? 'bg-brand-500 text-white border-brand-500'
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
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"><MinusIcon className="w-5 h-5"/></button>
            <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"><PlusIcon className="w-5 h-5"/></button>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto flex-grow bg-brand-500 text-white font-semibold px-6 py-3 rounded-md hover:bg-brand-600 transition-colors"
          >
            Add To Cart - ${calculateTotalPrice().toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;