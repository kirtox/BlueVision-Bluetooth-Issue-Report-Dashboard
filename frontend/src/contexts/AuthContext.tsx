import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface User {
  id: number;
  username: string;
  email?: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, email?: string) => Promise<boolean>;
  logout: () => void;
  updateAvatar: (file: File) => Promise<boolean>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check user information in local storage
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        console.log('AuthContext: Checking auth status', { hasToken: !!token, hasUserData: !!userData });

        if (token && userData) {
          // First set user data so UI can respond immediately
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);
          console.log('AuthContext: User data loaded from localStorage', parsedUserData);

          // Then verify token in background
          try {
            await authService.verifyToken(token);
            console.log('AuthContext: Token verification successful');
          } catch (error) {
            console.error('AuthContext: Token verification failed', error);
            // Token invalid, clear local storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setUser(null);
          }
        } else {
          console.log('AuthContext: No token or user data found');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
      } finally {
        setIsLoading(false);
        console.log('AuthContext: Auth check completed');
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ username, password });

      // Debug: Check response format
      console.log('Login response:', response);

      if (!response.user) {
        console.error('Response missing user object:', response);
        throw new Error('Invalid response format: missing user data');
      }

      const user: User = {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        role: response.user.role,
        avatar: response.user.avatar || '/images/avatar/avatar-default.jpg'
      };

      setUser(user);
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('userData', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string, email?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await authService.register({ username, password, email });
      // Auto login after successful registration
      return await login(username, password);
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const updateAvatar = async (file: File): Promise<boolean> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await authService.uploadAvatar(file, token);
      const updatedUser = { ...user!, avatar: response.avatar };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Avatar update failed:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateAvatar,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};