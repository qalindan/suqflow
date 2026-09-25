import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalAmount: 0,

  addItem: (newItem) => set((state) => {
    const existingItem = state.items.find(item => item.id === newItem.id);
    let updatedItems;
    
    if (existingItem) {
      updatedItems = state.items.map(item =>
        item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedItems = [...state.items, { ...newItem, quantity: 1 }];
    }

    const updatedTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { items: updatedItems, totalAmount: updatedTotal };
  }),

  removeItem: (id) => set((state) => {
    const updatedItems = state.items.filter(item => item.id !== id);
    const updatedTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { items: updatedItems, totalAmount: updatedTotal };
  }),

  clearCart: () => set({ items: [], totalAmount: 0 })
}));
