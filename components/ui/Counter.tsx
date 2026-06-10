"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { Plus, Minus } from "lucide-react";

interface CounterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function Counter({ label, value, onChange, min = 0, max = 100 }: CounterProps) {
  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  return (
    <div className="flex items-center justify-between py-2 w-full">
      <span className="text-sm text-slate-600 font-medium">{label}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
        >
          <Minus size={16} />
        </button>
        <span className="text-base font-semibold text-slate-800 w-6 text-center">{value}</span>
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
