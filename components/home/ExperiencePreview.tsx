"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EXPERIENCES } from "../../lib/data";
import { Badge } from "../ui/Badge";
import { formatPrice } from "../../lib/utils";

export function ExperiencePreview() {
  const [activeTab, setActiveTab] = useState("all");
  
  const categories = [
    { key: "all", label: "Tüm Deneyimler" },
    { key: "romantic", label: "Romantik & Özel" },
    { key: "dining", label: "Yemekli Turlar" },
    { key: "celebration", label: "Kutlama & Parti" }
  ];

  const filtered = activeTab === "all"
    ? EXPERIENCES
    : EXPERIENCES.filter((e) => e.category === activeTab);

  return (
    <section className="py-24 sm:py-32 bg-[#021C24]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20">
        <div className="text-center max-w-[720px] mx-auto mb-16 flex flex-col gap-4">
          <h2 className="font-serif text-3xl sm:text-5xl text-white leading-tight">
            Eşsiz Bosphorus Deneyimleri
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            Boğaz'ın incisi İstanbul'da sıradan anları unutulmaz anılara dönüştüren size özel turlar.
          </p>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex flex-wrap justify-center gap-3.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`px-6 py-3 rounded-full text-sm font-semibold tracking-wide border transition-all duration-300 cursor-pointer ${
                activeTab === cat.key
                  ? "bg-[#2ED3C6] border-[#2ED3C6] text-[#021C24]"
                  : "bg-white/5 border-white/12 text-white hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </div>
    </section>
  );
}
