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
          "bg-[#2ED3C6] text-[#021C24]": variant === "turquoise",
          "bg-[#C6A15B] text-[#021C24]": variant === "gold",
          "bg-white/10 text-white border border-white/10 backdrop-blur-md": variant === "glass",
          "bg-red-500/20 text-red-400 border border-red-500/30": variant === "red",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
