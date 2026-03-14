import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

const InputField = ({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error,
  required = false,
  className = "",
  startIcon = null,
  endIcon = null,
  helperText = "",
  disabled = false,
  min,
  max,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold mb-2 ml-1 text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative group">
        {/* Start Icon */}
        {startIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2
                          text-gray-400 dark:text-gray-500
                          group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400
                          transition-colors pointer-events-none">
            {startIcon}
          </div>
        )}

        {/* Input */}
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          min={min}
          max={max}
          className={`
            w-full text-sm font-medium rounded-xl
             py-3
            bg-primary dark:bg-gray-800/50
            border border-white/20 dark:border-gray-700
            text-primary dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-cyan-500/50
            focus:border-white/30 dark:focus:border-gray-500
            shadow-sm
            transition-all duration-200
            ${startIcon ? "pl-14" : "pl-4"}
            ${endIcon ? "pr-12" : "pr-4"}
            ${disabled ? "opacity-60 cursor-not-allowed" : ""}
          `}
          {...props}
        />

        {/* End Icon */}
        {endIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2
                          text-primary dark:text-gray-500
                          group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400
                          transition-colors pointer-events-none">
            {endIcon}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-xs text-primary dark:text-gray-400 mt-1.5 ml-1">
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

export default InputField;
