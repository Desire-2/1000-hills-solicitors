'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '@/lib/api';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = apiService.getToken();
      if (token) {
        await refreshUser();
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const refreshUser = async () => {
    console.log('[AuthContext] refreshUser called');
    try {
      const response = await apiService.getCurrentUser();
      console.log('[AuthContext] getCurrentUser response:', response);
      if (response.data) {
        console.log('[AuthContext] User data received:', response.data);
        setUser(response.data);
        return response.data;
      } else {
        console.log('[AuthContext] No user data in response');
        setUser(null);
        apiService.clearToken();
        return null;
      }
    } catch (error) {
      console.error('[AuthContext] refreshUser error:', error);
      setUser(null);
      apiService.clearToken();
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('[AuthContext] login called with:', email);
    try {
      const response = await apiService.login(email, password);
      console.log('[AuthContext] apiService.login response:', response);
      if (response.error) {
        console.log('[AuthContext] Login error:', response.error);
        return { success: false, error: response.error };
      }

      console.log('[AuthContext] Calling refreshUser...');
      const userData = await refreshUser();
      console.log('[AuthContext] refreshUser returned:', userData);
      return { success: true, user: userData || undefined };
    } catch (error) {
      console.error('[AuthContext] Login exception:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await apiService.register(email, password, name);
      if (response.error) {
        return { success: false, error: response.error };
      }

      // Auto-login after registration
      return await login(email, password);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
