"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EXPERIENCES, YACHTS } from "../../lib/data";

export function QuickBookingBar() {
  const router = useRouter();
  const [exp, setExp] = useState(EXPERIENCES[0].slug);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(10);
  const [yacht, setYacht] = useState(YACHTS[0].slug);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/rezervasyon?experience=${exp}&date=${date}&guests=${guests}&yacht=${yacht}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#021C24]/80 border border-white/12 backdrop-blur-3xl p-6 sm:p-8 rounded-[36px] shadow-2xl flex flex-col gap-6 w-full"
    >
      <h3 className="font-serif text-xl sm:text-2xl text-white">Yat Kiralama Sihirbazı</h3>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Deneyim Türü</label>
          <select
            value={exp}
            onChange={(e) => setExp(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3.5 rounded-xl text-sm outline-none cursor-pointer focus:border-[#2ED3C6] focus:bg-white/10 transition-all appearance-none"
          >
            {EXPERIENCES.map((e) => (
              <option key={e.slug} value={e.slug} className="bg-[#021C24] text-white">
                {e.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Tarih</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3.5 rounded-xl text-sm outline-none focus:border-[#2ED3C6] focus:bg-white/10 transition-all"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Misafir Sayısı</label>
          <input
            type="number"
            min="1"
            max="50"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3.5 rounded-xl text-sm outline-none focus:border-[#2ED3C6] focus:bg-white/10 transition-all"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Yat Seçimi</label>
          <select
            value={yacht}
            onChange={(e) => setYacht(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3.5 rounded-xl text-sm outline-none cursor-pointer focus:border-[#2ED3C6] focus:bg-white/10 transition-all appearance-none"
          >
            {YACHTS.map((y) => (
              <option key={y.slug} value={y.slug} className="bg-[#021C24] text-white">
                {y.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-[#2ED3C6] hover:bg-white text-[#021C24] py-4 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_25px_rgba(46,211,198,0.4)] cursor-pointer"
        >
          Uygun Yatları Göster
        </button>
      </div>
    </form>
  );
}
