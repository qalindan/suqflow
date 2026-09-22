import { useState, useEffect } from "react";
import { X, Loader2, FolderPlus } from "lucide-react";
import { Category } from "@/types";
import { toast } from "sonner";

interface CategoryModalProps {
  mode: "add" | "edit";
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryName: string) => void;
  initialData?: Category | null;
}

export function CategoryModal({ mode, isOpen, onClose, onSave, initialData }: CategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name);
    } else {
      setName("");
    }
  }, [mode, initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(name);
      toast.success(`Category successfully ${mode === "add" ? "created" : "updated"}!`);
      // onClose is handled in parent after save
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !isSubmitting && onClose()}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-card rounded-2xl border border-sidebar-border shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#AAD471]/10 flex items-center justify-center">
              <FolderPlus className="w-5 h-5 text-[#AAD471]" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {isEdit ? "Edit Category" : "New Category"}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-muted hover:text-foreground transition-colors p-2 rounded-lg hover:bg-surface disabled:opacity-50"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-shift-muted uppercase tracking-wider ml-1">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dairy Products"
              className="w-full bg-[#131313] border border-sidebar-border rounded-lg py-2.5 px-3 text-sm text-foreground focus:outline-none focus:border-primary-light transition-colors disabled:opacity-50"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-2 border-t border-sidebar-border">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-sidebar-border text-sm font-medium text-foreground hover:bg-surface transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-[#5c851e] text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
