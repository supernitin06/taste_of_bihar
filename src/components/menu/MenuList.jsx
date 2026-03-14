// src/components/menu/MenuList.jsx - PREMIUM BIHAR VERSION
import React, { useEffect, useState, useMemo } from "react";
import {
  Check,
  Star,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  ImageOff,
  X,
  Package,
  ArrowRight,
  Zap,
} from "lucide-react";
import EditMenuModal from "./EditMenuModal";
import { showPromiseToast } from "../../utils/toastAlert";
import ConfirmationModal from "../ui/ConfirmationModal";
import toast from "react-hot-toast";

import Button from "../ui/Button";
import {
  useDeleteMenuMutation,
  useUpdateMenuMutation,
  useUpdateMenuStockStatusMutation,
  useToggleCategoryStatusMutation,
} from "../../api/services/menuApi";

// ===== REUSABLE COMPONENTS =====

const VegNonVegIcon = ({ isVeg }) => (
  <div
    className={`w-6 h-6 flex items-center justify-center border-2 rounded-md ${isVeg ? "border-green-600 bg-green-50/50" : "border-red-600 bg-red-50/50"
      } shadow-sm transition-transform hover:scale-110`}
  >
    <div
      className={`w-3 h-3 rounded-full ${isVeg ? "bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.5)]" : "bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]"
        }`}
    ></div>
  </div>
);

const BestsellerTag = () => (
  <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg animate-pulse ring-2 ring-white/20">
    <Star className="w-3 h-3 fill-white" />
    <span>Bestseller</span>
  </div>
);

const MadhubaniPattern = () => (
  <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none transform translate-x-10 -translate-y-10 group-hover:opacity-[0.07] transition-opacity duration-700">
    <svg viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 0 L100 50 L50 100 L0 50 Z" />
      <circle cx="50" cy="50" r="20" />
      <path d="M20 20 L80 80 M80 20 L20 80" stroke="currentColor" strokeWidth="2" />
    </svg>
  </div>
);

const ToggleSwitch = ({ checked, onChange, label }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onChange();
    }}
    className={`flex items-center gap-2.5 group whitespace-nowrap`}
    title={label}
  >
    <div
      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300 focus:outline-none ring-offset-2 ring-primary/20 hover:ring-2 ${checked ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "bg-gray-400"
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xl transition-all duration-300 ${checked ? "translate-x-7" : "translate-x-1"
          }`}
      />
    </div>
    {label && (
      <span className={`text-[13px] font-bold tracking-tight transition-colors ${checked ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}>
        {label}
      </span>
    )}
  </button>
);

// ===== MAIN COMPONENT =====

