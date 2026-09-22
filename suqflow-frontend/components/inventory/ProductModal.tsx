import { useState, useEffect } from "react";
import { X, Loader2, Clock, Camera } from "lucide-react";
import { Product, Category } from "@/types";
import { toast } from "sonner";

interface ProductModalProps {
  mode: "add" | "edit";
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  initialData?: Product | null;
  onSave?: (product: Partial<Product>) => void;
}

export function ProductModal({ mode, isOpen, onClose, categories, initialData, onSave }: ProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Local form state
  const [formData, setFormData] = useState({
    name: "",
    category: "Beverages",
    cost: "",
    price: "",
    stock: "",
    threshold: "5",
    unit: "units"
  });

  // Pre-fill when in edit mode
  useEffect(() => {
    setImagePreview(null);
    if (mode === "edit" && initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        cost: initialData.cost.replace("ETB ", ""),
        price: initialData.price.replace("ETB ", ""),
        stock: initialData.stock.toString(),
        threshold: "5", // Default or extract if it existed in Product type
        unit: "units"
      });
    } else {
      setFormData({
        name: "",
        category: "Beverages",
        cost: "",
        price: "",
        stock: "",
        threshold: "5",
        unit: "units"
      });
    }
  }, [mode, initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const endpoint = "/api/inventory";
      const method = mode === "add" ? "POST" : "PUT";
      
      const payload = {
        name: formData.name,
        category: formData.category,
        uom: formData.unit,
        wholesale_cost: parseFloat(formData.cost) || 0,
        retail_price: parseFloat(formData.price) || 0,
        current_stock: parseInt(formData.stock) || 0,
      };

      if (mode === "edit" && initialData) {
        // If editing, append ID to payload
        // @ts-ignore
        payload.id = initialData.id; 
      }

      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to ${mode === "add" ? "add" : "update"} product.`);
      }

      // We still call onSave so the local UI updates instantly without a full page refresh
      if (onSave) {
        const responseData = await response.json().catch(() => payload); // fallback if no json
        // responseData is the product object itself, not wrapped in a data property
        onSave(responseData || payload);
      }
      
      toast.success(`Product successfully ${mode === "add" ? "added" : "updated"}!`);
      // onClose handled in parent when onSave is present to sync state
    } catch (error: any) {
      toast.error(error.message || "An error occurred. Please try again.");
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
      <div className="relative w-full max-w-md bg-card rounded-2xl border border-sidebar-border shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button 
            onClick={onClose} 
            className="text-muted hover:text-foreground transition-colors p-2 rounded-lg hover:bg-surface disabled:opacity-50"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-shift-muted uppercase tracking-wider ml-1">Product Image (Optional)</label>
            <label className="relative flex flex-col items-center justify-center w-24 h-24 rounded-lg border-2 border-dashed border-sidebar-border bg-[#131313] hover:bg-white/5 transition-colors cursor-pointer overflow-hidden group">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                  }
                }} 
                disabled={isSubmitting} 
              />
              
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="w-6 h-6 text-muted mb-1 group-hover:text-foreground transition-colors" />
                  <span className="text-[10px] text-muted font-medium group-hover:text-foreground transition-colors">Add Photo</span>
                </>
              )}
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-shift-muted uppercase tracking-wider ml-1">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              placeholder="e.g. Habesha Beer"
              className="w-full bg-[#131313] border border-sidebar-border rounded-lg py-2.5 px-3 text-sm text-foreground focus:outline-none focus:border-primary-light transition-colors disabled:opacity-50"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-shift-muted uppercase tracking-wider ml-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
              className="w-full bg-[#131313] border border-sidebar-border rounded-lg py-2.5 px-3 text-sm text-foreground focus:outline-none focus:border-primary-light transition-colors appearance-none disabled:opacity-50"
              disabled={isSubmitting}
            >
              {categories.length === 0 ? (
                <option value="" disabled>No categories available</option>
              ) : (
                categories.map(cat => (
                  <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-shift-muted uppercase tracking-wider ml-1">Cost (ETB)</label>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData(prev => ({...prev, cost: e.target.value}))}
                placeholder="0.00"
                className="w-full bg-[#131313] border border-sidebar-border rounded-lg py-2.5 px-3 text-sm text-foreground focus:outline-none focus:border-primary-light transition-colors disabled:opacity-50"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-shift-muted uppercase tracking-wider ml-1">Retail Price (ETB)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
                placeholder="0.00"
                className="w-full bg-[#131313] border border-sidebar-border rounded-lg py-2.5 px-3 text-sm text-foreground focus:outline-none focus:border-primary-light transition-colors disabled:opacity-50"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pb-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-shift-muted uppercase tracking-wider ml-1">Initial Stock Qty <span className="text-red-400">*</span></label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({...prev, stock: e.target.value}))}
                  placeholder="0"
                  className="w-full bg-[#131313] border border-sidebar-border rounded-lg py-2.5 pl-3 pr-20 text-sm text-foreground focus:outline-none focus:border-primary-light transition-colors disabled:opacity-50"
                  required
                  disabled={isSubmitting}
                />
                <select 
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({...prev, unit: e.target.value}))}
                  className="absolute right-0 top-0 bottom-0 bg-transparent border-l border-sidebar-border text-muted text-xs px-2 focus:outline-none appearance-none cursor-pointer rounded-r-lg hover:bg-white/5"
                  disabled={isSubmitting}
                >
                  <option value="units">units</option>
                  <option value="kg">kg</option>
                  <option value="pcs">pcs</option>
                  <option value="dozen">dozen</option>
                  <option value="box">box</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-shift-muted uppercase tracking-wider ml-1">Low Stock Threshold</label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.threshold}
                  onChange={(e) => setFormData(prev => ({...prev, threshold: e.target.value}))}
                  placeholder="5"
                  className="w-full bg-[#131313] border border-sidebar-border rounded-lg py-2.5 pl-3 pr-12 text-sm text-foreground focus:outline-none focus:border-primary-light transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted pointer-events-none">
                  {formData.unit}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-1 mb-2">
            <Clock className="w-3.5 h-3.5 text-[#AAD471]" />
            <p className="text-[11px] text-muted">Changes sync automatically across all active POS systems.</p>
          </div>

          <div className="flex gap-3 pt-2 border-t border-sidebar-border mt-4">
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
              className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-[#5c851e] text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
