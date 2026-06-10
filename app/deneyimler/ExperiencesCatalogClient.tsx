"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FinalCTA } from "../../components/home/FinalCTA";
import { formatPrice } from "../../lib/utils";
import { Experience } from "../../types/experience";

export default function ExperiencesCatalogClient({ experiences }: { experiences: Experience[] }) {
  return (
    <main className="bg-slate-50 min-h-screen pt-32 pb-12">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 mb-12">
        <div className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-widest text-blue-600 font-bold">Unutulmaz Davetler</span>
          <h1 className="font-sans text-4xl sm:text-6xl text-slate-900 leading-none font-bold">
            Deneyimler
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-[620px] leading-relaxed mt-2">
            Özel anlarınızı İstanbul Boğazı'nın büyüleyici sularında lüks yat turlarıyla taçlandırın.
          </p>
        </div>
      </div>

      {/* Grid List */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {experiences.map((exp) => (
          <div
            key={exp.slug}
            className="group bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:border-blue-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
              <Image
                src={exp.image}
                alt={exp.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-8 flex flex-col justify-between flex-1 gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="font-sans text-2xl text-slate-900 font-semibold group-hover:text-blue-600 transition-all">
                  {exp.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                  {exp.shortDescription}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">Başlangıç Fiyatı</span>
                  <strong className="text-blue-600 text-lg font-bold">{formatPrice(exp.startingPrice)}</strong>
                </div>
                <Link href={`/deneyimler/${exp.slug}`}>
                  <button className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 hover:shadow-[0_4px_15px_rgba(37,99,235,0.3)] transition-all cursor-pointer">
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
