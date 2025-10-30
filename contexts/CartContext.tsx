import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Drink } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (drink: Drink, quantity: number, customizations: Record<string, string>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    setCartTotal(total);
  }, [cart]);
  
  const addToCart = (drink: Drink, quantity: number, customizations: Record<string, string>) => {
    let price = drink.price;
    if (drink.customizations) {
      for (const custId in customizations) {
        const customization = drink.customizations.find(c => c.id === custId);
        if (customization) {
          const option = customization.options.find(o => o.id === customizations[custId]);
          if (option && option.priceModifier) {
            price += option.priceModifier;
          }
        }
      }
    }
    
    // For simplicity, we add as a new item even if it's the same drink with same customizations.
    // A real app might try to find and update quantity.
    const newItem: CartItem = {
      id: `${drink.id}-${Date.now()}`,
      drink,
      quantity,
      customizations,
      unitPrice: price,
    };
    setCart(prev => [...prev, newItem]);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCart(prev => prev.map(item =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };
  
  const clearCart = () => {
    setCart([]);
  }

  const value = { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};