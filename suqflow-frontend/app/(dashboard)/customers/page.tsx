"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, Bell, MoreHorizontal, Users, Plus, Loader2 } from "lucide-react";
import { CustomerDetailModal } from "@/components/customers/CustomerDetailModal";
import { DebtSettlementModal } from "@/components/customers/DebtSettlementModal";
import { Customer } from "@/types";

export default function CustomersPage() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Modal states
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);

  // Initialize as empty for production-readiness empty state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const endpoint = "/api/customers";
      const response = await fetch(endpoint, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      setCustomers(data.data || []);
    } catch (error) {
      console.error("Could not load customer data.", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="h-full flex flex-col p-8 gap-8 max-w-7xl mx-auto">
      {/* Top Navigation Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-1">Customer Directory</h1>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search customers..."
              className="bg-[#131313] border border-sidebar-border rounded-lg py-2.5 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:border-primary-light w-full sm:w-64 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="flex items-center gap-2 bg-[#131313] border border-sidebar-border hover:bg-white/5 rounded-lg px-4 py-2.5 text-sm text-foreground transition-colors"
            >
              <Calendar className="w-4 h-4 text-muted" />
              <span>Oct 2026</span>
            </button>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2.5 bg-[#131313] border border-sidebar-border rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#4D7019] rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1c1c1c] border border-sidebar-border rounded-2xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-shift-muted uppercase tracking-wider mb-2">Total Customers</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-foreground">0</h3>
            <span className="text-xs text-[#4d7019] mb-1 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
              +0% this month
            </span>
          </div>
        </div>

        <div className="bg-[#1c1c1c] border border-sidebar-border rounded-2xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-shift-muted uppercase tracking-wider mb-2">Total Outstanding Debt</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-red-400">ETB 0.00</h3>
            <span className="text-xs text-muted mb-1">0 active tabs</span>
          </div>
        </div>

        <div className="bg-[#1c1c1c] border border-sidebar-border rounded-2xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-shift-muted uppercase tracking-wider mb-2">New Customers</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-foreground">0</h3>
            <span className="text-xs text-muted mb-1">This month</span>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="flex-1 bg-[#1c1c1c] border border-sidebar-border rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Customer Roster</h2>
            <p className="text-xs text-muted mt-1">Manage accounts and settle outstanding shop credit (Liq / Nisiya).</p>
          </div>
        </div>
        
        {/* Empty State / Loading State */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-card">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-sm text-muted">Loading customer directory...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-card">
            <div className="w-20 h-20 bg-surface border border-sidebar-border rounded-full flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-muted" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No customers found</h3>
            <p className="text-sm text-muted max-w-md mb-8">
              Your directory is currently empty. Add your first customer to start tracking store credit and loyalty.
            </p>
            <button 
              className="bg-primary hover:bg-[#5c851e] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Customer
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#131313] text-[10px] uppercase text-shift-muted font-bold tracking-widest border-b border-sidebar-border">
                <tr>
                  <th className="px-8 py-4">Customer Name</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Current Balance</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sidebar-border text-foreground">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center text-sm font-bold text-[#4d7019]">
                          {customer.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{customer.name}</p>
                          <p className="text-[10px] text-muted mt-0.5">{customer.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      {customer.isOwed ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#93000A]/10 text-red-400 border border-[#93000A]/20">
                          {customer.status}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#4d7019]/10 text-[#4d7019] border border-[#4d7019]/20">
                          {customer.status}
                        </span>
                      )}
                    </td>
                    <td className={`px-8 py-4 text-right font-bold ${customer.isOwed ? 'text-red-400' : 'text-foreground'}`}>
                      {customer.balance}
                    </td>
                    <td className="px-8 py-4 text-right">
                      {customer.isOwed ? (
                        <button 
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setIsSettleModalOpen(true);
                          }}
                          className="inline-block px-4 py-1.5 text-xs font-medium bg-[#93000A] hover:bg-red-700 text-white rounded transition-colors shadow shadow-red-900/50"
                        >
                          Settle Debt
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-4 py-1.5 text-xs font-medium border border-sidebar-border hover:bg-white/5 text-muted hover:text-foreground rounded transition-colors"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CustomerDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        customer={selectedCustomer}
        onSettleDebt={(cust) => {
          setIsDetailModalOpen(false);
          setSelectedCustomer(cust);
          setIsSettleModalOpen(true);
        }}
      />
      
      <DebtSettlementModal 
        isOpen={isSettleModalOpen} 
        onClose={() => setIsSettleModalOpen(false)} 
        customer={selectedCustomer}
        onSuccess={fetchCustomers}
      />
    </div>
  );
}
