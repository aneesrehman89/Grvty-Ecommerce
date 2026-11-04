'use client';
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { api } from './api';
import { useAuthStore } from '@/store/authStore';

// Everything user-specific lives under 'account' / 'admin' so logout can drop it in one call
export const accountKeys = {
  orders: ['account', 'orders'],
  order: (id) => ['account', 'order', id],
};

export const adminKeys = {
  stats: ['admin', 'stats'],
  products: (params) => ['admin', 'products', params],
  product: (id) => ['admin', 'product', id],
  orders: (params) => ['admin', 'orders', params],
};

const useToken = () => useAuthStore((s) => s.token);

// ---------------- Customer ----------------
export const useMyOrders = () => {
  const token = useToken();
  return useQuery({
    queryKey: accountKeys.orders,
    queryFn: () => api('/orders/my'),
    enabled: Boolean(token),
  });
};

export const useOrder = (id) => {
  const token = useToken();
  return useQuery({
    queryKey: accountKeys.order(id),
    queryFn: () => api(`/orders/${id}`),
    enabled: Boolean(token && id),
    retry: (count, err) => err?.status !== 404 && count < 1,
  });
};

export const useCancelOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api(`/orders/${id}/cancel`, { method: 'PATCH' }),
    onSuccess: (order) => {
      qc.setQueryData(accountKeys.order(order._id), (old) => ({ ...old, ...order }));
      qc.invalidateQueries({ queryKey: accountKeys.orders });
      qc.invalidateQueries({ queryKey: ['product'] }); // stock changed
    },
  });
};

export const usePlaceOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api('/orders', { method: 'POST', body }),
    onSuccess: (order) => {
      qc.setQueryData(accountKeys.order(order._id), order);
      qc.invalidateQueries({ queryKey: accountKeys.orders });
      qc.invalidateQueries({ queryKey: ['product'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProfile = () => {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (body) => api('/auth/me', { method: 'PATCH', body }),
    onSuccess: (user) => setUser(user),
  });
};

export const useChangePassword = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (body) => api('/auth/password', { method: 'PATCH', body }),
    onSuccess: (data) => setAuth(data),
  });
};

export const useCreateReview = (productId, slug) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api(`/products/${productId}/reviews`, { method: 'POST', body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', productId] });
      qc.invalidateQueries({ queryKey: ['product', slug] });
    },
  });
};

// ---------------- Admin ----------------
export const useAdminStats = () =>
  useQuery({ queryKey: adminKeys.stats, queryFn: () => api('/admin/stats') });

export const useAdminProducts = (params) =>
  useQuery({
    queryKey: adminKeys.products(params),
    queryFn: () => api('/products/admin/all', { params }),
    placeholderData: keepPreviousData,
  });

export const useAdminProduct = (id) =>
  useQuery({
    queryKey: adminKeys.product(id),
    queryFn: () => api(`/products/admin/${id}`),
    enabled: Boolean(id),
  });

export const useAdminOrders = (params) =>
  useQuery({
    queryKey: adminKeys.orders(params),
    queryFn: () => api('/orders', { params }),
    placeholderData: keepPreviousData,
  });

// Any catalog change should refresh both admin views and the public storefront
const invalidateCatalog = (qc) => {
  qc.invalidateQueries({ queryKey: ['admin'] });
  qc.invalidateQueries({ queryKey: ['products'] });
  qc.invalidateQueries({ queryKey: ['product'] });
  qc.invalidateQueries({ queryKey: ['categories'] });
};

export const useSaveProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) =>
      id ? api(`/products/${id}`, { method: 'PATCH', body }) : api('/products', { method: 'POST', body }),
    onSuccess: () => invalidateCatalog(qc),
  });
};

export const useUpdateStock = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, variants }) => api(`/products/${id}/stock`, { method: 'PATCH', body: { variants } }),
    onSuccess: () => invalidateCatalog(qc),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => api(`/orders/${id}/status`, { method: 'PATCH', body: { status } }),
    onSuccess: (order) => {
      qc.invalidateQueries({ queryKey: ['admin'] });
      qc.invalidateQueries({ queryKey: accountKeys.order(order._id) });
    },
  });
};
