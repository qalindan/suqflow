"use client";

import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

const titles: Record<string, string> = {
  "/dashboard": "Financial Overview",
  "/inventory": "Inventory Management",
  "/sales": "Sales Reports",
  "/customers": "Customers",
  "/settings": "Settings",
};

export function Header() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "SuqFlow";

  return (
    <header className="sticky top-0 z-10 flex h-24 items-center justify-between bg-[rgba(18,18,18,0.9)] px-8 py-6 backdrop-blur-[6px]">
      <h2 className="text-[32px] font-bold leading-12 text-[#fdf8f5]">{title}</h2>
      <button
        type="button"
        className="flex items-center gap-2 rounded-full border border-date-border bg-card px-[17px] py-[9px] text-base text-[#fdf8f5] transition-colors hover:bg-[#2e2e32]"
      >
        Today, Aug 21
        <ChevronDown size={12} strokeWidth={2.5} aria-hidden className="opacity-80" />
      </button>
    </header>
  );
}
