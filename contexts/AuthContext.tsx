import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Review, WalletTransaction, PointTransaction, Voucher } from '../types';
import { 
    users as mockUsers, 
    reviews as mockReviews, 
    walletTransactions as mockWalletTransactions,
    pointTransactions as mockPointTransactions,
    vouchers as mockVouchers
} from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  register: (name: string, email: string) => boolean;
  updateProfile: (data: Partial<User>) => void;
  
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'userName' | 'userId' | 'date'>) => void;
  editReview: (reviewId: string, updates: Partial<Pick<Review, 'rating' | 'comment'>>) => void;
  deleteReview: (reviewId: string) => void;
  
  walletTransactions: WalletTransaction[];
  addWalletTransaction: (transactionData: Omit<WalletTransaction, 'id' | 'userId' | 'date'>) => void;
  
  pointTransactions: PointTransaction[];
  addPointTransaction: (transactionData: Omit<PointTransaction, 'id' | 'userId' | 'date'>) => void;

  vouchers: Voucher[];
  addVoucher: (voucherData: Omit<Voucher, 'id' | 'userId' | 'used'>) => void;
  useVoucher: (voucherId: string) => void;
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
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(mockWalletTransactions);
  const [pointTransactions, setPointTransactions] = useState<PointTransaction[]>(mockPointTransactions);
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);


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
    
    setReviews(prev => [newReview, ...prev]);
    mockReviews.unshift(newReview);
  };

  const editReview = (reviewId: string, updates: Partial<Pick<Review, 'rating' | 'comment'>>) => {
    const updatedReviews = reviews.map(r => 
        r.id === reviewId ? { ...r, ...updates, date: new Date().toISOString() } : r
    );
    setReviews(updatedReviews);
    
    const reviewInMock = mockReviews.find(r => r.id === reviewId);
    if (reviewInMock) {
        Object.assign(reviewInMock, updates, { date: new Date().toISOString() });
    }
  };

  const deleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));

    const indexInMock = mockReviews.findIndex(r => r.id === reviewId);
    if (indexInMock > -1) {
        mockReviews.splice(indexInMock, 1);
    }
  };
  
  const addWalletTransaction = (transactionData: Omit<WalletTransaction, 'id' | 'userId' | 'date'>) => {
    if (!currentUser) return;
    const newTransaction: WalletTransaction = {
        ...transactionData,
        id: `wt-${Date.now()}`,
        userId: currentUser.id,
        date: new Date().toISOString()
    };
    setWalletTransactions(prev => [newTransaction, ...prev]);
    mockWalletTransactions.unshift(newTransaction);
  };
  
  const addPointTransaction = (transactionData: Omit<PointTransaction, 'id' | 'userId' | 'date'>) => {
    if (!currentUser) return;
    const newTransaction: PointTransaction = {
        ...transactionData,
        id: `pt-${Date.now()}`,
        userId: currentUser.id,
        date: new Date().toISOString()
    };
    setPointTransactions(prev => [newTransaction, ...prev]);
    mockPointTransactions.unshift(newTransaction);
  };
  
  const addVoucher = (voucherData: Omit<Voucher, 'id' | 'userId' | 'used'>) => {
      if (!currentUser) return;
      const newVoucher: Voucher = {
          ...voucherData,
          id: `v-${Date.now()}`,
          userId: currentUser.id,
          used: false
      };
      setVouchers(prev => [newVoucher, ...prev]);
      mockVouchers.unshift(newVoucher);
  };

  const useVoucher = (voucherId: string) => {
      setVouchers(prev => prev.map(v => v.id === voucherId ? { ...v, used: true } : v));
      const voucherInMock = mockVouchers.find(v => v.id === voucherId);
      if (voucherInMock) {
          voucherInMock.used = true;
      }
  };


  const value = { 
      currentUser, 
      login, 
      logout, 
      register, 
      updateProfile, 
      reviews, 
      addReview, 
      editReview, 
      deleteReview, 
      walletTransactions,
      addWalletTransaction,
      pointTransactions,
      addPointTransaction,
      vouchers,
      addVoucher,
      useVoucher,
    };

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