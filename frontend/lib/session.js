'use client';
import { api, configureApi } from './api';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

// Wire the API client to the auth store once, at module load
configureApi({
  tokenGetter: () => useAuthStore.getState().token,
  unauthorizedHandler: () => {
    // Token expired / revoked → drop the session and the mirrored server cart
    useAuthStore.getState().clearAuth();
    useCartStore.getState().clearLocal();
  },
});

const startSession = async (data) => {
  useAuthStore.getState().setAuth(data);
  try {
    await useCartStore.getState().mergeGuestCart();
  } catch {
    // A failed merge shouldn't block login; the server cart loads on next visit
  }
  return data.user;
};

export const login = async (credentials) => {
  const data = await api('/auth/login', { method: 'POST', body: credentials, auth: false });
  return startSession(data);
};

export const register = async (details) => {
  const data = await api('/auth/register', { method: 'POST', body: details, auth: false });
  return startSession(data);
};

export const logout = () => {
  useAuthStore.getState().clearAuth();
  useCartStore.getState().clearLocal();
};

// Called once on app load: refresh the user and the server cart if logged in
export const restoreSession = async () => {
  if (!useAuthStore.getState().token) return;
  try {
    const user = await api('/auth/me');
    useAuthStore.getState().setUser(user);
    await useCartStore.getState().loadServerCart();
  } catch {
    // 401s are handled by the unauthorized handler above
  }
};
