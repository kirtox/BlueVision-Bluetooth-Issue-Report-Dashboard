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
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateAvatar: (file: File) => Promise<boolean>;
  isLoading: boolean;
  isAuthenticated: boolean;
  useMockAuth: boolean;
  setUseMockAuth: (value: boolean) => void;
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
  const [useMockAuth, setUseMockAuth] = useState(() => {
    return localStorage.getItem('useMockAuth') !== 'false';
  });

  useEffect(() => {
    // 檢查本地存儲中的用戶信息
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // 驗證 token 是否有效
          try {
            if (!useMockAuth) {
              await authService.verifyToken(token);
            }
            const userData = localStorage.getItem('userData');
            if (userData) {
              setUser(JSON.parse(userData));
            }
          } catch (error) {
            // Token 無效，清除本地存儲
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (useMockAuth) {
        // 模擬登入模式
        if (username && password) {
          const mockUser: User = {
            id: 1,
            username: username,
            role: 'User',
            avatar: '/images/avatar/avatar-default.jpg'
          };

          setUser(mockUser);
          localStorage.setItem('authToken', 'mock-token-' + Date.now());
          localStorage.setItem('userData', JSON.stringify(mockUser));
          return true;
        }
        return false;
      } else {
        // 真實 API 模式
        const response = await authService.login({ username, password });

        // 除錯：檢查回應格式
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
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (useMockAuth) {
        // 模擬註冊模式，直接登入
        return await login(username, password);
      } else {
        // 真實 API 模式
        await authService.register({ username, password });
        // 註冊成功後自動登入
        return await login(username, password);
      }
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

      if (useMockAuth) {
        // 模擬模式：創建本地 URL
        const mockAvatarUrl = URL.createObjectURL(file);
        const updatedUser = { ...user!, avatar: mockAvatarUrl };
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        return true;
      } else {
        // 真實 API 模式
        const response = await authService.uploadAvatar(file, token);
        const updatedUser = { ...user!, avatar: response.avatar };
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        return true;
      }
    } catch (error) {
      console.error('Avatar update failed:', error);
      return false;
    }
  };

  const handleMockAuthChange = (value: boolean) => {
    setUseMockAuth(value);
    localStorage.setItem('useMockAuth', value.toString());
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateAvatar,
    isLoading,
    isAuthenticated: !!user,
    useMockAuth,
    setUseMockAuth: handleMockAuthChange
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};