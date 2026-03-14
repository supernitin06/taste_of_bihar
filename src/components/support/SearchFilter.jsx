import React from 'react';
import FilterBar from '../ui/UserFilters';

const SearchFilter = ({
  searchText, setSearchText,
  filterStatus, setFilterStatus,
  filterPriority, setFilterPriority
}) => {

  const handleFilterChange = (key, value) => {
    if (key === 'status') setFilterStatus(value);
    if (key === 'priority') setFilterPriority(value);
  };

  return (
    <FilterBar
      search={{
        value: searchText,
        onChange: setSearchText,
        placeholder: "Search by ticket ID, subject, customer..."
      }}
      filters={[
        {
          key: 'status',
          value: filterStatus,
          options: [
            { value: "", label: "All Status" },
            { value: "open", label: "Open" },
            { value: "pending", label: "Pending" },
            { value: "resolved", label: "Resolved" },
            { value: "closed", label: "Closed" }
          ]
        },
        {
          key: 'priority',
          value: filterPriority,
          options: [
            { value: "", label: "All Priority" },
            { value: "urgent", label: "Urgent" },
            { value: "high", label: "High" },
            { value: "medium", label: "Medium" },
            { value: "low", label: "Low" }
          ]
        }
      ]}
      onFilterChange={handleFilterChange}
    />
  );
};

export default SearchFilter;