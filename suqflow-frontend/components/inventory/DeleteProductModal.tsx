"use client";

import { useState } from "react";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProductData {
  id: string;
  name: string;
  category: string;
  cost: string;
  price: string;
  stock: number;
}

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductData | null;
  onConfirm?: () => void;
}

export function DeleteProductModal({ isOpen, onClose, product, onConfirm }: DeleteProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const endpoint = `/api/inventory?id=${product.id}`;
      
      const response = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Failed to delete product.");
      }
      
      if (onConfirm) {
        onConfirm();
      }
      toast.error(`Product "${product.name}" deleted.`, {
        icon: <Trash2 className="w-4 h-4 text-red-500" />
      });
      // onClose is handled by parent after state update
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product.");
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
      <div className="relative bg-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-alert-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Delete Product</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 pb-6">
          <p className="text-sm text-muted mb-6 leading-relaxed">
            Are you sure you want to delete <strong className="text-foreground">{product.name}</strong>? 
            This will permanently remove it from your inventory and the mobile POS catalog.
          </p>

          {/* Product Summary Card */}
          <div className="bg-[#131313] border border-[#2a2a2a] rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted">
                <span className="font-semibold text-foreground">SKU:</span> DEV-001 • <span className="font-semibold text-foreground">Category:</span> {product.category}
              </p>
              <p className="text-xs text-muted">
                Current Stock: <span className="font-semibold text-[#aad471]">{product.stock} units</span> ({product.price} / retail)
              </p>
            </div>
            <div className="bg-[#93000A]/20 border border-[#93000A]/30 text-red-500 text-[9px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" />
              Irreversible<br/>Action
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 flex items-center justify-end gap-3 border-t border-sidebar-border bg-[#1a1a1a]/50">
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-sidebar-border disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-[#ef4444] hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete Item
          </button>
        </div>
      </div>
    </div>
  );
}
