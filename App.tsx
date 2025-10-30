import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

// --- Theme Management ---
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem('loyalbrew-theme') as Theme | null;
    if (savedTheme) return savedTheme;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    window.localStorage.setItem('loyalbrew-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
// --- End Theme Management ---

import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';

import Header from './components/Header';
import Footer from './components/Footer';
import NotificationContainer from './components/NotificationContainer';
import ProtectedRoute from './components/ProtectedRoute';

import HomeRouter from './pages/HomeRouter';
import MenuPage from './pages/MenuPage';
import LocationsPage from './pages/LocationsPage';
import OutletDetailPage from './pages/OutletDetailPage';
import RewardsPage from './pages/RewardsPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MissionsPage from './pages/MissionsPage';
import TierStatusPage from './pages/TierStatusPage';
import WalletPage from './pages/WalletPage';
import VouchersPage from './pages/VouchersPage';
import ReferralsPage from './pages/ReferralsPage';
import ReviewsPage from './pages/ReviewsPage';


const AppContent: React.FC = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <NotificationProvider>
                    <Router>
                        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                            <Header />
                            <NotificationContainer />
                            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                <Routes>
                                    <Route path="/" element={<HomeRouter />} />
                                    <Route path="/dashboard" element={<ProtectedRoute><HomeRouter /></ProtectedRoute>} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegisterPage />} />
                                    <Route path="/menu" element={<MenuPage />} />
                                    <Route path="/locations" element={<LocationsPage />} />
                                    <Route path="/locations/:outletId" element={<OutletDetailPage />} />
                                    <Route path="/reviews" element={<ReviewsPage />} />
                                    
                                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                                    <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                                    <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                                    <Route path="/order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
                                    <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
                                    <Route path="/missions" element={<ProtectedRoute><MissionsPage /></ProtectedRoute>} />
                                    <Route path="/tier-status" element={<ProtectedRoute><TierStatusPage /></ProtectedRoute>} />
                                    <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
                                    <Route path="/vouchers" element={<ProtectedRoute><VouchersPage /></ProtectedRoute>} />
                                    <Route path="/referrals" element={<ProtectedRoute><ReferralsPage /></ProtectedRoute>} />
                                </Routes>
                            </main>
                            <Footer />
                        </div>
                    </Router>
                </NotificationProvider>
            </CartProvider>
        </AuthProvider>
    );
};


const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};

export default App;