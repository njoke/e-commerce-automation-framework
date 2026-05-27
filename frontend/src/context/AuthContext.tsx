import { createContext, useState, type ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: (User & { id: string }) | null;
  token: string | null;
  login: (user: User & { id: string }, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

const AUTH_KEY = 'amplifii_auth';

function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return { user: null, token: null };
    return JSON.parse(raw) as { user: (User & { id: string }) | null; token: string | null };
  } catch {
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = loadAuth();
  const [user, setUser] = useState<(User & { id: string }) | null>(initial.user);
  const [token, setToken] = useState<string | null>(initial.token);

  const login = (u: User & { id: string }, t: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user: u, token: t }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
