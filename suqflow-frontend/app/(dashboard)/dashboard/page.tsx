"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { TriangleAlert, ReceiptText, CheckCircle2, Loader2 } from "lucide-react";
import { Product, Transaction, Cashier } from "@/types";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    grossRevenue: "ETB 0.00",
    netProfit: "ETB 0.00",
    activeCashier: null as Cashier | null,
    todayTransactions: [] as Transaction[],
    lowStockProducts: [] as Product[]
  });

  const hours = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"];

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      setIsLoading(true);
      try {
        const endpoint = "/api/analytics/summary";
        const response = await fetch(endpoint, { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch dashboard metrics");
        const data = await response.json();
        
        setDashboardData({
          grossRevenue: data.grossRevenue || "ETB 0.00",
          netProfit: data.netProfit || "ETB 0.00",
          activeCashier: data.activeCashier || null,
          todayTransactions: data.todayTransactions || [],
          lowStockProducts: data.lowStockProducts || []
        });
      } catch (error) {
        console.error("Could not load dashboard data.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-sm text-muted">Loading dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Gross Revenue */}
        <article className="flex h-[140px] flex-col justify-between rounded-2xl border border-card-border bg-card p-[25px]">
          <p className="text-base leading-6 text-muted">Gross Revenue</p>
          <p className="text-[36px] font-bold leading-[54px] text-[#fdf8f5]">
            {dashboardData.grossRevenue}
          </p>
        </article>

        {/* Est. Net Profit */}
        <article className="flex h-[140px] flex-col justify-between rounded-2xl border border-card-border bg-card p-[25px]">
          <p className="text-base leading-6 text-muted">Est. Net Profit</p>
          <p className="text-[36px] font-bold leading-[54px] text-primary">
            {dashboardData.netProfit}
          </p>
        </article>

        {/* Cashier Shift */}
        <article className="relative flex h-[140px] flex-col justify-between overflow-hidden rounded-2xl border border-card-border bg-card p-[25px]">
          <p className="text-base leading-6 text-muted">Cashier Shift</p>
          {dashboardData.activeCashier ? (
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-semibold leading-9 text-[#fdf8f5]">Active</p>
              <p className="text-base leading-6 text-muted">
                {dashboardData.activeCashier.name} - Expected: {dashboardData.grossRevenue}
              </p>
              <span
                className="absolute top-4 right-4 size-3 rounded-full bg-[#4d7019] shadow-[0_0_8px_rgba(170,212,113,0.8)]"
                aria-label="Shift active"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-semibold leading-9 text-muted">No Active Shift</p>
              <p className="text-base leading-6 text-shift-muted">
                System is currently idle.
              </p>
              <span
                className="absolute top-4 right-4 size-3 rounded-full bg-sidebar-border"
                aria-label="Shift inactive"
              />
            </div>
          )}
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Hourly Sales Chart */}
        <article className="rounded-2xl border border-card-border bg-card p-[25px] xl:col-span-8 flex flex-col">
          <h3 className="mb-6 text-lg font-semibold leading-[27px] text-[#fdf8f5]">
            Hourly Sales
          </h3>
          <div className="relative h-[275px] overflow-hidden flex-1 flex flex-col justify-center">
            {dashboardData.todayTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-6 h-full border-2 border-dashed border-sidebar-border rounded-xl">
                <ReceiptText className="w-10 h-10 text-muted mb-4" />
                <p className="text-base text-muted font-medium">No sales data available for today.</p>
              </div>
            ) : (
              <>
                <Image
                  src="/images/hourly-sales.svg"
                  alt="Hourly sales trend"
                  width={561}
                  height={275}
                  className="h-[251px] w-full object-fill"
                  priority
                />
                <div className="absolute inset-x-2 bottom-0 flex justify-between text-base text-muted">
                  {hours.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </article>

        {/* Low Stock Alerts */}
        <article className="rounded-2xl border border-alert-border bg-card p-[25px] xl:col-span-4 flex flex-col">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-[19px] w-[22px] shrink-0 overflow-clip">
              <Image
                src="/images/alert-triangle.svg"
                alt=""
                width={22}
                height={19}
                className="size-full"
              />
            </span>
            <h3 className="text-lg font-semibold leading-[27px] text-[#fdf8f5]">
              Low Stock Alerts
            </h3>
          </div>
          
          <div className="flex-1 flex flex-col">
            {dashboardData.lowStockProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-sidebar-border rounded-xl">
                <CheckCircle2 className="w-10 h-10 text-[#4d7019]/50 mb-4" />
                <p className="text-base text-muted font-medium mb-1">All stock levels are healthy.</p>
                <p className="text-sm text-shift-muted">No items require immediate attention.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {dashboardData.lowStockProducts.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-[rgba(68,73,58,0.2)] bg-surface p-[17px]"
                  >
                    <span className="text-base leading-6 text-profile-name">
                      {item.name}
                    </span>
                    <span className="text-base font-bold leading-6 text-alert-text">
                      {item.stock} left
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
