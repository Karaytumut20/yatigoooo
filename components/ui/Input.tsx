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
          <label className="text-[11px] uppercase tracking-widest text-white/60 font-medium">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "bg-white/5 border border-white/10 text-white px-5 py-3.5 rounded-xl text-sm outline-none transition-all duration-300 focus:border-[#2ED3C6] focus:bg-white/10 placeholder:text-white/30",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
