"use client";

import { useState, useEffect } from "react";
import { ChevronDown, TriangleAlert, ReceiptText, CheckCircle2, Loader2 } from "lucide-react";
import { Product, Transaction, Cashier } from "@/types";

export default function DashboardOverview() {
  const [todayTransactions, setTodayTransactions] = useState<Transaction[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [activeCashier, setActiveCashier] = useState<Cashier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({ revenue: 0, expenses: 0 });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch transactions
        const txRes = await fetch(`/api/transactions`);
        const txData = txRes.ok ? await txRes.json() : [];
        const transactions = Array.isArray(txData) ? txData : (txData.data || []);
        
        // Fetch products
        const prodRes = await fetch(`/api/inventory`);
        const prodData = prodRes.ok ? await prodRes.json() : [];
        const products = Array.isArray(prodData) ? prodData : (prodData.data || []);

        setTodayTransactions(transactions);

        // Calculate KPIs
        let revenue = 0;
        let expenses = 0; // Or Cost of Goods Sold / Profit, based on instructions "Total Revenue, Total Expenses"
        transactions.forEach((tx: any) => {
          const amount = parseFloat(tx.amount || tx.totalAmount || 0);
          if (tx.type === "EXPENSE" || tx.type === "REFUND") {
             expenses += amount;
          } else {
             revenue += amount;
          }
        });
        setMetrics({ revenue, expenses });

        // Filter low stock
        const lowStockThreshold = 10;
        const lowStock = products.filter((p: any) => {
          const stock = p.currentStock ?? p.current_stock ?? p.stock ?? 0;
          return stock <= lowStockThreshold;
        }).map((p: any) => ({
          ...p,
          stock: p.currentStock ?? p.current_stock ?? p.stock ?? 0
        }));
        setLowStockProducts(lowStock);
        
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-full flex flex-col p-8 gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Financial Overview</h1>
        <button className="flex items-center gap-2 bg-surface border border-sidebar-border rounded-full px-4 py-2 text-sm text-foreground hover:bg-white/5 transition-colors">
          <span>Today</span>
          <ChevronDown className="w-4 h-4 text-muted" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-sm text-muted">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gross Revenue */}
            <div className="bg-card border border-card-border rounded-2xl p-6 shadow-lg flex flex-col gap-2">
              <h3 className="text-sm text-muted font-medium">Gross Revenue</h3>
              <p className="text-3xl font-semibold text-foreground">ETB {metrics.revenue.toFixed(2)}</p>
            </div>

            {/* Total Expenses */}
            <div className="bg-card border border-card-border rounded-2xl p-6 shadow-lg flex flex-col gap-2">
              <h3 className="text-sm text-muted font-medium">Total Expenses</h3>
              <p className="text-3xl font-semibold text-red-400">ETB {metrics.expenses.toFixed(2)}</p>
            </div>

            {/* Cashier Shift */}
            <div className="bg-card border border-card-border rounded-2xl p-6 shadow-lg flex flex-col gap-2 relative overflow-hidden">
              {activeCashier ? (
                <>
                  <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-[#4d7019] shadow-[0_0_8px_rgba(170,212,113,0.8)]"></div>
                  <h3 className="text-sm text-muted font-medium">Cashier Shift</h3>
                  <p className="text-2xl font-semibold text-foreground">Active</p>
                  <p className="text-xs text-muted mt-1">{activeCashier.name} - Expected: ETB 0.00</p>
                </>
              ) : (
                <>
                  <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-sidebar-border"></div>
                  <h3 className="text-sm text-muted font-medium">Cashier Shift</h3>
                  <p className="text-2xl font-semibold text-muted">No Active Shift</p>
                  <p className="text-xs text-shift-muted mt-1">System is currently idle.</p>
                </>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
            {/* Hourly Sales Chart (Empty State) */}
            <div className="lg:col-span-2 bg-card border border-card-border rounded-2xl p-6 shadow-lg flex flex-col">
              <h3 className="text-sm text-foreground font-medium mb-6">Hourly Sales</h3>
              <div className="flex-1 relative min-h-[250px] flex items-center justify-center border-2 border-dashed border-sidebar-border rounded-xl">
                {todayTransactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-6">
                    <ReceiptText className="w-8 h-8 text-muted mb-3" />
                    <p className="text-sm text-muted">No sales data available for today.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6">
                    <ReceiptText className="w-8 h-8 text-[#4d7019] mb-3" />
                    <p className="text-sm text-foreground">{todayTransactions.length} transactions recorded today.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-card border border-card-border rounded-2xl p-6 shadow-lg flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <TriangleAlert className="w-5 h-5 text-muted" />
                <h3 className="text-sm text-foreground font-medium">Low Stock Alerts</h3>
              </div>
              
              <div className="flex-1 flex flex-col gap-4">
                {lowStockProducts.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-sidebar-border rounded-xl">
                    <CheckCircle2 className="w-8 h-8 text-[#4d7019]/50 mb-3" />
                    <p className="text-sm text-muted font-medium">All stock levels are healthy.</p>
                    <p className="text-xs text-shift-muted mt-1">No items require immediate attention.</p>
                  </div>
                ) : (
                  lowStockProducts.map((product) => (
                    <div key={product.id} className="flex justify-between items-center bg-[#131313] p-3 rounded-xl border border-sidebar-border">
                      <span className="text-sm text-muted font-medium">{product.name}</span>
                      <span className="text-sm text-red-400 font-bold">{product.stock} left</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
