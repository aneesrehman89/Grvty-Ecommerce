'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      setAuth: ({ user, token }) => set({ user, token }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ user: null, token: null }),
    }),
    {
      name: 'grvty-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const selectIsAdmin = (state) => state.user?.role === 'admin';
