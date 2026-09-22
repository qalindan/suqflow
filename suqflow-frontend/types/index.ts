// Centralized TypeScript Interfaces for SuqFlow

export interface Product {
  id: number;
  name: string;
  category: string;
  cost: string; // Consider changing to number for actual DB
  price: string; // Consider changing to number for actual DB
  stock: number;
  status: "IN STOCK" | "LOW STOCK" | "OUT OF STOCK";
  icon: any; // Lucide icon type
}

export interface Cashier {
  id: string;
  initials: string;
  name: string;
  pin: string;
  updated: string;
}

export interface Customer {
  id: number;
  initials: string;
  name: string;
  phone: string;
  status: string;
  balance: string; // Consider changing to number for actual DB
  isOwed: boolean;
}

export interface Transaction {
  id: string; // e.g. "RC-0095"
  time: string;
  items: number;
  amount: string;
  type: "SALE" | "REFUND" | "OTHER"; // Added based on earlier mock data
  cashier: string;
}

export interface Category {
  id: string;
  name: string;
  itemCount: number;
}
