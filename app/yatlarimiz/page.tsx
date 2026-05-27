"use client";

import React, { useState } from "react";
import { YachtGrid } from "../../components/yachts/YachtGrid";
import { YachtFilterPanel } from "../../components/yachts/YachtFilterPanel";
import { FinalCTA } from "../../components/home/FinalCTA";
import { Drawer } from "../../components/ui/Drawer";
import { SlidersHorizontal } from "lucide-react";

export default function YachtsCatalogPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    price: 500,
    capacity: 1,
    cabins: 0,
    pool: false,
    flybridge: false
  });

  return (
    <main className="bg-[#021C24] min-h-screen text-white pt-32 pb-12">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-[#2ED3C6] font-bold">Premium Yat Filosu</span>
            <h1 className="font-serif text-4xl sm:text-6xl text-white leading-none">
              Yatlarımız
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-[620px] leading-relaxed mt-2">
              Boğaz turu, yemekli organizasyon ve özel davetler için filomuzdaki lüks yatlarımızı inceleyin ve karşılaştırın.
            </p>
          </div>
          
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-[#2ED3C6] text-[#021C24] px-6 py-3 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(46,211,198,0.3)] hover:bg-white transition-all cursor-pointer w-full sm:w-auto justify-center"
          >
            <SlidersHorizontal size={16} />
            <span>Filtrele</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start mb-20">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <YachtFilterPanel filters={filters} setFilters={setFilters} />
        </div>

        {/* Catalog Grid */}
        <div className="lg:col-span-3">
          <YachtGrid filters={filters} />
        </div>
      </div>

      {/* Mobile Drawer Filter */}
      <Drawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtrele"
      >
        <YachtFilterPanel filters={filters} setFilters={setFilters} />
      </Drawer>

      <FinalCTA />
    </main>
  );
}
