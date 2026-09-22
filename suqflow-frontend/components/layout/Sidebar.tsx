"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Box, BarChart3, Users, Settings, LogOut, Folder } from "lucide-react";
import { SignOutModal, SignOutAlert } from "./SignOutModal";
import { useShop } from "@/contexts/ShopContext";

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [showSignOutAlert, setShowSignOutAlert] = useState(false);

  const handleSignOutConfirm = async () => {
    setIsSignOutModalOpen(false);
    setShowSignOutAlert(true);
    
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    
    setTimeout(() => {
      setShowSignOutAlert(false);
      window.location.href = "/login";
    }, 1500);
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", href: "/inventory", icon: Box },
    { name: "Sales Reports", href: "/sales", icon: BarChart3 },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const { shopName } = useShop();
  const displayChar = shopName ? shopName.charAt(0).toUpperCase() : "S";

  return (
    <div className="w-64 h-full bg-surface border-r border-sidebar-border flex flex-col p-4">
      {/* Logo */}
      <div className="mb-10 mt-2 px-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L22 12L12 22L2 12L12 2Z" fill="#F0EAD4"/>
            <path d="M12 6L18 12L12 18L6 12L12 6Z" className="fill-surface"/>
            <path d="M12 9L15 12L12 15L9 12L12 9Z" fill="#F0EAD4"/>
          </svg>
          <h1 className="text-2xl font-bold text-[#F0EAD4] tracking-wide">SUQFlow</h1>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden text-muted hover:text-white p-1 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile / Bottom Area */}
      <div className="mt-auto border-t border-sidebar-border pt-4 px-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold flex-shrink-0 uppercase">
          {displayChar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-profile-name truncate">{shopName}</p>
          <button 
            onClick={() => setIsSignOutModalOpen(true)}
            className="text-xs text-muted hover:text-white transition-colors flex items-center gap-1 mt-0.5"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Modals & Alerts */}
      <SignOutModal 
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={handleSignOutConfirm}
      />
      
      <SignOutAlert 
        isVisible={showSignOutAlert}
        onClose={() => setShowSignOutAlert(false)}
      />
    </div>
  );
}
