import React from "react";
import FilterBar from "../ui/UserFilters";
import Button from "../ui/Button";
import GradientButton from "../ui/GradientButton";
import { Grid, List } from "lucide-react"; // ✅ ADD THIS

const SearchFilterBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onAddNew,
  setViewMode,
}) => {
  const handleFilterChange = (key, value) => {
    if (key === "status") {
      setStatusFilter(value);
    }
  };

  return (
    <FilterBar
      search={{
        value: searchTerm,
        onChange: setSearchTerm,
        placeholder: "Search restaurants...",
      }}
      filters={[
        {
          key: "status",
          value: statusFilter,
          options: [
            { value: "All", label: "All Status" },
            { value: "Approved", label: "Approved" },
            { value: "Suspended", label: "Suspended" },
          ],
        },
      ]}
      onFilterChange={handleFilterChange}
    >
      <Button onClick={onAddNew} className="px-6 whitespace-nowrap">
        + Add New
      </Button>

      <GradientButton onClick={() => setViewMode("grid")}>
        <Grid size={16} />
      </GradientButton>

      <GradientButton onClick={() => setViewMode("table")}>
        <List size={16} />
      </GradientButton>
    </FilterBar>
  );
};

export default SearchFilterBar;
