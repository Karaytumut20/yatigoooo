"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { YACHTS } from "../../lib/data";
import { formatPrice } from "../../lib/utils";
import { FinalCTA } from "../../components/home/FinalCTA";
import { CheckCircle2 } from "lucide-react";

export default function PricingPage() {
  const [calcYacht, setCalcYacht] = useState(YACHTS[0].slug);
  const [calcHours, setCalcHours] = useState(3);
  const [calcGuests, setCalcGuests] = useState(10);
  const [calcCatering, setCalcCatering] = useState("no");
  const [totalCost, setTotalCost] = useState(0);
  const [perPersonCost, setPerPersonCost] = useState(0);

  useEffect(() => {
    const yachtObj = YACHTS.find((y) => y.slug === calcYacht) || YACHTS[0];
    let total = yachtObj.hourlyPrice * calcHours;
    if (calcCatering === "yes") {
      total += 40 * calcGuests;
    }
    setTotalCost(total);
    setPerPersonCost(Math.round(total / calcGuests));
  }, [calcYacht, calcHours, calcGuests, calcCatering]);

  return (
    <main className="bg-[#021C24] min-h-screen text-white pt-32 pb-12">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 mb-12">
        <div className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-widest text-[#2ED3C6] font-bold">Şeffaf Maliyetler</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white leading-none">
            Yat Kiralama Fiyatları
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-[620px] leading-relaxed mt-2">
            Fiyatlarımıza kaptan, mürettebat, yakıt ve sigorta dahildir. Gizli sürpriz ücretlerle karşılaşmazsınız.
          </p>
        </div>
      </div>

      {/* Comparison table */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 mb-20">
        <div className="bg-white/5 border border-white/12 backdrop-blur-2xl rounded-[32px] overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10 bg-[#063B45]/30 text-white/50 text-xs uppercase tracking-wider font-bold">
                <th className="p-6">Yat Adı</th>
                <th className="p-6">Uzunluk / Kapasite</th>
                <th className="p-6">2 Saatlik</th>
                <th className="p-6">3 Saatlik</th>
                <th className="p-6">4 Saatlik</th>
                <th className="p-6">Tam Gün</th>
                <th className="p-6">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8 text-sm sm:text-base">
              {YACHTS.map((y) => (
                <tr key={y.slug} className="hover:bg-white/5 transition-all">
                  <td className="p-6 font-semibold">{y.name}</td>
                  <td className="p-6 text-white/60">{y.length} / {y.capacity} Kişi</td>
                  <td className="p-6 text-[#2ED3C6] font-bold">{formatPrice(y.hourlyPrice * 2)}</td>
                  <td className="p-6">{formatPrice(y.hourlyPrice * 3)}</td>
                  <td className="p-6">{formatPrice(y.hourlyPrice * 4)}</td>
                  <td className="p-6 text-[#C6A15B] font-bold">{y.fullDayPrice ? formatPrice(y.fullDayPrice) : "Teklif Alınız"}</td>
                  <td className="p-6">
                    <Link href={`/rezervasyon?yacht=${y.slug}`}>
                      <button className="bg-[#2ED3C6] hover:bg-white text-[#021C24] px-4 py-2 rounded-full font-bold text-xs transition-all cursor-pointer">
                        Seç
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Calculator widget */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 mb-20">
        <div className="bg-[#063B45]/20 border border-white/12 backdrop-blur-2xl rounded-[32px] p-8">
          <h3 className="font-serif text-2xl text-white mb-6">Maliyet Hesaplama Aracı</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end mb-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Yat Seçin</label>
              <select
                value={calcYacht}
                onChange={(e) => setCalcYacht(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-sm outline-none cursor-pointer focus:border-[#2ED3C6]"
              >
                {YACHTS.map((y) => (
                  <option key={y.slug} value={y.slug} className="bg-[#021C24] text-white">
                    {y.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Tur Süresi (Saat)</label>
              <input
                type="number"
                min="2"
                max="10"
                value={calcHours}
                onChange={(e) => setCalcHours(parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-[#2ED3C6]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Kişi Sayısı</label>
              <input
                type="number"
                min="1"
                max="50"
                value={calcGuests}
                onChange={(e) => setCalcGuests(parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-[#2ED3C6]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Yemek Menüsü</label>
              <select
                value={calcCatering}
                onChange={(e) => setCalcCatering(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-sm outline-none cursor-pointer focus:border-[#2ED3C6]"
              >
                <option value="no" className="bg-[#021C24] text-white">Yemek İstemiyorum</option>
                <option value="yes" className="bg-[#021C24] text-white">Lüks Menü (+€40 / Kişi)</option>
              </select>
            </div>
          </div>

          <div className="bg-white/4 border border-white/8 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-left">
              <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">Hesaplanan Toplam Tutar</span>
              <strong className="text-3xl font-bold text-[#2ED3C6]">{formatPrice(totalCost)}</strong>
            </div>
            <div className="text-right">
              <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">Kişi Başı Maliyet</span>
              <strong className="text-2xl font-bold text-[#C6A15B]">{formatPrice(perPersonCost)} <span className="text-xs font-normal">/ kişi</span></strong>
            </div>
          </div>
        </div>
      </div>

      <FinalCTA />
    </main>
  );
}
