"use client";

import { useState, useEffect } from "react";
import { Save, Store, ShieldAlert, KeyRound, MonitorSmartphone, Plus, Loader2, Eye, EyeOff } from "lucide-react";
import { AddCashierModal } from "@/components/settings/AddCashierModal";
import { RevokeAccessModal } from "@/components/settings/RevokeAccessModal";
import { ResetPinModal } from "@/components/settings/ResetPinModal";
import { Cashier } from "@/types";
import { toast } from "sonner";
import { useShop } from "@/contexts/ShopContext";

export default function SettingsPage() {
  const { setShopName: setGlobalShopName } = useShop();
  const [activeTab, setActiveTab] = useState("shop");
  
  // Settings Form State
  const [isSaving, setIsSaving] = useState(false);
  const [shopSettings, setShopSettings] = useState({
    shopName: "",
    currency: "",
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isLoadingShop, setIsLoadingShop] = useState(true);

  // Cashier Management State - EMPTY BY DEFAULT
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [isLoadingCashiers, setIsLoadingCashiers] = useState(true);
  const [revealedPins, setRevealedPins] = useState<number[]>([]);

  const togglePin = (id: number) => {
    setRevealedPins(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const fetchCashiers = async () => {
    setIsLoadingCashiers(true);
    try {
      const endpoint = "/api/settings";
      const response = await fetch(endpoint, { credentials: "include" });
      if (!response.ok) {
        console.warn(`Cashiers API returned ${response.status}. Defaulting to empty state.`);
        setCashiers([]);
        return;
      }
      const data = await response.json();
      
      const mappedCashiers = (data.iam_cashiers || []).map((c: any) => ({
        id: c.id,
        initials: c.full_name ? c.full_name.substring(0, 2).toUpperCase() : "CA",
        name: c.full_name || "Unknown Cashier",
        pin: c.pin_code || "****",
        updated: "Just now"
      }));

      setCashiers(mappedCashiers);
    } catch (error) {
      console.warn("Could not load cashier data. Defaulting to empty state.");
    } finally {
      setIsLoadingCashiers(false);
    }
  };

  useEffect(() => {
    const fetchShopIdentity = async () => {
      try {
        const endpoint = "/api/settings/shop-identity";
        const response = await fetch(endpoint, { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          setShopSettings({
            shopName: data.shopName || "",
            currency: data.currency || "ETB (Ethiopian Birr)",
          });
          if (data.shopName) {
            setGlobalShopName(data.shopName);
          }
        }
      } catch (error) {
        console.error("Could not fetch shop identity", error);
      } finally {
        setIsLoadingShop(false);
      }
    };
    
    fetchShopIdentity();
    fetchCashiers();
  }, []);

  // Modal States
  const [isAddCashierOpen, setIsAddCashierOpen] = useState(false);
  const [revokeModalCashier, setRevokeModalCashier] = useState<{id: number, name: string} | null>(null);
  const [resetPinModalCashier, setResetPinModalCashier] = useState<{id: number, name: string} | null>(null);

  const handleSaveShopSettings = async () => {
    setIsSaving(true);
    try {
      const endpoint = "/api/settings/shop-identity";
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shopSettings),
        credentials: "include"
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save settings");
      }
      toast.success("Shop settings updated successfully!");
      setGlobalShopName(shopSettings.shopName);
    } catch (e: any) {
      console.error("Save settings error:", e.message || e);
      toast.error(e.message || "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-8 gap-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-sidebar-border pb-6">
        <h1 className="text-3xl font-semibold text-foreground mb-1">System Settings</h1>
        <p className="text-sm text-muted">Configure your shop preferences and manage staff access.</p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-surface border border-sidebar-border rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("shop")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "shop" 
            ? "bg-card text-foreground shadow-sm border border-sidebar-border" 
            : "text-muted hover:text-foreground hover:bg-white/5"
          }`}
        >
          <Store className="w-4 h-4" />
          Shop Identity
        </button>
        <button
          onClick={() => setActiveTab("staff")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "staff" 
            ? "bg-card text-foreground shadow-sm border border-sidebar-border" 
            : "text-muted hover:text-foreground hover:bg-white/5"
          }`}
        >
          <MonitorSmartphone className="w-4 h-4" />
          Cashier Credentials
        </button>
      </div>

      <div className="flex-1 mt-2">
        {/* SHOP IDENTITY TAB */}
        {activeTab === "shop" && (
          <div className="bg-card border border-sidebar-border rounded-2xl p-8 max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-lg font-bold text-foreground mb-6">Store Information</h2>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-shift-muted uppercase tracking-wider ml-1">Registered Shop Name</label>
                <input
                  type="text"
                  value={shopSettings.shopName}
                  onChange={(e) => setShopSettings(prev => ({...prev, shopName: e.target.value}))}
                  className="w-full bg-[#131313] border border-sidebar-border rounded-lg py-3 px-4 text-sm text-foreground focus:outline-none focus:border-primary-light transition-colors"
                />
                <p className="text-xs text-muted mt-1 ml-1">This name will appear on printed customer receipts.</p>
              </div>

              <div className="flex flex-col gap-1.5 pb-4 border-b border-sidebar-border">
                <label className="text-[10px] font-bold text-shift-muted uppercase tracking-wider ml-1">Default Currency</label>
                <select
                  value={shopSettings.currency}
                  onChange={(e) => setShopSettings(prev => ({...prev, currency: e.target.value}))}
                  className="w-full bg-[#131313] border border-sidebar-border rounded-lg py-3 px-4 text-sm text-foreground focus:outline-none focus:border-primary-light transition-colors appearance-none"
                >
                  <option>ETB (Ethiopian Birr)</option>
                  <option>USD (US Dollar)</option>
                </select>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={handleSaveShopSettings}
                  disabled={isSaving}
                  className="bg-primary hover:bg-[#5c851e] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STAFF ACCESS TAB */}
        {activeTab === "staff" && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Active Cashiers</h2>
                <p className="text-xs text-muted mt-1">Manage POS access and 4-digit PIN codes.</p>
              </div>
              <button 
                onClick={() => setIsAddCashierOpen(true)}
                className="bg-primary hover:bg-[#5c851e] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow shadow-primary/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Cashier
              </button>
            </div>

            <div className="bg-card border border-sidebar-border rounded-2xl flex-1 flex flex-col overflow-hidden">
              
              {isLoadingCashiers ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                  <p className="text-sm text-muted">Loading cashiers...</p>
                </div>
              ) : cashiers.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 bg-surface border border-sidebar-border rounded-full flex items-center justify-center mb-6">
                    <MonitorSmartphone className="w-10 h-10 text-muted" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No active cashiers</h3>
                  <p className="text-sm text-muted max-w-md mb-8">
                    You haven't granted POS access to any staff members yet. Add a cashier and assign them a 4-digit PIN to get started.
                  </p>
                  <button 
                    onClick={() => setIsAddCashierOpen(true)}
                    className="bg-primary hover:bg-[#5c851e] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Cashier
                  </button>
                </div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#1a1a1a] border-b border-sidebar-border text-[10px] uppercase text-shift-muted font-bold tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Cashier Name</th>
                      <th className="px-6 py-4">Password</th>
                      <th className="px-6 py-4">Last PIN Update</th>
                      <th className="px-6 py-4 text-right">Credentials</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sidebar-border text-foreground">
                    {cashiers.map((cashier) => (
                      <tr key={cashier.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-surface border border-sidebar-border flex items-center justify-center text-xs font-bold text-muted">
                              {cashier.initials}
                            </div>
                            <span className="font-semibold">{cashier.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono bg-black/40 px-2 py-1 rounded text-muted tracking-widest min-w-[40px] text-center">
                              {revealedPins.includes(cashier.id) ? cashier.pin : "••••"}
                            </span>
                            <button 
                              onClick={() => togglePin(cashier.id)}
                              className="text-muted hover:text-foreground p-1 transition-colors"
                              title={revealedPins.includes(cashier.id) ? "Hide PIN" : "Reveal PIN"}
                            >
                              {revealedPins.includes(cashier.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted text-xs">
                          {cashier.updated}
                        </td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <button 
                            onClick={() => setResetPinModalCashier({ id: cashier.id, name: cashier.name })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-sidebar-border hover:bg-white/5 text-muted hover:text-foreground rounded transition-colors"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            Reset PIN
                          </button>
                          <button 
                            onClick={() => setRevokeModalCashier({ id: cashier.id, name: cashier.name })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#93000A]/10 hover:bg-[#93000A]/20 text-red-400 border border-[#93000A]/20 rounded transition-colors"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddCashierModal 
        isOpen={isAddCashierOpen} 
        onClose={() => setIsAddCashierOpen(false)} 
        onSuccess={fetchCashiers}
      />
      
      <RevokeAccessModal 
        isOpen={!!revokeModalCashier} 
        onClose={() => setRevokeModalCashier(null)}
        cashierId={revokeModalCashier?.id}
        cashierName={revokeModalCashier?.name || ""}
        onSuccess={fetchCashiers}
      />

      <ResetPinModal
        isOpen={!!resetPinModalCashier}
        onClose={() => setResetPinModalCashier(null)}
        cashierId={resetPinModalCashier?.id}
        cashierName={resetPinModalCashier?.name || ""}
        onSuccess={fetchCashiers}
      />
    </div>
  );
}
