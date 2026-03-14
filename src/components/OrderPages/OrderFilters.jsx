import React from "react";
import FilterBar from "../ui/UserFilters";
import { Grid, List } from 'lucide-react';
import Button from '../ui/Button';

const OrderFilters = ({
  searchTerm,
  onSearch,
  filters,
  onFilterChange,
  onClearFilters,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <FilterBar
      search={{
        value: searchTerm,
        onChange: onSearch,
        placeholder: "Search orders..."
      }}
      filters={[
        {
          key: 'status',
          value: filters.status,
          options: [
            { value: "all", label: "All Status" },
            { value: "placed", label: "Placed" },
            { value: "preparing", label: "Preparing" },
            { value: "ready", label: "Ready" },
            { value: "assigned", label: "Assigned" },
            { value: "picked", label: "Picked Up" },
            { value: "delivered", label: "Delivered" },
            { value: "rejected", label: "Rejected" },
          ]
        }
      ]}
      onFilterChange={onFilterChange}
      onClear={onClearFilters}
    >
      <div className="flex items-center gap-2">
        <Button variant={viewMode === 'grid' ? 'primary' : 'ghost'} onClick={() => onViewModeChange('grid')} className="p-2.5" title="Grid View">
          <Grid size={18} />
        </Button>
        <Button variant={viewMode === 'list' ? 'primary' : 'ghost'} onClick={() => onViewModeChange('list')} className="p-2.5" title="List View">
          <List size={18} />
        </Button>
      </div>
    </FilterBar>
  );
};

export default OrderFilters;
