'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const MAX_QTY = 20;
const localId = (productId, variantId) => `${productId}:${variantId}`;

/**
 * Guest cart, persisted to localStorage.
 * Item shape: { id, productId, variantId, name, slug, image, size, color, stock, price, quantity }
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      pending: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setItems: (items) => set({ items }),

      addItem: async ({ product, variant, quantity = 1 }) => {
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
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, MAX_QTY)) } : i
          ),
        });
      },

      removeItem: async (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      clear: async () => set({ items: [] }),
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
