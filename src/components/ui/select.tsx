"use client";

import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  searchable?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  value = "",
  placeholder = "Select an option",
  onChange,
  className = "",
  disabled = false,
  searchable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      searchInputRef.current?.focus();
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(prev =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex].value);
      }
    }
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setHighlightedIndex(-1);
          }
        }}
        disabled={disabled}
        className={`h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-green-300 focus:outline-hidden focus:ring-3 focus:ring-green-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-green-800 ${
          value ? "text-gray-800 dark:text-white/90" : "text-gray-400 dark:text-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} text-left transition-all ${className}`}
      >
        {selectedLabel}
      </button>

      <svg
        className="absolute text-gray-700 dark:text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.79175 8.02075L10.0001 13.2291L15.2084 8.02075"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 shadow-lg">
          {searchable && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:text-white"
              />
            </div>
          )}

          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    index === highlightedIndex || value === option.value
                      ? "bg-green-100 dark:bg-green-900/30 text-gray-900 dark:text-white font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400">
                No options found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
