

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Review } from '../types';
import { users as mockUsers, reviews as mockReviews, drinks as mockDrinks } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  register: (name: string, email: string) => boolean;
  updateProfile: (data: Partial<User>) => void;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'userName' | 'userId' | 'date'>) => void;
  editReview: (reviewId: string, updates: Partial<Pick<Review, 'rating' | 'comment' | 'tags'>>) => void;
  deleteReview: (reviewId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
        const item = window.localStorage.getItem('loyalbrew-user');
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.warn('Error reading user from localStorage', error);
        return null;
    }
  });
  
  const [reviews, setReviews] = useState<Review[]>(mockReviews);

  useEffect(() => {
    if (currentUser) {
        window.localStorage.setItem('loyalbrew-user', JSON.stringify(currentUser));
    } else {
        window.localStorage.removeItem('loyalbrew-user');
    }
  }, [currentUser]);


  const login = (email: string): boolean => {
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (name: string, email: string): boolean => {
    if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return false; // User already exists
    }
    const user = mockUsers[0];
    setCurrentUser({ ...user, name, email });
    return true;
  };

  const updateProfile = (data: Partial<User>) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    }
  };
  
  const addReview = (reviewData: Omit<Review, 'id' | 'userName' | 'userId' | 'date'>) => {
    if (!currentUser) return;
    
    const newReview: Review = {
        ...reviewData,
        id: `rev-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        date: new Date().toISOString()
    };
    
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    mockReviews.unshift(newReview);

    recalculateDrinkRating(newReview.drinkId, updatedReviews);
  };

  const editReview = (reviewId: string, updates: Partial<Pick<Review, 'rating' | 'comment' | 'tags'>>) => {
    let drinkIdToUpdate: string | undefined;
    const updatedReviews = reviews.map(r => {
      if (r.id === reviewId) {
        drinkIdToUpdate = r.drinkId;
        return { ...r, ...updates, date: new Date().toISOString() };
      }
      return r;
    });
    setReviews(updatedReviews);
    
    const reviewInMock = mockReviews.find(r => r.id === reviewId);
    if (reviewInMock) {
        Object.assign(reviewInMock, updates, { date: new Date().toISOString() });
    }

    if (drinkIdToUpdate) {
        recalculateDrinkRating(drinkIdToUpdate, updatedReviews);
    }
  };

  const deleteReview = (reviewId: string) => {
    const reviewToDelete = reviews.find(r => r.id === reviewId);
    if (!reviewToDelete) return;

    const updatedReviews = reviews.filter(r => r.id !== reviewId);
    setReviews(updatedReviews);

    const indexInMock = mockReviews.findIndex(r => r.id === reviewId);
    if (indexInMock > -1) {
        mockReviews.splice(indexInMock, 1);
    }

    recalculateDrinkRating(reviewToDelete.drinkId, updatedReviews);
  };

  const recalculateDrinkRating = (drinkId: string, allReviews: Review[]) => {
    const drinkToUpdate = mockDrinks.find(d => d.id === drinkId);
    if (drinkToUpdate) {
        const drinkReviews = allReviews.filter(r => r.drinkId === drinkId);
        if (drinkReviews.length > 0) {
            const totalRating = drinkReviews.reduce((sum, r) => sum + r.rating, 0);
            const newAverage = totalRating / drinkReviews.length;
            
            drinkToUpdate.rating = parseFloat(newAverage.toFixed(1));
            drinkToUpdate.reviewCount = drinkReviews.length;
        } else {
            drinkToUpdate.rating = 0;
            drinkToUpdate.reviewCount = 0;
        }
    }
  };


  const value = { currentUser, login, logout, register, updateProfile, reviews, addReview, editReview, deleteReview };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};