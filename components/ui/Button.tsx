import * as React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "glass" | "gold" | "whatsapp";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold tracking-wide rounded-full cursor-pointer transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          {
            // Variants
            "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-[0_8px_30px_rgba(37,99,235,0.35)]": variant === "primary",
            "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600": variant === "secondary",
            "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-blue-600": variant === "ghost",
            "bg-white/80 border border-slate-200 text-slate-700 backdrop-blur-md hover:bg-white hover:shadow-lg": variant === "glass",
            "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-[0_8px_30px_rgba(15,23,42,0.25)]": variant === "gold",
            "bg-[#25D366] text-white hover:bg-[#20ba5a] hover:shadow-[0_8px_25px_rgba(37,211,102,0.35)]": variant === "whatsapp",
            
            // Sizes
            "px-4 py-2 text-xs": size === "sm",
            "px-7 py-4 text-sm": size === "md",
            "px-9 py-5 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
