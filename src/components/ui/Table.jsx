import React from "react";
import ActionButtons from "./UserAction";

const Table = ({
  data = [],
  columns = [],
  actions = [],
  className = "",
  title = "",
  subtitle = "",
}) => {
  const hasActionsColumn = columns.some(
    (col) => col.header === "Actions" || col.key === "actions"
  );

  const displayColumns =
    hasActionsColumn
      ? columns
      : actions.length > 0
        ? [...columns, { header: "Actions", key: "actions" }]
        : columns;

  return (
    <div
      className={`rounded-2xl border border-gray-200 dark:border-gray-700 
      bg-white dark:bg-gray-900 shadow-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 
        bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="relative overflow-auto max-h-[70vh]">
        <table className="min-w-full text-sm">
          {/* Table Head */}
          <thead className="sticky top-0 z-30 bg-gray-100 dark:bg-gray-800">
            <tr>
              {displayColumns.map((col, index) => (
                <th
                  key={col.key || index}
                  className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider 
                  text-gray-600 dark:text-gray-300
                  ${index === 0 ? "sticky left-0 z-40 bg-gray-100 dark:bg-gray-800" : ""}`}
                >
                  {typeof col.header === "function"
                    ? col.header()
                    : col.header || col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={displayColumns.length}
                  className="py-16 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">📭</span>
                    <span>No data available</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const rowKey = row.id || row._id || rowIndex;

                return (
                  <tr
                    key={rowKey}
                    className="odd:bg-white even:bg-gray-50 
                    dark:odd:bg-gray-900 dark:even:bg-gray-800
                    hover:bg-primary/5 dark:hover:bg-primary/10 transition"
                  >
                    {displayColumns.map((col, colIndex) => {
                      const stickyCell =
                        colIndex === 0
                          ? "sticky left-0 z-20 bg-white dark:bg-gray-900"
                          : "";

                      if (col.key === "actions") {
                        return (
                          <td
                            key="actions"
                            className={`px-6 py-4 whitespace-nowrap ${stickyCell}`}
                          >
                            <ActionButtons
                              item={row}
                              actions={actions}
                              size="sm"
                              variant="ghost"
                            />
                          </td>
                        );
                      }

                      if (col.render) {
                        return (
                          <td
                            key={col.key || colIndex}
                            className={`px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300 ${stickyCell}`}
                          >
                            {col.render(row)}
                          </td>
                        );
                      }

                      return (
                        <td
                          key={col.key || colIndex}
                          className={`px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300 ${stickyCell}`}
                        >
                          {row[col.key] ?? "-"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {data.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 
        bg-gray-50 dark:bg-gray-800 text-sm flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {data.length}
            </span>{" "}
            {title?.toLowerCase() || "items"}
          </span>
        </div>
      )}
    </div>
  );
};

export default Table;
