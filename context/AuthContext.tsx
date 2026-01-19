
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, SubscriptionPlan } from '../types';
import { mockApi } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User | null>;
  signup: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  updateSubscription: (plan: SubscriptionPlan) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const sessionUser = await mockApi.checkSession();
        setUser(sessionUser);
      } catch (error) {
        console.error("Session check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    const loggedInUser = await mockApi.login(email, pass);
    setUser(loggedInUser);
    setLoading(false);
    return loggedInUser;
  };

  const signup = async (email: string, pass: string) => {
    setLoading(true);
    const newUser = await mockApi.signup(email, pass);
    setUser(newUser);
    setLoading(false);
    return newUser;
  };

  const logout = async () => {
    await mockApi.logout();
    setUser(null);
  };
  
  const updateSubscription = async (plan: SubscriptionPlan) => {
    if(user) {
      const updatedUser = await mockApi.updateSubscription(user.id, plan);
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
