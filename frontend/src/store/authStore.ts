import { create } from 'zustand'
import { apiClient } from '../api/client'

interface AuthState {
  token: string | null;
  user: any | null;
  isInitialized: boolean;
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isInitialized: false,
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
    get().fetchUser();
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isInitialized: true });
  },
  fetchUser: async () => {
    try {
      const { data } = await apiClient.get('/auth/me');
      set({ user: data, isInitialized: true });
    } catch (e) {
      console.warn("Could not fetch user profile:", e);
      get().logout();
    }
  },
  initAuth: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ token });
      await get().fetchUser();
    } else {
      set({ isInitialized: true });
    }
  }
}))
