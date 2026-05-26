"use client";

import React from "react";
import Link from "next/link";
import { YACHTS } from "../../lib/data";
import { formatPrice } from "../../lib/utils";
import { Button } from "../ui/Button";

export function PricingPreview() {
  return (
    <section className="py-24 sm:py-32 bg-[#063B45]/10 border-t border-b border-white/8 relative">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20">
        <div className="text-center max-w-[720px] mx-auto mb-16 flex flex-col gap-4">
          <h2 className="font-serif text-3xl sm:text-5xl text-white leading-tight">
            Şeffaf Fiyat Politikası
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            Fiyatlarımıza kaptan, mürettebat, yakıt ve sigorta dahildir. Gizli ücret sürprizi yoktur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {YACHTS.map((y, index) => {
            const isPopular = y.slug === "su-orion";
            return (
              <div
                key={y.slug}
                className={`relative bg-[#021C24]/80 border rounded-[32px] p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? "border-[#C6A15B] shadow-[0_15px_30px_rgba(198,161,91,0.1)] scale-105 z-10"
                    : "border-white/12 hover:border-white/20"
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C6A15B] text-[#021C24] text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                    En Popüler
                  </span>
                )}
                <div className="flex flex-col gap-6">
                  <div className="text-center border-b border-white/8 pb-6">
                    <h3 className="font-serif text-2xl text-white font-semibold mb-1">{y.name}</h3>
                    <p className="text-white/40 text-xs uppercase tracking-wider">{y.length} • {y.capacity} Kişi</p>
                  </div>

                  <ul className="flex flex-col gap-4 text-sm text-white/70">
                    <li className="flex justify-between">
                      <span>2 Saat Kiralama</span>
                      <strong className="text-[#2ED3C6] font-bold">{formatPrice(y.hourlyPrice * 2)}</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>3 Saat Kiralama</span>
                      <strong className="text-[#2ED3C6] font-bold">{formatPrice(y.hourlyPrice * 3)}</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>4 Saat Kiralama</span>
                      <strong className="text-[#2ED3C6] font-bold">{formatPrice(y.hourlyPrice * 4)}</strong>
                    </li>
                    {y.fullDayPrice && (
                      <li className="flex justify-between border-t border-white/5 pt-3">
                        <span className="text-[#C6A15B]">Tam Gün Paket</span>
                        <strong className="text-[#C6A15B] font-bold">{formatPrice(y.fullDayPrice)}</strong>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link href={`/rezervasyon?yacht=${y.slug}`}>
                    <Button variant={isPopular ? "primary" : "secondary"} className="w-full justify-center py-3.5">
                      Seç & Devam Et
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/yat-kiralama-fiyatlari">
            <Button variant="ghost" className="text-[#2ED3C6] hover:text-white">
              Tüm Fiyatları Karşılaştır →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
