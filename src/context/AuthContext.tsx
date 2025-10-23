import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { initializeUserScenarios } from '../services/scenarioService';

/**
 * User interface representing authenticated user data
 */
export interface User {
  id: string;
  email: string;
  name: string;
  // Add additional fields as needed for LBNL integration
}

/**
 * Authentication context interface
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook to use authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication Provider Component
 * This is a mock implementation that stores auth state in localStorage
 * Replace this with actual LBNL authentication API integration
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  /**
   * Mock sign in function
   * TODO: Replace with actual LBNL authentication API call
   */
  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation - accept any non-empty email/password
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Create mock user
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0], // Use email prefix as name
      };

      // Store in localStorage (for mock persistence)
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);

      // Initialize user scenarios with sample data
      await initializeUserScenarios(mockUser.id);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Mock sign up function
   * TODO: Replace with actual LBNL authentication API call
   */
  const signUp = async (
    email: string,
    password: string,
    name: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }

      // Create mock user
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
      };

      // Store in localStorage (for mock persistence)
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);

      // Initialize user scenarios with sample data
      await initializeUserScenarios(mockUser.id);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign out function
   */
  const signOut = () => {
    localStorage.removeItem('mockUser');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
