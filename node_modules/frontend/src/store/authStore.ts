import { create } from 'zustand';

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  badges?: string[];
  role: string;
  points: number;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      set({ user: data.data.user, token: data.data.token });
      localStorage.setItem('token', data.data.token);
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      set({ user: data.data.user, token: data.data.token });
      localStorage.setItem('token', data.data.token);
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('token');
  },

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
}));
