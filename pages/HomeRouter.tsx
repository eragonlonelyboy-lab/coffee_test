import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import HomePage from './HomePage';
import DashboardPage from './DashboardPage';

const HomeRouter: React.FC = () => {
  const { currentUser } = useAuth();

  return currentUser ? <DashboardPage /> : <HomePage />;
};

export default HomeRouter;