'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '@/lib/api';
import { useAuthStore } from './authStore';

const MAX_QTY = 20;
const localId = (productId, variantId) => `${productId}:${variantId}`;
const isLoggedIn = () => Boolean(useAuthStore.getState().token);

/**
 * Hybrid cart:
 *  - Guests: items live only in localStorage (persisted Zustand).
 *  - Logged-in users: every action goes through the REST API and the store
 *    mirrors the server cart, so it follows the user across devices.
 *  - On login the guest cart is merged into the server cart (see lib/session.js).
 *
 * Item shape: { id, productId, variantId, name, slug, image, size, color, stock, price, quantity }
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setItems: (items) => set({ items }),

      addItem: async ({ product, variant, quantity = 1 }) => {
        if (isLoggedIn()) {
          const cart = await api('/cart/items', {
            method: 'POST',
            body: { productId: product._id, variantId: variant._id, quantity },
          });
          set({ items: cart.items });
          return;
        }

        const id = localId(product._id, variant._id);
        const existing = get().items.find((i) => i.id === id);
        const nextQty = (existing?.quantity || 0) + quantity;

        if (nextQty > variant.stock) {
          throw new Error(
            variant.stock === 0
              ? 'This size is out of stock'
              : `Only ${variant.stock} unit(s) left in this size`
          );
        }

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: Math.min(nextQty, MAX_QTY), stock: variant.stock } : i
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                id,
                productId: product._id,
                variantId: variant._id,
                name: product.name,
                slug: product.slug,
                image: product.images?.[0],
                size: variant.size,
                color: variant.color,
                stock: variant.stock,
                price: product.price,
                quantity,
              },
            ],
          });
        }
      },

      updateQuantity: async (id, quantity) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        if (quantity > item.stock) throw new Error(`Only ${item.stock} unit(s) available`);
        const qty = Math.max(1, Math.min(quantity, MAX_QTY));

        if (isLoggedIn()) {
          const cart = await api(`/cart/items/${id}`, { method: 'PATCH', body: { quantity: qty } });
          set({ items: cart.items });
          return;
        }

        set({ items: get().items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)) });
      },

      removeItem: async (id) => {
        if (isLoggedIn()) {
          const cart = await api(`/cart/items/${id}`, { method: 'DELETE' });
          set({ items: cart.items });
          return;
        }
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      // Pull the latest server cart (fresh prices + stock)
      loadServerCart: async () => {
        const cart = await api('/cart');
        set({ items: cart.items });
        return cart;
      },

      // Push guest items into the user's server cart after login
      mergeGuestCart: async () => {
        const guestItems = get().items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        }));
        const cart = guestItems.length
          ? await api('/cart/merge', { method: 'POST', body: { items: guestItems } })
          : await api('/cart');
        set({ items: cart.items });
      },

      clearLocal: () => set({ items: [] }),
    }),
    {
      name: 'grvty-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Derived selectors
export const selectCartCount = (state) => state.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectSubtotal = (state) => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
