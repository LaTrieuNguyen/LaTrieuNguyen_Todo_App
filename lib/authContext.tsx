'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { mockAuthService } from './mockAuth';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signup: (email: string, password: string) => Promise<{ error?: { message: string } }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await mockAuthService.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    const { error, user: loginUser } = await mockAuthService.signInWithPassword(email, password);
    if (error) {
      return { error };
    }
    if (loginUser) {
      setUser(loginUser);
    }
    return { error: undefined };
  };

  const signup = async (email: string, password: string) => {
    const { error, user: signupUser } = await mockAuthService.signUp(email, password);
    if (error) {
      return { error };
    }
    if (signupUser) {
      setUser(signupUser);
    }
    return { error: undefined };
  };

  const logout = async () => {
    await mockAuthService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        login,
        signup,
      }}
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
