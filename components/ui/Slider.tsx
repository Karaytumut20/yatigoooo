"use client";

import React from "react";
import { cn } from "../../lib/utils";

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  labelPrefix?: string;
  labelSuffix?: string;
}

export function Slider({ min, max, value, onChange, labelPrefix = "", labelSuffix = "" }: SliderProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2ED3C6] outline-none"
      />
      <div className="flex justify-between text-xs text-white/50">
        <span>{labelPrefix}{min}{labelSuffix}</span>
        <strong className="text-white">{labelPrefix}{value}{labelSuffix}</strong>
        <span>{labelPrefix}{max}{labelSuffix}</span>
      </div>
    </div>
  );
}
