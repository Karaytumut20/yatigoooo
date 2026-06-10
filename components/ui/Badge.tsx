import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps {
  variant?: "turquoise" | "gold" | "glass" | "red";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "turquoise", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
        {
          "bg-blue-100 text-blue-700": variant === "turquoise",
          "bg-slate-100 text-slate-700": variant === "gold",
          "bg-white/90 text-slate-600 border border-slate-200 backdrop-blur-md shadow-sm": variant === "glass",
          "bg-red-50 text-red-600 border border-red-200": variant === "red",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
