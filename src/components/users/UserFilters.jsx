import React from 'react';
import FilterBar from '../ui/UserFilters';

const UserFilters = ({
  searchTerm,
  onSearch,
  filters,
  onFilterChange,
  onClearFilters
}) => {

  const handleFilterChange = (key, value) => {
    onFilterChange(key, value);
  };

  return (
    <FilterBar
      search={{
        value: searchTerm,
        onChange: onSearch,
        placeholder: "Search users by name, email, or phone..."
      }}
      onClear={onClearFilters}
      filters={[
        {
          key: 'status',
          value: filters.status,
          options: [
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" }
          ]
        },
        {
          key: 'membership',
          value: filters.membership,
          options: [
            { value: "all", label: "All Memberships" },
            { value: "gold", label: "Gold" },
            { value: "silver", label: "Silver" },
            { value: "bronze", label: "Bronze" }
          ]
        }
      ]}
      onFilterChange={handleFilterChange}
    />
  );
};

export default UserFilters;
