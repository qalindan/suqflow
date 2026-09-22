"use client";

import { useState, useEffect } from "react";
import { Calendar, Search, Filter, ArrowUpRight, ReceiptText, Loader2 } from "lucide-react";
import Link from "next/link";
import { Transaction } from "@/types";

export default function SalesPage() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Initialize as empty for production-readiness empty state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const endpoint = "/api/transactions";
        const response = await fetch(endpoint, { credentials: "include" });
        if (!response.ok) {
          console.error(`Failed to fetch transactions: ${response.status}`);
          setTransactions([]);
          return;
        }
        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : (data.data || []));
      } catch (error) {
        console.error("Could not load transaction data.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const totalTransactions = transactions.length;
  const grossSales = transactions.reduce((acc, tx: any) => {
    // Only count SALES, ignore REFUND or EXPENSE for Gross Sales
    if (tx.type === "REFUND" || tx.type === "EXPENSE") return acc;
    return acc + parseFloat(tx.amount || tx.totalAmount || 0);
  }, 0);

  return (
    <div className="h-full flex flex-col p-8 gap-8 max-w-7xl mx-auto">
      {/* Top Navigation Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-1">Sales Reports</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative z-50">
            <button 
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="flex items-center gap-2 bg-[#131313] border border-sidebar-border hover:bg-white/5 rounded-lg px-4 py-2.5 text-sm text-foreground transition-colors"
            >
              <Calendar className="w-4 h-4 text-muted" />
              <span>Today</span>
            </button>
          </div>
        </div>
      </div>

      {/* V1.0 Lean Metrics Row (No Refunds) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1c1c1c] border border-sidebar-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-bold text-shift-muted uppercase tracking-wider">Gross Sales</p>
            <span className="flex items-center gap-1 text-xs text-[#4d7019] bg-[#4d7019]/10 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              0.0% vs yesterday
            </span>
          </div>
          <h3 className="text-4xl font-bold text-foreground">ETB {grossSales.toFixed(2)}</h3>
        </div>

        <div className="bg-[#1c1c1c] border border-sidebar-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-bold text-shift-muted uppercase tracking-wider">Total Transactions</p>
          </div>
          <h3 className="text-4xl font-bold text-foreground">{totalTransactions}</h3>
          <p className="text-xs text-muted mt-2">{transactions.reduce((acc, tx: any) => acc + (tx.items || 0), 0)} items sold today</p>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="flex-1 bg-[#1c1c1c] border border-sidebar-border rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-sidebar-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Transaction Ledger</h2>
            <p className="text-xs text-muted mt-1">Real-time log of all shop sales.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search Receipt ID..."
                className="bg-[#131313] border border-sidebar-border rounded-lg py-2 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:border-primary-light w-48 transition-colors"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 bg-[#131313] border border-sidebar-border hover:bg-white/5 rounded-lg px-4 py-2 text-sm text-foreground transition-colors"
              >
                <Filter className="w-4 h-4 text-muted" />
                <span>Filter</span>
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-sidebar-border rounded-lg shadow-xl py-1 z-50 flex flex-col">
                  <button onClick={() => setIsFilterOpen(false)} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface transition-colors">
                    All Transactions
                  </button>
                  <button onClick={() => setIsFilterOpen(false)} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface transition-colors">
                    Sales Only
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empty State / Loading State */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-card">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-sm text-muted">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-card">
            <div className="w-20 h-20 bg-surface border border-sidebar-border rounded-full flex items-center justify-center mb-6">
              <ReceiptText className="w-10 h-10 text-muted" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No transactions recorded</h3>
            <p className="text-sm text-muted max-w-md">
              There are no sales records for today yet. Transactions processed through the POS will automatically appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#131313] text-[10px] uppercase text-shift-muted font-bold tracking-widest border-b border-sidebar-border">
                <tr>
                  <th className="px-6 py-4">Receipt ID</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Cashier</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4 text-right">Amount (ETB)</th>
                  <th className="px-6 py-4 text-center">Type</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sidebar-border text-foreground">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{tx.id}</td>
                    <td className="px-6 py-4 text-muted">{tx.time}</td>
                    <td className="px-6 py-4">{tx.cashier}</td>
                    <td className="px-6 py-4">{tx.items} items</td>
                    <td className="px-6 py-4 text-right font-bold">{tx.amount}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#4d7019]/10 text-[#4d7019] border border-[#4d7019]/20">
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/receipts/${tx.id.replace('#', '')}`}
                        className="inline-block px-3 py-1.5 text-xs font-medium border border-sidebar-border hover:bg-white/5 text-muted hover:text-foreground rounded transition-colors"
                      >
                        View Receipt
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
