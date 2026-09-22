"use client";

import { X, ChevronDown, Plus, Minus, RefreshCcw, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProductData {
  id: string;
  name: string;
  category: string;
  cost: string;
  price: string;
  stock: number;
}

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductData | null;
  onConfirm?: (newStock: number) => void;
}

export function AdjustStockModal({ isOpen, onClose, product, onConfirm }: AdjustStockModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add");
  const [quantity, setQuantity] = useState<number>(20);

  if (!isOpen || !product) return null;

  const currentStock = product.stock;
  const newStock = adjustmentType === "add" ? currentStock + quantity : Math.max(0, currentStock - quantity);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/inventory`;
      
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id: product.id,
          current_stock: newStock
        })
      });

      if (!response.ok) {
        throw new Error("Failed to adjust stock.");
      }

      if (onConfirm) {
        const responseData = await response.json().catch(() => null);
        onConfirm(responseData?.data?.stock ?? newStock);
      }
      
      toast.success(`Stock adjusted for "${product.name}". New total: ${newStock}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to adjust stock.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Backdrop (click to close if not submitting) */}
      <div 
        className="absolute inset-0"
        onClick={() => !isSubmitting && onClose()}
      ></div>
      {/* Modal Container */}
      <div className="relative bg-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-card-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-foreground">Adjust Stock</h2>
            <span className="bg-[#4d7019]/20 text-[#aad471] border border-[#4d7019]/30 text-[10px] px-2 py-0.5 rounded-full font-medium">
              Restock
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 pb-6 pt-1">
          <p className="text-sm text-muted">
            <strong className="text-foreground">{product.name}</strong> • Current Stock: <strong className="text-foreground">{currentStock} units</strong>
          </p>
        </div>

        {/* Form Content */}
        <div className="px-6 pb-6 space-y-5">
          {/* Adjustment Type Toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-shift-muted uppercase tracking-wider">
              Adjustment Type
            </label>
            <div className="flex p-1 bg-[#131313] rounded-lg border border-[#2a2a2a]">
              <button 
                onClick={() => setAdjustmentType("add")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  adjustmentType === "add" ? "bg-primary text-white" : "text-muted hover:text-foreground"
                }`}
              >
                <Plus className="w-4 h-4" /> Add Stock
              </button>
              <button 
                onClick={() => setAdjustmentType("remove")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  adjustmentType === "remove" ? "bg-[#2a2a2a] text-white" : "text-muted hover:text-foreground"
                }`}
              >
                <Minus className="w-4 h-4" /> Remove Stock
              </button>
            </div>
          </div>

          {/* Quantity to Adjust */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-shift-muted uppercase tracking-wider">
              Quantity to Adjust <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 flex items-center justify-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-muted hover:text-foreground hover:bg-[#2a2a2a] transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="relative flex-1">
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-[#131313] border border-[#2a2a2a] rounded-lg h-11 px-4 text-center text-sm font-medium text-foreground focus:outline-none focus:border-primary-light transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted pointer-events-none">units</span>
              </div>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-11 flex items-center justify-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-muted hover:text-foreground hover:bg-[#2a2a2a] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* New Stock Total display */}
            <div className="mt-2 flex items-center justify-between p-3 bg-[#131313]/50 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <RefreshCcw className="w-3 h-3 text-primary-light" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">New Stock Total</p>
                  <p className="text-[10px] text-muted">{currentStock} existing {adjustmentType === "add" ? "+" : "-"} {quantity} {adjustmentType === "add" ? "added" : "removed"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-primary-light">{newStock} <span className="text-xs font-normal text-muted">units</span></p>
              </div>
            </div>
          </div>

          {/* Reason for adjustment */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-shift-muted uppercase tracking-wider">
              Reason for adjustment
            </label>
            <div className="relative">
              <select className="w-full bg-[#131313] border border-[#2a2a2a] rounded-lg py-2.5 px-4 text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:border-primary-light transition-colors">
                <option value="restock">Restock / Supplier Delivery</option>
                <option value="damage">Damaged Goods</option>
                <option value="loss">Inventory Loss / Shrinkage</option>
                <option value="correction">Count Correction</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>
          </div>
          
          {/* Info Text */}
          <div className="flex items-center gap-2 pt-2">
            <RefreshCcw className="w-3.5 h-3.5 text-primary-light" />
            <span className="text-xs text-muted">Stock update applies instantly to all connected mobile POS checkout counters.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 flex items-center justify-end gap-3 border-t border-sidebar-border bg-[#1a1a1a]/50">
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-sidebar-border disabled:opacity-50"
          >
            CANCEL
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-primary hover:bg-[#5c851e] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />} 
            CONFIRM ADJUSTMENT
          </button>
        </div>
      </div>
    </div>
  );
}
