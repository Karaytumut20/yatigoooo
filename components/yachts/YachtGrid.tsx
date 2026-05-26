import React from "react";
import { YACHTS } from "../../lib/data";
import { YachtCard } from "./YachtCard";

interface YachtGridProps {
  filters: {
    type: string;
    price: number;
    capacity: number;
    cabins: number;
    pool: boolean;
    flybridge: boolean;
  };
}

export function YachtGrid({ filters }: YachtGridProps) {
  const filtered = YACHTS.filter((y) => {
    if (filters.type !== "all" && y.slug !== filters.type && y.slug.replace("su-", "") !== filters.type) {
      // Basic type match
      const typeMap: Record<string, string> = {
        "su-royal": "mega-yacht",
        "su-orion": "catamaran",
        "su-prestige": "motor-yacht",
        "su-classic": "motor-yacht"
      };
      const actualType = typeMap[y.slug] || "";
      if (actualType !== filters.type) return false;
    }
    if (y.hourlyPrice > filters.price) return false;
    if (y.capacity < filters.capacity) return false;
    if (y.cabins && y.cabins < filters.cabins) return false;
    if (filters.pool && !y.features.includes("Havuz/Jakuzi")) return false;
    if (filters.flybridge && !y.features.includes("Flybridge")) return false;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className="bg-white/5 border border-white/12 rounded-[32px] p-12 text-center col-span-full">
        <h3 className="font-serif text-2xl text-white mb-2">Kriterlerinize Uygun Yat Bulunamadı</h3>
        <p className="text-white/60 text-sm">Lütfen filtre ayarlarını değiştirerek tekrar deneyin.</p>
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
