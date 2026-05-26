import * as React from "react";
import { cn } from "../../lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-[11px] uppercase tracking-widest text-white/60 font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full bg-white/5 border border-white/10 text-white px-5 py-3.5 rounded-xl text-sm outline-none transition-all duration-300 focus:border-[#2ED3C6] focus:bg-white/10 appearance-none cursor-pointer",
              error && "border-red-500",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#021C24] text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
            ▼
          </div>
        </div>
        {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
