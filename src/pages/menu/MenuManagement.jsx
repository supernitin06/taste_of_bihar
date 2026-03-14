
import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import MenuList from "../../components/menu/MenuList";
import MenuFilters from "../../components/menu/MenuFilter";
import Button from "../../components/ui/Button";
import { Plus, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MenuStats from "../../components/menu/MenuStats";
import { useGetMenusQuery } from "../../api/services/menuApi";
import DailyMenuModal from "../../components/menu/DailyMenuModal";


const mapItem = (item) => {
  return {
    itemId: item._id,
    name: item.name,
    image: item.menuImage,
    price: item.basePrice,
    discountPrice: null,
    available: item.isAvailableToday,
    veg: item.isVeg || item.foodType === 'VEG',
    bestseller: item.tags?.includes('BEST_SELLER') || false,
    description: item.description,
    inStock: item.inStock,
    ...item
  };
};

const transformItemsData = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) return { menus: [] };

  const categoriesMap = {};

  apiData.forEach(item => {
    const categoryObj = item.category;
    const categoryId = typeof categoryObj === 'object' ? categoryObj?._id : (categoryObj || 'uncategorized');
    const categoryName = (typeof categoryObj === 'object' ? categoryObj?.name : categoryObj) || 'Uncategorized';

    if (!categoriesMap[categoryId]) {
      categoriesMap[categoryId] = {
        categoryId,
        name: categoryName,
        status: 'active',
        subCategories: [{
          subCategoryId: categoryId,
          name: categoryName,
          items: []
        }]
      };
    }
    categoriesMap[categoryId].subCategories[0].items.push(mapItem(item));
  });

  return {
    menus: [{ categories: Object.values(categoriesMap) }]
  };
};

const MenuManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all' });
  const [viewType, setViewType] = useState('list');
  const user = useSelector((state) => state.auth.user);
  const [restaurantId, setRestaurantId] = useState(null);
  const [isDailyMenuModalOpen, setIsDailyMenuModalOpen] = useState(false);


  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ status: 'all' });
    setSearchTerm('');
  };

  useEffect(() => {
    if (user) {
      setRestaurantId(user.restaurantId);
    }
  }, [user]);

  const { data, isLoading, isError, error } = useGetMenusQuery(undefined, { 
    refetchOnMountOrArgChange: true 
  });

  const menus = useMemo(() => (
    data?.data ? transformItemsData(data.data).menus : []
  ), [data]);


  return (
    <div className="app page">
      <div className="mx-auto ">
        {/* Header */}
        <div className="mb-6">
          <div className="flex bg-primary flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
            <div>
              <h1 className="highlight text-4xl font-extrabold tracking-tight">
                Menu Management
              </h1>
              <p className="text-primary opacity-70 mt-2 text-lg font-medium">
                Track and manage all restaurant orders
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <Button
                onClick={() => setIsDailyMenuModalOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Send size={20} /> Send Daily Menu
              </Button>
              <Button
                onClick={() => navigate("/menu-management/add")}
                variant="primary"
                className="flex items-center gap-2"
              >
                <Plus size={20} /> Add Menu
              </Button>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <MenuStats menus={menus} />
        </div>

        {/* Menu Filters */}
        <MenuFilters
          searchTerm={searchTerm}
          onSearch={(e) => setSearchTerm(e.target.value)}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          viewType={viewType}
          onViewModeChange={setViewType}
        />

        {/* Menu List */}
        <MenuList
          menus={menus}
          isLoading={isLoading}
          isError={isError}
          error={error}
          key={viewType}
          searchTerm={searchTerm}
          statusFilter={filters.status}
          viewType={viewType}
        />
        {/* Daily Menu Modal */}
        <DailyMenuModal
          isOpen={isDailyMenuModalOpen}
          onClose={() => setIsDailyMenuModalOpen(false)}
          menus={menus}
        />
      </div>
    </div>
  );
};

export default MenuManagement;