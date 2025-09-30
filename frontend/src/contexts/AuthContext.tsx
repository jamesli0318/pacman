import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthTokens, LoginCredentials, RegisterData, AuthContextType, GuestUser } from '../types/auth';
import apiService from '../utils/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [guestData, setGuestData] = useState<GuestUser | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = apiService.getStoredUser();
      const isAuth = apiService.isAuthenticated();

      if (storedUser && isAuth) {
        setUser(storedUser);
        try {
          // Verify token is still valid by fetching profile
          const profile = await apiService.getProfile();
          setUser(profile);
        } catch (error) {
          // Token invalid, clear auth state
          setUser(null);
          setTokens(null);
        }
      }

      // Check for guest mode
      const storedGuest = localStorage.getItem('isGuest');
      const storedGuestData = localStorage.getItem('guestData');
      if (storedGuest === 'true' && storedGuestData) {
        try {
          setIsGuest(true);
          setGuestData(JSON.parse(storedGuestData));
        } catch (error) {
          // Invalid guest data, clear it
          localStorage.removeItem('isGuest');
          localStorage.removeItem('guestData');
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await apiService.login(credentials);
      setUser(response.user);
      setTokens(response.tokens);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      const response = await apiService.register(data);
      setUser(response.user);
      setTokens(response.tokens);
    } catch (error: any) {
      // Handle validation errors from backend
      if (error.response?.data) {
        const errorData = error.response.data;
        const errorMessages: string[] = [];

        Object.keys(errorData).forEach((key) => {
          if (Array.isArray(errorData[key])) {
            errorMessages.push(...errorData[key]);
          } else if (typeof errorData[key] === 'string') {
            errorMessages.push(errorData[key]);
          }
        });

        throw new Error(errorMessages.join(' '));
      }
      throw new Error('Registration failed');
    }
  };

  const logout = (): void => {
    apiService.logout();
    setUser(null);
    setTokens(null);
    setIsGuest(false);
    setGuestData(null);
    localStorage.removeItem('isGuest');
    localStorage.removeItem('guestData');
  };

  const playAsGuest = (): void => {
    const guestId = `guest_${Date.now()}`;
    const guest: GuestUser = {
      isGuest: true,
      username: guestId,
      displayName: 'Guest Player'
    };

    setIsGuest(true);
    setGuestData(guest);
    localStorage.setItem('isGuest', 'true');
    localStorage.setItem('guestData', JSON.stringify(guest));
  };

  const isAuthenticated = !!user && apiService.isAuthenticated();

  const value: AuthContextType = {
    user,
    tokens,
    loading,
    isGuest,
    guestData,
    login,
    register,
    logout,
    playAsGuest,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;