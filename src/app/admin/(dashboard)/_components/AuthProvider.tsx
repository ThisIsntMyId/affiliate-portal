'use client';

import { createContext, useContext } from 'react';
import { type AdminJWTPayload } from '@/auth/admin';

interface User {
  id: number;
  type: 'admin' | 'brand' | 'affiliate';
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ 
  children, 
  user
}: { 
  children: React.ReactNode;
  user: AdminJWTPayload | null;
}) {
  return (
    <AuthContext.Provider value={{ user: user?.user || null }}>
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
