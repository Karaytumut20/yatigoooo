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
            "bg-[#2ED3C6] text-[#021C24] hover:bg-white hover:shadow-[0_0_25px_rgba(46,211,198,0.4)]": variant === "primary",
            "bg-transparent border border-white/16 text-white hover:bg-white/6 hover:border-white": variant === "secondary",
            "bg-transparent text-white hover:bg-white/6": variant === "ghost",
            "bg-white/8 border border-white/12 text-white backdrop-blur-md hover:bg-white/16": variant === "glass",
            "bg-[#C6A15B] text-[#021C24] hover:bg-white hover:shadow-[0_0_25px_rgba(198,161,91,0.4)]": variant === "gold",
            "bg-[#25D366] text-white hover:bg-[#20ba5a] hover:shadow-[0_0_25px_rgba(37,211,102,0.4)]": variant === "whatsapp",
            
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
