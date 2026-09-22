import { useState } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { Customer } from "@/types";
import { toast } from "sonner";

interface DebtSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSuccess?: () => void;
}

export function DebtSettlementModal({ isOpen, onClose, customer, onSuccess }: DebtSettlementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !customer) return null;

  const handleSettle = async () => {
    setIsSubmitting(true);
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/customers/${customer.id}/settle`;
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        throw new Error("Failed to settle debt.");
      }
      
      toast.success(`Debt settled for ${customer.name}! Balance reconciled to ETB 0.00.`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to settle debt. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !isSubmitting && onClose()}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-[448px] bg-card rounded-2xl border border-sidebar-border shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#4D7019]/20 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#AAD471" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground">Confirm Debt Settlement</h2>
          <p className="text-sm text-muted mt-1">Reconcile outstanding balance</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl border border-sidebar-border p-4 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-sidebar-border">
            <span className="text-sm text-muted">Customer:</span>
            <span className="text-sm font-medium text-foreground">{customer.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-sidebar-border">
            <span className="text-sm text-muted">Phone:</span>
            <span className="text-sm font-medium text-foreground">{customer.phone}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-sm text-muted">Amount to Settle:</span>
            <span className="text-lg font-bold text-[#AAD471]">
              {customer.balance.replace("- ", "")}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted mb-8 leading-relaxed">
          Confirm payment of <span className="font-semibold text-foreground">{customer.balance.replace("- ", "")}</span> to clear the balance for <span className="font-semibold text-foreground">{customer.name}</span>? This will reconcile the internal ledger balance to <span className="font-semibold text-[#AAD471]">ETB 0.00</span>.
        </p>

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg border border-sidebar-border text-sm font-medium text-foreground hover:bg-surface transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSettle}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg bg-[#4D7019] hover:bg-[#5c851e] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-[#4D7019]/20"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Confirm Settlement
          </button>
        </div>
      </div>
    </div>
  );
}
