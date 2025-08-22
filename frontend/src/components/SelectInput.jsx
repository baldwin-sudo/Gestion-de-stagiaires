// components/SelectInput.jsx
"use client";

import React from "react";

const SelectInput = ({
  label,
  value,
  options,
  onChange,
  placeholder = "-- Select --",
}) => {
  // Helper function to get option value and label
  const getOptionValue = (option) => {
    if (typeof option === 'string') {
      return option;
    }
    if (typeof option === 'object' && option.value !== undefined) {
      return option.value;
    }
    return option;
  };

  const getOptionLabel = (option) => {
    if (typeof option === 'string') {
      return option;
    }
    if (typeof option === 'object' && option.label !== undefined) {
      return option.label;
    }
    return option;
  };

  return (
    <div className="min-w-56">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option, idx) => (
          <option key={idx} value={getOptionValue(option)}>
            {getOptionLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
