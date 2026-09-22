"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ShopContextType {
  shopName: string;
  setShopName: (name: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [shopName, setShopName] = useState<string>("Store Manager");

  useEffect(() => {
    const fetchShopIdentity = async () => {
      try {
        const endpoint = "/api/settings/shop-identity";
        const response = await fetch(endpoint, { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          if (data.shopName) {
            setShopName(data.shopName);
          }
        }
      } catch (error) {
        console.error("Could not fetch shop identity for context", error);
      }
    };
    fetchShopIdentity();
  }, []);

  return (
    <ShopContext.Provider value={{ shopName, setShopName }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
