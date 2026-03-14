import React from "react";
import FilterBar from "../ui/UserFilters";
import { Grid, List } from 'lucide-react';
import Button from '../ui/Button';

const MenuFilters = ({
  searchTerm,
  onSearch,
  filters,
  onFilterChange,
  onClearFilters,
  viewType,
  onViewModeChange,
}) => {
  return (
    <FilterBar
      search={{
        value: searchTerm,
        onChange: onSearch,
        placeholder: "Search menu items..."
      }}
      filters={[
        {
          key: 'status',
          value: filters?.status || 'all',
          options: [
            { value: "all", label: "All" },
            { value: "available", label: "Available" },
            { value: "unavailable", label: "Unavailable" },
            { value: "bestseller", label: "Bestseller" },
          ]
        }
      ]}
      onFilterChange={onFilterChange}
      onClear={onClearFilters}
    >
      <div className="flex items-center gap-2">
        <Button variant={viewType === 'grid' ? 'primary' : 'ghost'} onClick={() => onViewModeChange('grid')} className="p-2.5" title="Grid View">
          <Grid size={18} />
        </Button>
        <Button variant={viewType === 'list' ? 'primary' : 'ghost'} onClick={() => onViewModeChange('list')} className="p-2.5" title="List View">
          <List size={18} />
        </Button>
      </div>
    </FilterBar>
  );
};
export default MenuFilters;
