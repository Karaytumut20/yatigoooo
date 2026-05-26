import * as React from "react";
import { cn } from "../../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white/6 border border-white/12 backdrop-blur-xl rounded-[32px] p-6 transition-all duration-300 hover:bg-white/12 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