const MenuList = ({
  menus,
  isLoading,
  isError,
  error,
  searchTerm = "",
  statusFilter = "all",
  viewType = "grid",
}) => {
  const [editItem, setEditItem] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [toggleCategoryStatus] = useToggleCategoryStatusMutation();

  const [deleteMenu] = useDeleteMenuMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [updateMenu] = useUpdateMenuMutation();
  const [updateMenuStockStatus] = useUpdateMenuStockStatusMutation();

  // Initialize all categories as expanded
  useEffect(() => {
    if (menus && menus.length > 0) {
      const initialExpanded = {};
      menus.forEach(menu => {
        menu.categories.forEach(cat => {
          initialExpanded[cat.categoryId] = true;
        });
      });
      setExpandedCategories(initialExpanded);
    }
  }, [menus]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleCategoryToggle = async (category) => {
    const nextStatus = category.status === "active" ? "inactive" : "active";
    try {
      await showPromiseToast(toggleCategoryStatus({
        categoryId: category.categoryId,
        status: nextStatus,
      }).unwrap(), {
        loading: "Updating category status...",
        success: `Category ${nextStatus === 'active' ? 'enabled' : 'disabled'}`,
        error: "Failed to update category",
      });
      category.status = nextStatus;
    } catch (err) {
      console.error("Category toggle failed:", err);
    }
  };

  const handleDeleteClick = (itemId) => {
    setItemToDelete(itemId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await showPromiseToast(deleteMenu(itemToDelete).unwrap(), {
        loading: "Deleting item...",
        success: "Item deleted successfully.",
        error: "Failed to delete item.",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleEditSave = React.useCallback(
    async (updatedItem) => {
      await updateMenu({
        id: updatedItem.itemId,
        payload: {
          name: updatedItem.name,
          basePrice: updatedItem.price,
          isAvailable: updatedItem.available,
        },
      });
      setEditItem(null);
    },
    [updateMenu]
  );

  const filteredMenus = useMemo(() => {
    if (!menus) return [];
    return menus.map((menu) => {
      const filteredCategories = menu.categories
        .map((category) => {
          const filteredSubCategories = category.subCategories
            .map((subCat) => {
              const filteredItems = subCat.items.filter((item) => {
                const name = item.name || "";
                const matchesSearch = name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase());
                const matchesStatus =
                  statusFilter === "all" ||
                  (statusFilter === "available" && item.available) ||
                  (statusFilter === "unavailable" && !item.available) ||
                  (statusFilter === "bestseller" && item.bestseller);
                return matchesSearch && matchesStatus;
              });
              return { ...subCat, items: filteredItems };
            })
            .filter((subCat) => subCat.items.length > 0);
          return { ...category, subCategories: filteredSubCategories };
        })
        .filter((category) => category.subCategories.length > 0);
      return { ...menu, categories: filteredCategories };
    });
  }, [menus, searchTerm, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-6 animate-fade-in">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-8 h-8 text-primary animate-bounce" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-black text-gray-800 dark:text-gray-100">Preparing Perfection</h3>
          <p className="text-gray-500 mt-2">Savoring the Bihar flavors...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-3xl animate-scaleIn">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-red-600 shadow-xl shadow-red-200 dark:shadow-none flex items-center justify-center">
            <X className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-black text-2xl text-red-900 dark:text-red-400 uppercase tracking-tight">
              Deliciously Unavailable
            </h3>
            <p className="text-red-600 dark:text-red-300 mt-1 font-medium">
              {error?.data?.message || "Something went wrong. Let's try again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {filteredMenus.map((menu) =>
        menu.categories.map((category) => (
          <div
            key={category.categoryId}
            className="group/cat animate-fade-in"
          >
            {/* Category Header - PREMIUM STYLING */}
            <div
              className={`flex flex-col md:flex-row justify-between items-start md:items-center px-8 py-6 mb-4 cursor-pointer glass-vibrant rounded-3xl transition-all duration-500 hover:shadow-[0_10px_40px_-15px_rgba(211,47,47,0.3)] border-l-[6px] ${category.status === 'active' ? 'border-primary' : 'border-gray-400'}`}
              onClick={() => toggleCategory(category.categoryId)}
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-primary/10 transition-colors ${category.status === 'active' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {category.name?.[0] || "?"}
                </div>
                <div>
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                      {category.name || "Unnamed Category"}
                    </h2>
                    {category.status === "active" && (
                      <span className="flex h-4 w-4 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white shadow-sm"></span>
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    {category.subCategories.reduce((t, s) => t + s.items.length, 0)} Items Curated
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 md:mt-0">
                <ToggleSwitch
                  checked={category.status === "active"}
                  onChange={() => handleCategoryToggle(category)}
                  label={category.status === "active" ? "KITCHEN OPEN" : "CLOSED"}
                />
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/80 dark:bg-gray-700/80 shadow-inner group-hover/cat:bg-primary group-hover/cat:text-white transition-all duration-300 ${expandedCategories[category.categoryId] ? 'rotate-180 bg-primary text-white' : ''}`}>
                  <ChevronDown className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Category Items - Collapsible */}
            {expandedCategories[category.categoryId] && (
              <div className="mt-6 space-y-10 animate-slide-up">
                {category.subCategories.map((subCat) => (
                  <div key={subCat.subCategoryId} className="relative">
                    {category.subCategories.length > 1 && (
                      <div className="flex items-center gap-4 px-4 mb-8">
                        <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                        <h3 className="text-lg font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] whitespace-nowrap">
                          {subCat.name}
                        </h3>
                        <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                      </div>
                    )}

                    {/* Menu Items */}
                    <div className="px-4">
                      {viewType === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                          {subCat.items.map((item, idx) => (
                            <div
                              key={item.itemId}
                              className={`group relative bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-[0_20px_50px_-12px_rgba(211,47,47,0.15)] transition-all duration-500 hover:-translate-y-2 animate-fade-in`}
                            >
                              <MadhubaniPattern />
                              
                              {/* Image Section */}
                              <div className="relative h-60 overflow-hidden">
                                <img
                                  src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/40 transition-all duration-500"></div>
                                
                                <div className="absolute top-5 left-5 flex flex-col gap-3">
                                  <VegNonVegIcon isVeg={item.veg} />
                                  {item.bestseller && <BestsellerTag />}
                                </div>

                                <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                                  <div>
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-accent font-black text-3xl">₹{item.price}</span>
                                      {item.discountPrice && (
                                        <span className="text-gray-400 line-through text-sm font-bold opacity-75">₹{item.discountPrice}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Content Section */}
                              <div className="p-7 space-y-4">
                                <h3 className="font-black text-xl text-gray-900 dark:text-white leading-[1.2] group-hover:text-primary transition-colors line-clamp-2">
                                  {item.name}
                                </h3>

                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed font-medium">
                                  {item.description || "A regional masterpiece, crafted with authentic Bihar spices and love."}
                                </p>

                                <div className="pt-4 flex gap-3">
                                  <button
                                    onClick={() => setEditItem(item)}
                                    className="flex-1 py-3 px-4 bg-gray-50 dark:bg-gray-700 hover:bg-primary hover:text-white text-gray-700 dark:text-gray-200 font-black text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                  >
                                    <Edit className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform" />
                                    Customize
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(item.itemId)}
                                    className="p-3 aspect-square bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white rounded-2xl transition-all duration-300"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {subCat.items.map((item, idx) => (
                            <div
                              key={item.itemId}
                              className="group flex flex-col sm:flex-row gap-8 p-6 rounded-[2rem] bg-white dark:bg-gray-800 border-2 border-transparent hover:border-primary/20 hover:shadow-2xl transition-all duration-500 animate-slide-up"
                            >
                              {/* List View Image */}
                              <div className="relative w-full sm:w-44 h-44 flex-shrink-0 rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                  src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {item.bestseller && (
                                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Star className="w-10 h-10 text-accent fill-accent animate-spin-slow" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                  <div className="flex justify-between items-start mb-3">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-3">
                                        <VegNonVegIcon isVeg={item.veg} />
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                          {item.name}
                                        </h3>
                                      </div>
                                      {item.bestseller && (
                                        <span className="inline-block px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-tighter rounded border border-accent/20">
                                          Popular Choice
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <span className="block text-3xl font-black text-primary drop-shadow-sm">
                                        ₹{item.price}
                                      </span>
                                      {item.discountPrice && (
                                        <span className="text-sm text-gray-400 line-through font-bold">
                                          ₹{item.discountPrice}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-3xl">
                                    {item.description || "Indulge in the authentic heritage of Bihar. Every bite tell a story of tradition, spices, and cultural richness."}
                                  </p>
                                </div>

                                <div className="mt-8 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-6">
                                  <div className="flex gap-4">
                                     <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-widest">
                                       <Zap className="w-3 h-3 text-accent fill-accent" />
                                       Live Status
                                     </div>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <button
                                      onClick={() => setEditItem(item)}
                                      className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95"
                                    >
                                      Edit Item
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClick(item.itemId)}
                                      className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                    >
                                      <Trash2 className="w-6 h-6" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {subCat.items.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 glass rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                          <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group">
                            <Package className="w-10 h-10 text-gray-300 group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                          </div>
                          <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                            Category Quiet
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mt-2 font-medium">
                            It seems this section is awaiting its culinary stars. Time to add some magic!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      <EditMenuModal
        open={!!editItem}
        item={editItem}
        onClose={() => setEditItem(null)}
        onSave={handleEditSave}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="DELETE MASTERPIECE?"
        message="Are you absolutely sure? This culinary delight will be removed from your Bihar collection forever."
        confirmText="YES, DELETE"
        isDangerous={true}
      />
    </div>
  );
};

export default MenuList;
