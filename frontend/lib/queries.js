'use client';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api } from './api';

// Central query-key factory so invalidation stays consistent across the app
export const queryKeys = {
  categories: ['categories'],
  products: (params) => ['products', params],
  productsByTag: (tag, limit) => ['products', 'tag', tag, limit],
  newArrivals: (limit) => ['products', 'new-arrivals', limit],
  product: (slug) => ['product', slug],
  related: (slug) => ['product', slug, 'related'],
  reviews: (productId, page) => ['reviews', productId, page],
  search: (q) => ['search', q],
};

export const useCategories = () =>
  useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => api('/categories', { auth: false }),
    staleTime: 10 * 60 * 1000,
  });

export const useProducts = (params) =>
  useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => api('/products', { params, auth: false }),
    placeholderData: keepPreviousData, // keep the old grid visible while filters change
  });

export const useProductsByTag = (tag, limit = 8) =>
  useQuery({
    queryKey: queryKeys.productsByTag(tag, limit),
    queryFn: () => api(`/products/tag/${tag}`, { params: { limit }, auth: false }),
  });

export const useNewArrivals = (limit = 8) =>
  useQuery({
    queryKey: queryKeys.newArrivals(limit),
    queryFn: () => api('/products/new-arrivals', { params: { limit }, auth: false }),
  });

export const useProduct = (slug) =>
  useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: () => api(`/products/${slug}`, { auth: false }),
    enabled: Boolean(slug),
    retry: (count, err) => err?.status !== 404 && count < 2,
  });

export const useRelatedProducts = (slug) =>
  useQuery({
    queryKey: queryKeys.related(slug),
    queryFn: () => api(`/products/${slug}/related`, { auth: false }),
    enabled: Boolean(slug),
  });

export const useReviews = (productId, page = 1) =>
  useQuery({
    queryKey: queryKeys.reviews(productId, page),
    queryFn: () => api(`/products/${productId}/reviews`, { params: { page }, auth: false }),
    enabled: Boolean(productId),
    placeholderData: keepPreviousData,
  });

export const useSearch = (q) =>
  useQuery({
    queryKey: queryKeys.search(q),
    queryFn: () => api('/products/search', { params: { q, limit: 6 }, auth: false }),
    enabled: q.trim().length >= 2,
    staleTime: 60 * 1000,
  });
