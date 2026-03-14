import React from "react";
import FilterBar from "../ui/UserFilters";
import { Grid, List } from 'lucide-react';
import Button from '../ui/Button';

const DeliveryPartnerSearchFilter = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
  counts = { all: 0, active: 0, inactive: 0 }
}) => {

  return (
    <FilterBar
      search={{
        value: searchTerm,
        onChange: (e) => onSearchChange(e),
        placeholder: "Search by Name, City..."
      }}
    >
      {/* Status Toggles */}
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto max-w-full scrollbar-hide">
        <Button variant={statusFilter === 'All' ? 'secondary' : 'ghost'} onClick={() => onStatusChange('All')} size="sm" className="font-semibold whitespace-nowrap">
          All <span className="ml-1.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md text-xs">{counts.all}</span>
        </Button>
        <Button variant={statusFilter === 'Active' ? 'secondary' : 'ghost'} onClick={() => onStatusChange('Active')} size="sm" className="font-semibold whitespace-nowrap">
          Active <span className="ml-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-md text-xs">{counts.active}</span>
        </Button>
        <Button variant={statusFilter === 'Inactive' ? 'secondary' : 'ghost'} onClick={() => onStatusChange('Inactive')} size="sm" className="font-semibold whitespace-nowrap">
          Inactive <span className="ml-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-md text-xs">{counts.inactive}</span>
        </Button>
      </div>

      <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>

      {/* View Mode Toggles */}
      <div className="flex items-center gap-2">
        <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} onClick={() => onViewModeChange('grid')} className="p-2.5" title="Grid View">
          <Grid size={18} />
        </Button>
        <Button variant={viewMode === 'list' ? 'primary' : 'ghost'} onClick={() => onViewModeChange('list')} className="p-2.5" title="List View">
          <List size={18} />
        </Button>
      </div>
    </FilterBar>
  );
};

export default DeliveryPartnerSearchFilter;
