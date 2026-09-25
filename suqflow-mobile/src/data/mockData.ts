export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  currentStock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  amount: number;
  time: string;
  items: number;
  cashier: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  balance: number;
}

export const CATEGORIES = ['All', 'Beverages', 'Snacks', 'Dairy'];

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Tactical Backpack', price: 120.00, category: 'All', currentStock: 10 },
  { id: '2', name: 'Heavy Duty Gloves', price: 45.00, category: 'All', currentStock: 5 },
  { id: '3', name: 'Thermal Flask', price: 35.00, category: 'Beverages', currentStock: 20 },
  { id: '4', name: 'Chicken', price: 985.00, category: 'All', currentStock: 2 },
  { id: '5', name: 'Milk', price: 65.00, category: 'Dairy', currentStock: 15 },
  { id: '6', name: 'Chips', price: 35.00, category: 'Snacks', currentStock: 8 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', amount: 150.00, time: '14:32', items: 3, cashier: 'Admin' },
  { id: 't2', amount: 45.50, time: '14:15', items: 1, cashier: 'Admin' },
  { id: 't3', amount: 320.00, time: '13:50', items: 5, cashier: 'Admin' },
  { id: 't4', amount: 80.00, time: '13:10', items: 2, cashier: 'Admin' },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Abebe Kebede', phone: '+251 911 223 344', balance: 0.00 },
  { id: 'c2', name: 'Wiro Selam', phone: '+251 912 234 455', balance: -450.00 },
  { id: 'c3', name: 'Kalkidan Tadesse', phone: '+251 913 445 566', balance: 0.00 },
];
