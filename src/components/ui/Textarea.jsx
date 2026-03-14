import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

const Textarea = ({
  label,
  name,
  placeholder = "",
  value,
  onChange,
  error,
  required = false,
  className = "",
  helperText = "",
  disabled = false,
  rows = 4,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-bold mb-2 ml-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Textarea */}
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        className={`
          w-full text-sm font-medium shadow-sm input
          transition-all duration-200
          px-4 py-3
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        `}
        {...props}
      />

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-xs text-muted mt-1.5 ml-1">
          {helperText}
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-1.5 mt-1.5 ml-1
                        text-red-500 text-xs font-medium animate-fadeIn">
          <FaExclamationCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Textarea;
