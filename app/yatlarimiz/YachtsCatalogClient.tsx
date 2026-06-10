"use client";

import React, { useState } from "react";
import { YachtGrid } from "../../components/yachts/YachtGrid";
import { YachtFilterPanel } from "../../components/yachts/YachtFilterPanel";
import { FinalCTA } from "../../components/home/FinalCTA";
import { SlidersHorizontal, X } from "lucide-react";
import { Yacht } from "../../types/yacht";
import { useEffect } from "react";

export default function YachtsCatalogClient({ yachts }: { yachts: Yacht[] }) {
  const maximumHourlyPrice = Math.max(500, ...yachts.map((yacht) => yacht.hourlyPrice));
  const initialFilters = {
    type: "all",
    price: maximumHourlyPrice,
    capacity: 1,
    length: 0
  };
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [mobileFilters, setMobileFilters] = useState(initialFilters);

  useEffect(() => {
    if (!isFilterOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFilterOpen]);

  const openMobileFilters = () => {
    setMobileFilters(filters);
    setIsFilterOpen(true);
  };

  const applyMobileFilters = () => {
    setFilters(mobileFilters);
    setIsFilterOpen(false);
  };

  return (
    <main className="bg-slate-50 min-h-screen pt-32 pb-12">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-blue-600 font-bold">Premium Yat Filosu</span>
            <h1 className="font-sans text-4xl sm:text-6xl text-slate-900 leading-none font-bold">
              Yatlarımız
            </h1>
            <p className="text-slate-500 text-base sm:text-lg max-w-[620px] leading-relaxed mt-2">
              Boğaz turu, yemekli organizasyon ve özel davetler için filomuzdaki lüks yatlarımızı inceleyin ve karşılaştırın.
            </p>
          </div>
          
          {/* Mobile Filter Button */}
          <button
            onClick={openMobileFilters}
            className="lg:hidden flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-[0_4px_15px_rgba(37,99,235,0.25)] hover:bg-blue-700 transition-all cursor-pointer w-full sm:w-auto justify-center"
          >
            <SlidersHorizontal size={16} />
            <span>Filtrele</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start mb-20">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <YachtFilterPanel yachts={yachts} filters={filters} setFilters={setFilters} maximumHourlyPrice={maximumHourlyPrice} />
        </div>

        {/* Catalog Grid */}
          <div className="lg:col-span-3">
            <YachtGrid yachts={yachts} filters={filters} />
          </div>
      </div>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[2100] lg:hidden flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Filtreleri kapat"
            onClick={() => setIsFilterOpen(false)}
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
          />
          <div className="relative z-10 flex max-h-[88dvh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Yat Filtreleri</h2>
                <p className="text-xs text-slate-500">Size uygun yatları hızlıca bulun.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500"
                aria-label="Filtreleri kapat"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
              <YachtFilterPanel yachts={yachts} filters={mobileFilters} setFilters={setMobileFilters} maximumHourlyPrice={maximumHourlyPrice} />
            </div>
            <div className="border-t border-slate-100 bg-white p-4">
              <button
                type="button"
                onClick={applyMobileFilters}
                className="w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-[0_8px_25px_rgba(37,99,235,0.25)] active:scale-[0.98]"
              >
                Ara
              </button>
            </div>
          </div>
        </div>
      )}

      <FinalCTA />
    </main>
  );
}
