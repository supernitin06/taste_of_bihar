import React from "react";
import FilterBar from "../ui/UserFilters";

const SearchFilter = ({
  searchText,
  setSearchText,
  filterStatus,
  setFilterStatus
}) => {
  return (
    <FilterBar
      search={{
        value: searchText,
        onChange: setSearchText,
        placeholder: "Search by coupon code..."
      }}
      filters={[
        {
          key: 'status',
          value: filterStatus,
          options: [
            { value: "", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "expired", label: "Expired" }
          ]
        }
      ]}
      onFilterChange={(key, val) => setFilterStatus(val)}
    />
  );
};

export default SearchFilter;
