"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Yacht } from "../../types/yacht";
import { Experience } from "../../types/experience";
import { BookingDatePicker } from "../ui/BookingDatePicker";

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function QuickBookingBar({ yachts, experiences }: { yachts: Yacht[], experiences: Experience[] }) {
  const router = useRouter();
  const [exp, setExp] = useState(() => {
    const defaultExp = experiences.find(e => e.slug === "saatlik-yat-turu");
    return defaultExp?.slug || experiences[0]?.slug || "";
  });
  const [date, setDate] = useState(getTodayDateString());
  const [guests, setGuests] = useState(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/rezervasyon?experience=${exp}&date=${date}&guests=${guests}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/95 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col gap-6 w-full"
    >
      <h3 className="font-sans text-xl sm:text-2xl text-slate-800 font-bold">Yat Kiralama Sihirbazı</h3>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Deneyim Türü</label>
          <select
            value={exp}
            onChange={(e) => setExp(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl text-sm outline-none cursor-pointer focus:border-blue-500 focus:bg-white transition-all"
          >
            {experiences.map((e) => (
              <option key={e.slug} value={e.slug}>
                {e.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <BookingDatePicker 
            value={date} 
            onChange={(val) => setDate(val)} 
            label="Tarih" 
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Misafir Sayısı</label>
          <input
            type="number"
            min="1"
            max="50"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3.5 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_8px_30px_rgba(37,99,235,0.35)] cursor-pointer"
        >
          Uygun Yatları Göster
        </button>
      </div>
    </form>
  );
}
