import * as React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = "text", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "bg-white border border-slate-200 text-slate-800 px-5 py-3.5 rounded-xl text-sm outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400",
            error && "border-red-400 focus:border-red-400 focus:ring-red-100",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
