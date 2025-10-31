import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User, Review, WalletTransaction, PointTransaction, Voucher, UserTier } from '../types';
import { 
    walletTransactions as mockWalletTransactions,
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

  // --- Mock data states for features without backend endpoints yet ---
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(mockWalletTransactions);
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  
  // --- Live data state ---
  const [pointTransactions, setPointTransactions] = useState<PointTransaction[]>([]);

  const fetchUserProfile = useCallback(async (authToken: string) => {
    try {
      const response = await fetch('/api/users/profile', {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (response.ok) {
        const { user } = await response.json();
        const fullUser = mergeUser(user);
        setCurrentUser(fullUser);
        return fullUser;
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      logout();
      return null;
    }
  }, []);

  const fetchPointHistory = useCallback(async (authToken: string) => {
    try {
        const response = await fetch('/api/loyalty/history', {
            headers: { 'Authorization': `Bearer ${authToken}` },
        });
        if(response.ok) {
            const data = await response.json();
            // Adapt backend data to frontend type
            const history: PointTransaction[] = data.history.map((record: any) => ({
                id: record.id,
                userId: record.userId,
                date: record.createdAt,
                description: record.description || `Points Activity`,
                points: record.pointsEarned - record.pointsSpent,
            }));
            setPointTransactions(history);
        }
    } catch (error) {
        console.error("Failed to fetch point history:", error);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
        if (token) {
            await Promise.all([
                fetchUserProfile(token),
                fetchPointHistory(token)
            ]);
        }
        setIsInitializing(false);
    };
    initializeAuth();
  }, [token, fetchUserProfile, fetchPointHistory]);


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
            // Data will be fetched by the useEffect hook
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
    setPointTransactions([]);
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
            // Data will be fetched by the useEffect hook
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
      const updatedUser = { ...currentUser, ...data };
      setCurrentUser(updatedUser);
    }
  };
  
  // --- Mock data handlers (unchanged) ---
  const addWalletTransaction = (transactionData: Omit<WalletTransaction, 'id' | 'userId' | 'date'>) => {
    if (!currentUser) return;
    const newTransaction: WalletTransaction = { ...transactionData, id: `wt-${Date.now()}`, userId: currentUser.id, date: new Date().toISOString() };
    setWalletTransactions(prev => [newTransaction, ...prev]);
  };
  const addVoucher = (voucherData: Omit<Voucher, 'id' | 'userId' | 'used'>) => {
      if (!currentUser) return;
      const newVoucher: Voucher = { ...voucherData, id: `v-${Date.now()}`, userId: currentUser.id, used: false };
      setVouchers(prev => [newVoucher, ...prev]);
  };
  const useVoucher = (voucherId: string) => {
      setVouchers(prev => prev.map(v => v.id === voucherId ? { ...v, used: true } : v));
  };
  
  // This can now be a local-only update, as the main data is fetched from API.
  const addPointTransaction = (transactionData: Omit<PointTransaction, 'id'|'userId'|'date'>) => {
      if (!currentUser) return;
      const newTransaction: PointTransaction = { ...transactionData, id: `pt-${Date.now()}`, userId: currentUser.id, date: new Date().toISOString() };
      setPointTransactions(prev => [newTransaction, ...prev]);
  };

  const claimMissionReward = async (missionId: string): Promise<{success: boolean, pointsAwarded: number}> => {
    if (!token) throw new Error("User not authenticated");

    try {
        const response = await fetch(`/api/missions/${missionId}/claim`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to claim mission reward');
        }

        const result = await response.json();
        
        if (currentUser && result.pointsAwarded > 0) {
            setCurrentUser(prev => prev ? ({ ...prev, points: prev.points + result.pointsAwarded }) : null);
            // Manually add to local state for immediate UI update before next full fetch
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
