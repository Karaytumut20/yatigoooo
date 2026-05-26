"use client";

import React from "react";
import { Slider } from "../ui/Slider";
import { Counter } from "../ui/Counter";
import { Toggle } from "../ui/Toggle";

interface YachtFilterPanelProps {
  filters: {
    type: string;
    price: number;
    capacity: number;
    cabins: number;
    pool: boolean;
    flybridge: boolean;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    type: string;
    price: number;
    capacity: number;
    cabins: number;
    pool: boolean;
    flybridge: boolean;
  }>>;
}

export function YachtFilterPanel({ filters, setFilters }: YachtFilterPanelProps) {
  const types = [
    { key: "all", label: "Tümü" },
    { key: "motor-yacht", label: "Motor Yat" },
    { key: "catamaran", label: "Katamaran" },
    { key: "mega-yacht", label: "Mega Yat" }
  ];

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      price: 500,
      capacity: 1,
      cabins: 0,
      pool: false,
      flybridge: false
    });
  };

  return (
    <div className="bg-[#021C24]/85 border border-white/12 rounded-[32px] p-6 lg:p-8 flex flex-col gap-8 sticky top-[110px]">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">Yat Filtreleri</h3>
        <button
          onClick={clearFilters}
          className="text-xs text-white/50 hover:text-[#2ED3C6] transition-all cursor-pointer"
        >
          Temizle
        </button>
      </div>

      {/* Yacht Type */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">Yat Türü</h4>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t.key}
              onClick={() => updateFilter("type", t.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 cursor-pointer ${
                filters.type === t.key
                  ? "bg-[#2ED3C6] border-[#2ED3C6] text-[#021C24]"
                  : "bg-white/5 border-white/8 text-white hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hourly Price Range */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">Saatlik Bütçe (Max)</h4>
        <Slider
          min={150}
          max={500}
          value={filters.price}
          onChange={(val) => updateFilter("price", val)}
          labelPrefix="€"
        />
      </div>

      {/* Capacity & Cabin Counter */}
      <div className="flex flex-col gap-4 border-t border-b border-white/10 py-6">
        <Counter
          label="Min Kapasite"
          value={filters.capacity}
          min={1}
          max={40}
          onChange={(val) => updateFilter("capacity", val)}
        />
        <Counter
          label="Min Kabin"
          value={filters.cabins}
          min={0}
          max={5}
          onChange={(val) => updateFilter("cabins", val)}
        />
      </div>

      {/* Extra Amenities toggles */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs uppercase tracking-widest text-[#C6A15B] font-bold mb-2">Özellikler</h4>
        <Toggle
          label="Havuz / Jakuzi"
          checked={filters.pool}
          onChange={(val) => updateFilter("pool", val)}
        />
        <Toggle
          label="Flybridge"
          checked={filters.flybridge}
          onChange={(val) => updateFilter("flybridge", val)}
        />
      </div>
    </div>
  );
}
