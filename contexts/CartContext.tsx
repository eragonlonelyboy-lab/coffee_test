import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Drink } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  isLoading: boolean;
  addToCart: (drink: Drink, quantity: number, customizations: Record<string, string>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getInitialCart = (): CartItem[] => {
    try {
        const item = window.localStorage.getItem('loyalbrew-cart');
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("Error reading cart from localStorage", error);
        return [];
    }
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(getInitialCart);
  const [cartTotal, setCartTotal] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Persist cart to localStorage whenever it changes
    try {
        window.localStorage.setItem('loyalbrew-cart', JSON.stringify(cart));
    } catch (error) {
        console.error("Error saving cart to localStorage", error);
    }

    // Recalculate total
    const total = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    setCartTotal(total);
  }, [cart]);

  // Clear cart on logout
  useEffect(() => {
    if (!currentUser) {
        setCart([]);
    }
  }, [currentUser]);

  const addToCart = (drink: Drink, quantity: number, customizations: Record<string, string>) => {
    setCart(prevCart => {
        // For simplicity, we add as a new item even if it's a duplicate with different customizations.
        // A more complex implementation could check for deep equality.
        const newItem: CartItem = {
            id: `${drink.id}-${Date.now()}`, // Unique ID for each cart line item
            menuItemId: drink.id,
            menuItem: drink,
            quantity,
            options: customizations
        };
        return [...prevCart, newItem];
    });
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

  const value = { cart, isLoading: false, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal };

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
