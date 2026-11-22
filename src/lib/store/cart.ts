import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ProductVariant } from '@/lib/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
  getTotalWeightGrams: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.variant.id === variant.id
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const newQty = updatedItems[existingIndex].quantity + quantity;
            // Don't exceed stock
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: Math.min(newQty, variant.stock),
            };
            return { items: updatedItems };
          }

          return {
            items: [
              ...state.items,
              { product, variant, quantity: Math.min(quantity, variant.stock) },
            ],
          };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variant.id !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.variant.id !== variantId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.variant.id === variantId
                ? { ...item, quantity: Math.min(quantity, item.variant.stock) }
                : item
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.variant.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalWeightGrams: () => {
        return get().items.reduce(
          (total, item) => total + item.variant.pack_size_grams * item.quantity,
          0
        );
      },
    }),
    {
      name: 'mohite-farms-cart',
    }
  )
);
