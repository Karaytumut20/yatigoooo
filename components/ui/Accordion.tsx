"use client";

import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between p-5 text-left text-white font-semibold text-[15px] sm:text-base cursor-pointer"
            >
              <span>{item.question}</span>
              <ChevronDown
                size={18}
                className={cn("text-white/60 transition-transform duration-300", isOpen && "rotate-180 text-[#2ED3C6]")}
              />
            </button>
            <div
              className={cn(
                "transition-all duration-300 ease-out overflow-hidden max-h-0",
                isOpen && "max-h-[300px]"
              )}
            >
              <div className="p-5 pt-0 text-white/70 text-sm sm:text-[15px] leading-relaxed border-t border-white/5">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
