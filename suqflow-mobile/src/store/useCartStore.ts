import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CartItem } from '../data/mockData';
import { apiFetch } from '../services/api';

interface CartState {
  cart: CartItem[];
  totalSalesToday: number;
  expectedCashInDrawer: number;
  
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  completeCheckout: (paymentType: 'CASH' | 'CREDIT') => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      totalSalesToday: 0,
      expectedCashInDrawer: 0,

      addItem: (product) => {
        const { cart } = get();
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
          if (existingItem.quantity < product.currentStock) {
            set({
              cart: cart.map(item => 
                item.id === product.id 
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            });
          }
        } else {
          if (product.currentStock > 0) {
            set({ cart: [...cart, { ...product, quantity: 1 }] });
          }
        }
      },

      removeItem: (productId) => {
        set({ cart: get().cart.filter(item => item.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const { cart } = get();
        const itemToUpdate = cart.find(item => item.id === productId);
        
        if (itemToUpdate && quantity <= itemToUpdate.currentStock) {
          set({
            cart: cart.map(item => 
              item.id === productId ? { ...item, quantity } : item
            )
          });
        }
      },

      clearCart: () => set({ cart: [], totalSalesToday: 0, expectedCashInDrawer: 0 }),

      completeCheckout: async (paymentType) => {
        const { cart, totalSalesToday, expectedCashInDrawer } = get();
        const checkoutTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Zero-Latency optimistic update
        set({
          totalSalesToday: totalSalesToday + checkoutTotal,
          expectedCashInDrawer: paymentType === 'CASH' 
            ? expectedCashInDrawer + checkoutTotal 
            : expectedCashInDrawer,
          cart: []
        });

        try {
          const payload = {
            cartItems: cart.map(item => ({
              id: item.id,
              quantity: item.quantity,
              subtotal: item.price * item.quantity,
            })),
            paymentType,
          };
          
          await apiFetch('/api/sales', {
            method: 'POST',
            body: JSON.stringify(payload),
          });
        } catch (error) {
          console.warn('Offline mode: Failed to sync transaction.', error);
        }
      },
    }),
    {
      name: 'suqflow-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
