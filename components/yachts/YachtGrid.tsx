import React from "react";
import { YachtCard } from "./YachtCard";
import { Yacht } from "../../types/yacht";

interface YachtGridProps {
  yachts: Yacht[];
  filters: {
    type: string;
    price: number;
    capacity: number;
    length: number;
  };
}

export function YachtGrid({ yachts, filters }: YachtGridProps) {
  const filtered = yachts.filter((y) => {
    // 1. Yacht Type filter
    if (filters.type !== "all") {
      const normalizeType = (t: string | undefined) => {
        if (!t) return "";
        const lower = t.toLowerCase();
        if (lower.includes("motor")) return "motor-yacht";
        if (lower.includes("katamaran") || lower.includes("catamaran")) return "catamaran";
        if (lower.includes("mega")) return "mega-yacht";
        return lower;
      };
      
      const typeMap: Record<string, string> = {
        "su-royal": "mega-yacht",
        "su-orion": "catamaran",
        "su-prestige": "motor-yacht",
        "su-classic": "motor-yacht"
      };
      const actualType = normalizeType(y.yachtType) || typeMap[y.slug] || "";
      if (actualType !== filters.type) return false;
    }

    // 2. Budget (Hourly Price) Filter
    if (y.hourlyPrice > filters.price) return false;

    // 3. Min Capacity Filter
    if (y.capacity < filters.capacity) return false;

    // 4. Min Length Filter (Parse number from length string: e.g. "36 Metre" -> 36)
    if (filters.length > 0) {
      const parsedLength = parseInt(y.length || "", 10);
      if (!isNaN(parsedLength) && parsedLength < filters.length) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center col-span-full shadow-sm">
        <h3 className="font-sans text-2xl text-slate-800 mb-2 font-bold">Kriterlerinize Uygun Yat Bulunamadı</h3>
        <p className="text-slate-500 text-sm">Lütfen filtre ayarlarını değiştirerek tekrar deneyin.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filtered.map((yacht) => (
        <YachtCard key={yacht.slug} yacht={yacht} />
      ))}
    </div>
  );
}
