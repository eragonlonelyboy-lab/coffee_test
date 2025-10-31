import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User, Review, WalletTransaction, PointTransaction, Voucher, UserTier } from '../types';
import { 
    walletTransactions as mockWalletTransactions,
    pointTransactions as mockPointTransactions,
    vouchers as mockVouchers
} from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => void;
  
  walletTransactions: WalletTransaction[];
  addWalletTransaction: (transactionData: Omit<WalletTransaction, 'id' | 'userId' | 'date'>) => void;
  
  pointTransactions: PointTransaction[];
  addPointTransaction: (transactionData: Omit<PointTransaction, 'id' | 'userId' | 'date'>) => void;

  vouchers: Voucher[];
  addVoucher: (voucherData: Omit<Voucher, 'id' | 'userId' | 'used'>) => void;
  useVoucher: (voucherId: string) => void;

  claimMissionReward: (missionId: string) => Promise<{success: boolean, pointsAwarded: number}>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A simple helper to merge backend user data with frontend-managed state
const mergeUser = (backendUser: any): User => ({
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    tier: backendUser.tier || UserTier.Bronze,
    points: backendUser.points || 0,
    phone: backendUser.phone || null,
    // Keep walletBalance as a frontend-managed property for now
    walletBalance: 75.50, // Default for new users or from a different source
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => window.localStorage.getItem('loyalbrew-token'));
  const [isInitializing, setIsInitializing] = useState(true);

  // --- Mock data states (to be replaced by API calls in the future)
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(mockWalletTransactions);
  const [pointTransactions, setPointTransactions] = useState<PointTransaction[]>(mockPointTransactions);
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);

  const fetchUserProfile = useCallback(async (authToken: string) => {
    try {
      const response = await fetch('/api/users/profile', {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (response.ok) {
        const { user } = await response.json();
        // Here we merge to ensure frontend-specific fields are present
        const fullUser = mergeUser(user);
        setCurrentUser(fullUser);
        return fullUser;
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      // Token is invalid, log out
      logout();
      return null;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
        if (token) {
            await fetchUserProfile(token);
        }
        setIsInitializing(false);
    };
    initializeAuth();
  }, [token, fetchUserProfile]);


  const login = async (email: string, password: string): Promise<boolean> => {
    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
            const { token: apiToken } = await response.json();
            window.localStorage.setItem('loyalbrew-token', apiToken);
            setToken(apiToken);
            await fetchUserProfile(apiToken); // Fetch full profile after login
            return true;
        }
        return false;
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    window.localStorage.removeItem('loyalbrew-token');
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            const { token: apiToken } = await response.json();
            window.localStorage.setItem('loyalbrew-token', apiToken);
            setToken(apiToken);
            await fetchUserProfile(apiToken);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Registration failed:', error);
        return false;
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (currentUser) {
      // In a real app, this would be an API call
      // For now, it just updates local state
      const updatedUser = { ...currentUser, ...data };
      setCurrentUser(updatedUser);
    }
  };
  
  // --- Mock data handlers (unchanged) ---
  const addWalletTransaction = (transactionData: Omit<WalletTransaction, 'id' | 'userId' | 'date'>) => {
    if (!currentUser) return;
    const newTransaction: WalletTransaction = { ...transactionData, id: `wt-${Date.now()}`, userId: currentUser.id, date: new Date().toISOString() };
    setWalletTransactions(prev => [newTransaction, ...prev]); mockWalletTransactions.unshift(newTransaction);
  };
  const addPointTransaction = (transactionData: Omit<PointTransaction, 'id' | 'userId' | 'date'>) => {
    if (!currentUser) return;
    const newTransaction: PointTransaction = { ...transactionData, id: `pt-${Date.now()}`, userId: currentUser.id, date: new Date().toISOString() };
    setPointTransactions(prev => [newTransaction, ...prev]); mockPointTransactions.unshift(newTransaction);
  };
  const addVoucher = (voucherData: Omit<Voucher, 'id' | 'userId' | 'used'>) => {
      if (!currentUser) return;
      const newVoucher: Voucher = { ...voucherData, id: `v-${Date.now()}`, userId: currentUser.id, used: false };
      setVouchers(prev => [newVoucher, ...prev]); mockVouchers.unshift(newVoucher);
  };
  const useVoucher = (voucherId: string) => {
      setVouchers(prev => prev.map(v => v.id === voucherId ? { ...v, used: true } : v));
      const voucherInMock = mockVouchers.find(v => v.id === voucherId); if (voucherInMock) { voucherInMock.used = true; }
  };

  const claimMissionReward = async (missionId: string): Promise<{success: boolean, pointsAwarded: number}> => {
    if (!token) {
        throw new Error("User not authenticated");
    }

    try {
        const response = await fetch(`/api/missions/${missionId}/claim`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to claim mission reward');
        }

        const result = await response.json(); // { success: true, pointsAwarded: 100 }
        
        // Update current user points
        if (currentUser && result.pointsAwarded > 0) {
            setCurrentUser(prev => prev ? ({ ...prev, points: prev.points + result.pointsAwarded }) : null);
            // Optionally add a point transaction record locally
             addPointTransaction({
                description: `Mission Reward Claimed`,
                points: result.pointsAwarded,
            });
        }
        return result;

    } catch (error) {
        console.error("Failed to claim mission reward:", error);
        throw error;
    }
  };

  const value = { 
      currentUser, 
      token,
      isInitializing,
      login, 
      logout, 
      register, 
      updateProfile, 
      walletTransactions, addWalletTransaction,
      pointTransactions, addPointTransaction,
      vouchers, addVoucher, useVoucher,
      claimMissionReward,
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