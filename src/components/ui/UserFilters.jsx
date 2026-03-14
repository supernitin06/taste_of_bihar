import React from "react";
import InputField from "./InputField";
import Select from "./Select";
import Button from "./Button";
import { FaFilterCircleXmark } from "react-icons/fa6";

const FiltersBar = ({
  // Search config
  search,

  // Filters
  filters = [],
  onFilterChange,

  // Actions
  onClear,
  children,

  // Backward compatibility (optional)
  filterConfig,
}) => {
  return (
    <div className="mb-6 card p-4 rounded-xl shadow-sm border border-gray-200 bg-white dark:bg-gray-800 transition-colors">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start lg:items-center justify-between">

        {/* SEARCH */}
        <div className="w-full lg:w-1/3">
          {search ? (
            <InputField
              name="search"
              type="text"
              placeholder={search.placeholder || "Search..."}
              value={search.value}               // controlled input
              onChange={(e) => search.onChange(e.target.value)}
              className="w-full"
            />
          ) : filterConfig?.showSearch ? (
            <div className="text-red-500 text-sm">
              Search prop missing in parent
            </div>
          ) : null}
        </div>

        {/* FILTERS + ACTIONS */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center justify-start lg:justify-end w-full lg:w-auto">

          {/* FILTER DROPDOWNS */}
          {filters.map((filter) => (
            <div
              key={filter.key}
              className="w-full sm:w-auto min-w-[140px]"
            >
              <Select
                value={filter.value}
                onChange={(e) =>
                  onFilterChange(filter.key, e.target.value)
                }
                options={filter.options}
                icon={filter.icon}
                placeholder={filter.placeholder || filter.label}
                className="w-full"
              />
            </div>
          ))}

          {/* CLEAR FILTERS */}
          

          {/* CUSTOM ACTIONS */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start">
            {/* Mobile Clear Button (visible only on small screens next to actions if preferred, or kept inline) */}
            {onClear && (
              <Button
                variant="ghost"
                onClick={onClear}
                className="px-4 py-2 flex sm:hidden"
                title="Clear Filters"
              >
                <FaFilterCircleXmark />
              </Button>
            )}
            {children}
          </div>

        </div>
      </div>
    </div>
  );
};

export default React.memo(FiltersBar);
