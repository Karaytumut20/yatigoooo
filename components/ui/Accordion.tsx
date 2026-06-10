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
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between p-5 text-left text-slate-800 font-semibold text-[15px] sm:text-base cursor-pointer break-words"
            >
              <span className="break-words overflow-wrap-anywhere pr-3 flex-1">{item.question}</span>
              <ChevronDown
                size={18}
                className={cn("text-slate-400 transition-transform duration-300 shrink-0", isOpen && "rotate-180 text-blue-600")}
              />
            </button>
            <div
              className={cn(
                "transition-all duration-300 ease-out overflow-hidden",
                isOpen ? "max-h-[1000px]" : "max-h-0"
              )}
            >
              <div className="p-5 pt-0 text-slate-600 text-sm sm:text-[15px] leading-relaxed border-t border-slate-100 break-words overflow-wrap-anywhere whitespace-pre-wrap">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
