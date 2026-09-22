import { useState } from "react";
import { X, FolderPlus, Trash2, Plus } from "lucide-react";
import { Category } from "@/types";
import { CategoryModal } from "./CategoryModal";

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onDeleteCategory: (id: string) => void;
  onAddCategory: (name: string) => void;
}

export function ManageCategoriesModal({ isOpen, onClose, categories, onDeleteCategory, onAddCategory }: ManageCategoriesModalProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal Card */}
        <div className="relative w-full max-w-md bg-card rounded-2xl border border-sidebar-border shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface border border-sidebar-border flex items-center justify-center">
                <FolderPlus className="w-5 h-5 text-muted" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Manage Categories
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-muted hover:text-foreground transition-colors p-2 rounded-lg hover:bg-surface"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#131313] hover:bg-white/5 border border-sidebar-border border-dashed rounded-xl py-3 text-sm text-foreground transition-colors shrink-0 mb-4"
          >
            <Plus className="w-4 h-4 text-muted" />
            Add New Category
          </button>

          <div className="flex-1 overflow-y-auto min-h-[200px] border border-sidebar-border rounded-xl bg-[#131313]">
            {categories.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <p className="text-sm text-muted">No custom categories yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-sidebar-border">
                {categories.map((category) => (
                  <li key={category.id} className="flex justify-between items-center p-4 hover:bg-white/[0.02] transition-colors">
                    <span className="text-sm font-medium text-foreground">{category.name}</span>
                    <button 
                      onClick={() => onDeleteCategory(category.id)}
                      className="text-muted hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <CategoryModal
        mode="add"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(name) => {
          onAddCategory(name);
          setIsAddModalOpen(false);
        }}
      />
    </>
  );
}
