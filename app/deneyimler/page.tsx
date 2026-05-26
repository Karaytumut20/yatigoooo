"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EXPERIENCES } from "../../lib/data";
import { FinalCTA } from "../../components/home/FinalCTA";
import { Badge } from "../../components/ui/Badge";
import { formatPrice } from "../../lib/utils";

export default function ExperiencesCatalogPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { key: "all", label: "Tüm Deneyimler" },
    { key: "romantic", label: "Romantik" },
    { key: "dining", label: "Yemekli" },
    { key: "celebration", label: "Kutlama & Özel Günler" }
  ];

  const filtered = activeCategory === "all"
    ? EXPERIENCES
    : EXPERIENCES.filter((e) => e.category === activeCategory);

  return (
    <main className="bg-[#021C24] min-h-screen text-white pt-32 pb-12">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 mb-12">
        <div className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-widest text-[#2ED3C6] font-bold">Unutulmaz Davetler</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white leading-none">
            Deneyimler
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-[620px] leading-relaxed mt-2">
            Özel anlarınızı İstanbul Boğazı'nın büyüleyici sularında lüks yat turlarıyla taçlandırın.
          </p>
        </div>
      </div>

      {/* Category selector */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 mb-12">
        <div className="flex flex-wrap gap-3.5 border-b border-white/10 pb-6">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                activeCategory === cat.key
                  ? "bg-[#2ED3C6] border-[#2ED3C6] text-[#021C24]"
                  : "bg-white/5 border-white/8 text-white hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {filtered.map((exp) => (
          <div
            key={exp.slug}
            className="group bg-white/5 border border-white/12 rounded-[32px] overflow-hidden flex flex-col transition-all duration-300 hover:border-[#2ED3C6] hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#063B45]">
              <Image
                src={exp.image}
                alt={exp.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-8 flex flex-col justify-between flex-1 gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="font-serif text-2xl text-white font-medium group-hover:text-[#2ED3C6] transition-all">
                  {exp.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                  {exp.shortDescription}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-white/8 pt-5">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-white/50">Başlangıç Fiyatı</span>
                  <strong className="text-[#C6A15B] text-lg font-bold">{formatPrice(exp.startingPrice)}</strong>
                </div>
                <Link href={`/deneyimler/${exp.slug}`}>
                  <button className="px-5 py-2.5 rounded-full bg-[#2ED3C6] text-[#021C24] text-xs font-bold hover:shadow-[0_0_15px_rgba(46,211,198,0.4)] transition-all cursor-pointer">
                    Detayları Gör
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FinalCTA />
    </main>
  );
}
