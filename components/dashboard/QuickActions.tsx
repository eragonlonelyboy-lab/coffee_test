import React from 'react';
import { Link } from 'react-router-dom';
import { CoffeeCupIcon, GiftIcon, ShoppingCartIcon, DocumentTextIcon } from '../../assets/icons';

const actions = [
  { name: 'Order Now', href: '/menu', icon: ShoppingCartIcon, color: 'bg-brand-500 hover:bg-brand-600' },
  { name: 'My Rewards', href: '/rewards', icon: GiftIcon, color: 'bg-green-500 hover:bg-green-600' },
  { name: 'My Orders', href: '/orders', icon: DocumentTextIcon, color: 'bg-blue-500 hover:bg-blue-600' },
  { name: 'Locations', href: '/locations', icon: CoffeeCupIcon, color: 'bg-yellow-500 hover:bg-yellow-600' },
];

const QuickActions: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            to={action.href}
            className={`flex flex-col items-center justify-center p-4 rounded-lg text-white font-medium text-center transition-colors ${action.color}`}
          >
            <action.icon className="w-8 h-8 mb-2" />
            <span className="text-sm">{action.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
