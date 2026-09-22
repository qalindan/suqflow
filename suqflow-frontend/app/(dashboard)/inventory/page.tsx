"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Plus, MoreHorizontal, PackageOpen, Pencil, Trash2, Package, FolderPlus, Loader2 } from "lucide-react";
import { ProductModal } from "@/components/inventory/ProductModal";
import { AdjustStockModal } from "@/components/inventory/AdjustStockModal";
import { DeleteProductModal } from "@/components/inventory/DeleteProductModal";
import { ManageCategoriesModal } from "@/components/categories/ManageCategoriesModal";
import { Product, Category } from "@/types";
import { toast } from "sonner";

export default function InventoryPage() {
  // Global State - INITIALIZED EMPTY for API-readiness
  const [inventoryData, setInventoryData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories from DB
        const catRes = await fetch("/api/categories", { credentials: "include" });
        if (catRes.ok) {
          const dbCategories = await catRes.json();
          setCategories(dbCategories.map((c: any) => ({ ...c, itemCount: 0 })));
        }

        // Fetch products
        const endpoint = `/api/inventory`; 
        const response = await fetch(endpoint, { credentials: "include" });
        if (!response.ok) {
           console.warn(`Failed to fetch products: ${response.status}`);
           setInventoryData([]);
           return;
        }
        
        const data = await response.json();
        
        const mappedData = (Array.isArray(data) ? data : (data.data || [])).map((product: any) => ({
          ...product,
          cost: "ETB " + (product.wholesale_cost || product.cost || 0),
          price: "ETB " + (product.retail_price || product.price || 0),
          stock: product.currentStock ?? product.current_stock ?? product.stock ?? 0,
          status: (product.currentStock ?? product.current_stock ?? product.stock ?? 0) > 10 ? "IN STOCK" : ((product.currentStock ?? product.current_stock ?? product.stock ?? 0) === 0 ? "OUT OF STOCK" : "LOW STOCK"),
          icon: Package
        }));
        
        setInventoryData(mappedData);

        // We don't dynamically extract categories anymore since they come from the DB
        setCategories(prev => {
          const newCategories = [...prev];
          
          // Update item counts based on products
          newCategories.forEach(cat => {
            cat.itemCount = mappedData.filter(p => p.category === cat.name).length;
          });
          
          return newCategories;
        });
      } catch (error) {
        console.warn("Could not load inventory data. Defaulting to empty state.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState<"add" | "edit">("add");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  const [isAdjustStockModalOpen, setIsAdjustStockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filter logic
  const filteredData = inventoryData.filter(item => {
    const matchesCategory = activeCategory === "All Categories" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Close dropdown menus
  const closeMenus = () => {
    setIsCategoryDropdownOpen(false);
    setOpenActionMenuId(null);
  };

  // Action Handlers
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setProductModalMode("edit");
    closeMenus();
    setIsProductModalOpen(true);
  };

  const handleAdjustStockClick = (product: Product) => {
    setSelectedProduct(product);
    closeMenus();
    setIsAdjustStockModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    closeMenus();
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col p-8 gap-6 max-w-7xl mx-auto relative">
      {/* Invisible backdrop for closing dropdowns */}
      {(isCategoryDropdownOpen || openActionMenuId !== null) && (
        <div className="fixed inset-0 z-40" onClick={closeMenus}></div>
      )}

      {/* Page Header */}
      <div className="relative z-20 flex items-center justify-between gap-4 border-b border-sidebar-border pb-6 max-md:flex-col max-md:items-start">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Inventory</h1>
          <h2 className="text-2xl font-semibold text-foreground">Management</h2>
        </div>

        <div className="flex items-center gap-3 max-md:flex-col max-md:w-full">
          <div className="relative max-md:w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="bg-surface border border-sidebar-border rounded-lg py-2 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:border-primary-light w-64 max-md:w-full transition-colors"
            />
          </div>

          <div className="relative z-50 max-md:w-full">
            <button 
              onClick={() => {
                setOpenActionMenuId(null);
                setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
              }}
              className="flex items-center gap-2 bg-surface border border-sidebar-border rounded-lg px-4 py-2 text-sm text-foreground hover:bg-white/5 transition-colors h-[54px] min-w-[120px] justify-between max-md:w-full"
            >
              <span className="text-xs text-left leading-tight">
                {activeCategory === "All Categories" ? <>All<br/>Categories</> : activeCategory}
              </span>
              <ChevronDown className="w-4 h-4 text-muted" />
            </button>
            
            {isCategoryDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-sidebar-border rounded-lg shadow-xl py-1 z-50 flex flex-col max-h-64 overflow-y-auto">
                {["All Categories", ...categories.map(c => c.name)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#131313] border border-sidebar-border hover:bg-white/5 text-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors h-[54px] max-md:w-full"
          >
            <FolderPlus className="w-4 h-4 text-muted" />
            <span className="text-left leading-tight">Manage<br/>Categories</span>
          </button>

          <button 
            onClick={() => {
              setSelectedProduct(null);
              setProductModalMode("add");
              setIsProductModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-[#5c851e] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors h-[54px] max-md:w-full"
          >
            <Plus className="w-4 h-4" />
            <span className="text-left leading-tight">Add New<br/>Product</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 bg-card rounded-xl border border-card-border flex flex-col relative overflow-hidden">
        
        {/* LOADING & EMPTY STATE HANDLING */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-sm text-muted">Loading inventory data...</p>
          </div>
        ) : inventoryData.length > 0 && filteredData.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-surface border border-sidebar-border rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-muted" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No results found for '{searchQuery}'</h3>
            <p className="text-sm text-muted max-w-md">
              We couldn't find any products matching your search criteria. Try adjusting your search term or category filter.
            </p>
          </div>
        ) : inventoryData.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-surface border border-sidebar-border rounded-full flex items-center justify-center mb-6">
              <PackageOpen className="w-10 h-10 text-muted" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No products found</h3>
            <p className="text-sm text-muted max-w-md mb-8">
              Your inventory is currently empty. Get started by adding your first product to the catalog to begin tracking stock and making sales.
            </p>
            <button 
              onClick={() => {
                setSelectedProduct(null);
                setProductModalMode("add");
                setIsProductModalOpen(true);
              }}
              className="bg-primary hover:bg-[#5c851e] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Product
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-auto flex-1 pb-32">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#1a1a1a] border-b border-sidebar-border text-xs uppercase text-muted font-medium">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-xl">PRODUCT NAME</th>
                    <th className="px-6 py-4">CATEGORY</th>
                    <th className="px-6 py-4">COST<br/><span className="text-[10px]">(WHOLESALE)</span></th>
                    <th className="px-6 py-4">PRICE (RETAIL)</th>
                    <th className="px-6 py-4 text-right">STOCK QTY</th>
                    <th className="px-6 py-4 text-center">STATUS</th>
                    <th className="px-6 py-4 rounded-tr-xl text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sidebar-border/50 text-shift-muted">
                  {filteredData.map((item) => {
                    const Icon = item.icon;
                    const isMenuOpen = openActionMenuId === item.id;
                    
                    return (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors relative">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-surface border border-sidebar-border flex items-center justify-center">
                              <Icon className="w-5 h-5 text-muted" />
                            </div>
                            <span className="font-medium text-foreground">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{item.category}</td>
                        <td className="px-6 py-4">{item.cost}</td>
                        <td className="px-6 py-4 font-medium text-foreground">{item.price}</td>
                        <td className={`px-6 py-4 text-right font-medium ${item.stock === 0 ? "text-red-500" : item.stock < 10 ? "text-orange-400" : "text-foreground"}`}>
                          {item.stock}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              item.status === "IN STOCK"
                                ? "bg-[#4d7019]/10 text-[#4d7019] border border-[#4d7019]/20"
                                : item.status === "LOW STOCK"
                                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                : "bg-[#93000A]/20 text-red-500 border border-[#93000A]/30"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center relative z-50">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsCategoryDropdownOpen(false);
                              setOpenActionMenuId(isMenuOpen ? null : item.id);
                            }}
                            className="text-muted hover:text-foreground transition-colors p-2 rounded-lg hover:bg-surface relative"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          
                          {/* Action Dropdown Menu */}
                          {isMenuOpen && (
                            <div className="absolute right-8 top-10 mt-1 w-40 bg-card border border-sidebar-border rounded-lg shadow-xl py-1 z-50 overflow-hidden flex flex-col">
                              <button 
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-surface transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClick(item);
                                }}
                              >
                                <Pencil className="w-4 h-4 text-muted" />
                                <span>Edit Product</span>
                              </button>
                              <button 
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-surface transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAdjustStockClick(item);
                                }}
                              >
                                <Package className="w-4 h-4 text-muted" />
                                <span>Adjust Stock</span>
                              </button>
                              <div className="w-full border-t border-sidebar-border my-1"></div>
                              <button 
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(item);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="bg-[#1a1a1a] border-t border-sidebar-border px-6 py-3 flex items-center justify-between text-xs text-muted mt-auto">
              <span>Showing {filteredData.length} of {inventoryData.length} items</span>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:text-foreground transition-colors">&lt;</button>
                <button className="p-1 hover:text-foreground transition-colors">&gt;</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Consolidated Product Modal (Add/Edit) */}
      <ProductModal 
        mode={productModalMode}
        isOpen={isProductModalOpen} 
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }} 
        categories={categories}
        initialData={selectedProduct}
        onSave={(productData) => {
          // If the backend returns the full object or if it falls back to payload, 
          // we need to safely extract wholesale_cost and retail_price
          const pData = productData.data || productData;
          
          const formattedCost = "ETB " + (pData.wholesale_cost || pData.cost?.replace("ETB ", "") || 0);
          const formattedPrice = "ETB " + (pData.retail_price || pData.price?.replace("ETB ", "") || 0);
          const currentStock = pData.current_stock ?? pData.stock ?? 0;
          
          if (productModalMode === "add") {
            const newProduct = {
              id: pData.id || Date.now().toString(),
              name: pData.name || "",
              category: pData.category || "",
              cost: formattedCost,
              price: formattedPrice,
              stock: currentStock,
              status: currentStock > 10 ? "IN STOCK" : (currentStock === 0 ? "OUT OF STOCK" : "LOW STOCK"),
              icon: Package
            };
            setInventoryData(prev => [newProduct, ...prev]);
          } else if (selectedProduct) {
            setInventoryData(prev => prev.map(p => 
              p.id === selectedProduct.id ? { 
                ...p, 
                name: pData.name || p.name,
                category: pData.category || p.category,
                cost: formattedCost,
                price: formattedPrice,
                stock: currentStock,
                status: currentStock > 10 ? "IN STOCK" : (currentStock === 0 ? "OUT OF STOCK" : "LOW STOCK")
              } : p
            ));
          }
          setIsProductModalOpen(false);
        }}
      />

      <ManageCategoriesModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onDeleteCategory={async (id) => {
          try {
            const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE', credentials: 'include' });
            if (!res.ok) throw new Error();
            setCategories(prev => prev.filter(c => c.id !== id));
            toast.success("Category deleted");
          } catch (e) {
            toast.error("Failed to delete category");
          }
        }}
        onAddCategory={async (name) => {
          try {
            const res = await fetch('/api/categories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name }),
              credentials: 'include'
            });
            if (!res.ok) {
              const err = await res.json();
              throw new Error(err.error || "Failed to add category");
            }
            const newCat = await res.json();
            setCategories(prev => [...prev, { id: newCat.id, name: newCat.name, itemCount: 0 }]);
            toast.success("Category added");
          } catch (e: any) {
            toast.error(e.message || "Failed to add category");
          }
        }}
      />

      {/* Adjust Stock Modal */}
      <AdjustStockModal 
        isOpen={isAdjustStockModalOpen} 
        onClose={() => {
          setIsAdjustStockModalOpen(false);
          setSelectedProduct(null);
        }} 
        product={selectedProduct}
        onConfirm={(newStock) => {
          setInventoryData(prev => prev.map(p => 
            p.id === selectedProduct?.id ? { ...p, stock: newStock } : p
          ));
          setIsAdjustStockModalOpen(false);
          setSelectedProduct(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteProductModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }} 
        product={selectedProduct}
        onConfirm={() => {
          setInventoryData(prev => prev.filter(p => p.id !== selectedProduct?.id));
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}
