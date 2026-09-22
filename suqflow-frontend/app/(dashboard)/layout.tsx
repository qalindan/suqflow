"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { ShopProvider } from "@/contexts/ShopContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <ShopProvider>
      <div className="flex h-screen bg-background overflow-hidden relative">
        {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-sidebar-border absolute top-0 left-0 right-0 z-20">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L22 12L12 22L2 12L12 2Z" fill="#F0EAD4"/>
            <path d="M12 6L18 12L12 18L6 12L12 6Z" className="fill-surface"/>
            <path d="M12 9L15 12L12 15L9 12L12 9Z" fill="#F0EAD4"/>
          </svg>
          <h1 className="text-xl font-bold text-[#F0EAD4] tracking-wide">SUQFlow</h1>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="text-muted hover:text-[#F0EAD4] p-2 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto mt-[73px] md:mt-0 w-full relative z-10">
        {children}
      </main>
      </div>
    </ShopProvider>
  );
}
