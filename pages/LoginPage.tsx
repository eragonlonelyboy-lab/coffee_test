import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CoffeeCupIcon } from '../assets/icons';
import { useNotification } from '../contexts/NotificationContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('test@coffee.com'); // Pre-fill for demo
    const [password, setPassword] = useState('pass123'); // Pre-fill for demo
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { addNotification } = useNotification();
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Please enter your email and password.');
            setIsLoading(false);
            return;
        }

        try {
            const success = await login(email, password);
            if (success) {
                addNotification('Login successful!', 'success');
                navigate(from, { replace: true });
            } else {
                setError('Invalid email or password. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <CoffeeCupIcon className="mx-auto h-12 w-auto text-brand-600" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Sign in to your account
                    </h2>
                     <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Or{' '}
                        <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500">
                            start your free trial
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                         <div>
                            <label htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:bg-brand-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
                 <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Demo account: test@coffee.com / pass123
                </p>
            </div>
        </div>
    );
};

export default LoginPage;