import { useState } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ResetPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  cashierId?: string;
  cashierName: string;
  onSuccess?: () => void;
}

export function ResetPinModal({ isOpen, onClose, cashierId, cashierName, onSuccess }: ResetPinModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPin, setNewPin] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashierId) return;
    
    setIsSubmitting(true);
    try {
      const endpoint = `/api/cashiers/${cashierId}/pin`;
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: newPin }),
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Failed to update PIN.");
      }
      
      toast.success(`PIN updated successfully for ${cashierName}.`);
      setNewPin("");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update PIN.");
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
          <h2 className="text-xl font-bold text-foreground">Reset Cashier PIN</h2>
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="text-muted hover:text-foreground transition-colors p-2 rounded-lg hover:bg-surface disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted mb-4 leading-relaxed">
          Set a new 4-digit PIN for <span className="font-semibold text-foreground">{cashierName}</span>. This will invalidate their current PIN immediately.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-shift-muted uppercase tracking-wider ml-1">New 4-Digit PIN</label>
            <input
              type="password"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="****"
              className="w-full bg-[#131313] border border-sidebar-border rounded-lg py-3 px-3 text-center tracking-[0.5em] font-mono text-lg text-foreground focus:outline-none focus:border-primary-light transition-colors disabled:opacity-50"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-sidebar-border mt-4">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg border border-sidebar-border text-sm font-medium text-foreground hover:bg-surface transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg bg-[#4D7019] hover:bg-[#5c851e] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#4D7019]/20 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Confirm Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
