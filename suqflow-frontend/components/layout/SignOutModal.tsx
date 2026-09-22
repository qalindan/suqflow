import { LogOut, AlertCircle, CheckCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SignOutModal({ isOpen, onClose, onConfirm }: SignOutModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-[420px] bg-[#1a1a1a] rounded-2xl border border-sidebar-border shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 shrink-0 rounded-xl bg-[#93000A]/10 flex items-center justify-center border border-[#93000A]/20">
            <LogOut className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Sign Out of Dashboard?</h2>
            <p className="text-xs text-muted mt-1 font-medium">POS Session ID #TB-8842</p>
          </div>
        </div>

        <p className="text-sm text-foreground mb-4">
          You will need to log in again to access shop analytics, customer records, and inventory controls.
        </p>

        <div className="bg-[#131313] border border-sidebar-border rounded-lg p-3 flex items-start gap-3 mb-6">
          <AlertCircle className="w-4 h-4 text-[#AAD471] shrink-0 mt-0.5" />
          <p className="text-xs text-muted leading-relaxed">
            Active sessions and offline sync nodes will remain uninterrupted.
          </p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-sidebar-border text-sm font-medium text-foreground hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg bg-[#ffb3b3] hover:bg-[#ff9999] text-[#93000A] text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function SignOutAlert({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isVisible || !mounted) return null;

  return createPortal(
    <div className="fixed top-6 right-6 z-[110] animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-[#1a1a1a] border border-sidebar-border rounded-xl shadow-2xl p-4 flex items-start gap-3 max-w-[340px]">
        <div className="w-6 h-6 shrink-0 rounded-full bg-[#4D7019] flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-[#AAD471]" />
        </div>
        <div className="flex-1 mr-4">
          <p className="text-sm font-bold text-foreground">Successfully signed out.</p>
          <p className="text-xs text-muted mt-1">Session closed. Redirecting to Owner Portal...</p>
        </div>
        <button onClick={onClose} className="text-muted hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body
  );
}
