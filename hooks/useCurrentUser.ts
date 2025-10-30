import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';

/**
 * A convenience hook to get the current user.
 * @returns The current user object or null if not logged in.
 */
export const useCurrentUser = (): User | null => {
    const { currentUser } = useAuth();
    return currentUser;
};