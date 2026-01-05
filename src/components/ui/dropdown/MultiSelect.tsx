import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import clsx from "clsx";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  placeholder?: string;
  onChange: (values: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  placeholder = "Select options",
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const toggleValue = (val: string) => {
    onChange(
      value.includes(val)
        ? value.filter((v) => v !== val)
        : [...value, val]
    );
  };

  const selectedOptions = options.filter((o) =>
    value.includes(o.value)
  );

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full min-h-[40px] flex items-center flex-wrap gap-1 rounded-md border px-3 py-2 text-sm"
      >
        {selectedOptions.length === 0 && (
          <span className="text-muted-foreground">{placeholder}</span>
        )}

        {selectedOptions.map((opt) => (
          <span
            key={opt.value}
            className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs"
          >
            {opt.label}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toggleValue(opt.value);
              }}
            />
          </span>
        ))}

        <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-md max-h-56 overflow-auto">
          {options.map((opt) => (
            <label
              key={opt.value}
              className={clsx(
                "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100",
                value.includes(opt.value) && "bg-gray-50"
              )}
            >
              <input
                type="checkbox"
                checked={value.includes(opt.value)}
                onChange={() => toggleValue(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
