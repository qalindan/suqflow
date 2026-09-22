import { useState } from "react";
import { X, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RevokeAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  cashierId?: string;
  cashierName: string;
  onSuccess?: () => void;
}

export function RevokeAccessModal({ isOpen, onClose, cashierId, cashierName, onSuccess }: RevokeAccessModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRevoke = async () => {
    if (!cashierId) return;
    
    setIsSubmitting(true);
    try {
      const endpoint = `/api/cashiers/${cashierId}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to revoke access.");
      }
      
      toast.error(`Cashier access permanently terminated for ${cashierName}.`, {
        icon: <ShieldAlert className="w-4 h-4 text-red-500" />
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Revoke access error:", error.message || error);
      toast.error(error.message || "Failed to revoke access.");
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
      <div className="relative w-full max-w-[400px] bg-card rounded-2xl border border-sidebar-border shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            Revoke Access
          </h2>
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="text-muted hover:text-foreground transition-colors p-2 rounded-lg hover:bg-surface disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-foreground mb-4 leading-relaxed">
          Are you absolutely sure you want to revoke POS access for <span className="font-bold">{cashierName}</span>?
        </p>
        
        <div className="bg-[#93000A]/10 border border-[#93000A]/20 rounded-lg p-4 mb-6">
          <ul className="text-xs text-red-400 space-y-2 list-disc list-inside">
            <li>Their current session will be forcibly closed.</li>
            <li>Their PIN will be permanently invalidated.</li>
            <li>They will immediately lose the ability to process sales.</li>
          </ul>
        </div>

        <div className="flex gap-3 pt-2 border-t border-sidebar-border">
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg border border-sidebar-border text-sm font-medium text-foreground hover:bg-surface transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleRevoke}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg bg-[#93000A] hover:bg-red-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#93000A]/20 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirm Revocation
          </button>
        </div>
      </div>
    </div>
  );
}
