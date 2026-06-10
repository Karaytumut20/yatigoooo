"use client";

import React from "react";
import { Slider } from "../ui/Slider";
import { Counter } from "../ui/Counter";
import { Toggle } from "../ui/Toggle";
import { Yacht } from "../../types/yacht";

interface YachtFilterPanelProps {
  yachts: Yacht[];
  maximumHourlyPrice: number;
  filters: {
    type: string;
    price: number;
    capacity: number;
    length: number;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    type: string;
    price: number;
    capacity: number;
    length: number;
  }>>;
}

export function YachtFilterPanel({ yachts, filters, setFilters, maximumHourlyPrice }: YachtFilterPanelProps) {
  // Dynamically extract unique types and format label
  const typeMap: Record<string, string> = {
    "motor-yacht": "Motor Yat",
    "catamaran": "Katamaran",
    "mega-yacht": "Mega Yat"
  };
  const uniqueTypes = Array.from(new Set(yachts.map((y) => y.yachtType).filter(Boolean))) as string[];
  const dynamicTypes = Array.from(new Set(["motor-yacht", "catamaran", "mega-yacht", ...uniqueTypes]));
  const types = [
    { key: "all", label: "Tümü" },
    ...dynamicTypes.map((t) => ({
      key: t,
      label: typeMap[t] || (t.charAt(0).toUpperCase() + t.slice(1).replace("-", " "))
    }))
  ];

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      price: maximumHourlyPrice,
      capacity: 1,
      length: 0
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 flex flex-col gap-8 sticky top-[110px] shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Yat Filtreleri</h3>
        <button
          onClick={clearFilters}
          className="text-xs text-slate-400 hover:text-blue-600 transition-all cursor-pointer"
        >
          Temizle
        </button>
      </div>

      {/* Yacht Type */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs uppercase tracking-widest text-blue-600 font-bold">Yat Türü</h4>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t.key}
              onClick={() => updateFilter("type", t.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 cursor-pointer ${
                filters.type === t.key
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hourly Price Range */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs uppercase tracking-widest text-blue-600 font-bold">Saatlik Bütçe (Max)</h4>
        <Slider
          min={150}
          max={maximumHourlyPrice}
          value={filters.price}
          onChange={(val) => updateFilter("price", val)}
          labelSuffix=" TL"
        />
      </div>

      {/* Capacity & Cabin & Tech Specs Counter */}
      <div className="flex flex-col gap-4 border-t border-b border-slate-100 py-6">
        <Counter
          label="Min Kapasite"
          value={filters.capacity}
          min={1}
          max={60}
          onChange={(val) => updateFilter("capacity", val)}
        />
        <Counter
          label="Min Uzunluk (Metre)"
          value={filters.length}
          min={0}
          max={50}
          onChange={(val) => updateFilter("length", val)}
        />
      </div>
    </div>
  );
}
