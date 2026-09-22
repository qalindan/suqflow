import { useState } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddCashierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddCashierModal({ isOpen, onClose, onSuccess }: AddCashierModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    pin: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const endpoint = `/api/settings`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_CASHIER",
          payload: {
            full_name: formData.name,
            pin_code: formData.pin
          }
        }),
        credentials: "include"
      });

      if (!response.ok) {
        let errorMsg = "Failed to create cashier.";
        try {
          const errorData = await response.json();
          console.log(errorData);
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch (e) {
          console.log(response);
        }
        throw new Error(errorMsg);
      }
      
      toast.success("Cashier created successfully! System access is now active.");
      if (onSuccess) onSuccess();
      setFormData({ name: "", pin: "" });
      onClose();
    } catch (error: any) {
      console.log(error.response?.data || error);
      toast.error(error.message || "Failed to create cashier.");
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
          <h2 className="text-xl font-bold text-foreground">Create Cashier</h2>
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="text-muted hover:text-foreground transition-colors p-2 rounded-lg hover:bg-surface disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-shift-muted uppercase tracking-wider ml-1">Cashier Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              placeholder="e.g. Dawit H."
              className="w-full bg-[#131313] border border-sidebar-border rounded-lg py-2.5 px-3 text-sm text-foreground focus:outline-none focus:border-primary-light transition-colors disabled:opacity-50"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-shift-muted uppercase tracking-wider ml-1">Access PIN</label>
            <input
              type="password"
              maxLength={4}
              value={formData.pin}
              onChange={(e) => setFormData(prev => ({...prev, pin: e.target.value}))}
              placeholder="****"
              className="w-full bg-[#131313] border border-sidebar-border rounded-lg py-2.5 px-3 text-center tracking-[0.5em] font-mono text-sm text-foreground focus:outline-none focus:border-primary-light transition-colors disabled:opacity-50"
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
              Create Cashier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
