"use client";

import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  stars: number;
  quote: string;
  author: string;
  date: string;
}

const REVIEWS: Review[] = [
  {
    stars: 5,
    quote: "Eşimle evlilik yıldönümümüz için SU Orion yatını kiraladık. Akşam yemeği sunumu ve mürettebatın ilgisi olağanüstüydü. Boğaz'ın sakin sularında harika bir gece geçirdik.",
    author: "Bahar & Hakan Demir",
    date: "Mayıs 2026"
  },
  {
    stars: 5,
    quote: "Şirket lansmanımız için SU Royal yatını 4 saatliğine kiraladık. Tüm kurumsal isteklerimiz eksiksiz yerine getirildi. Ses sistemi ve ikramlar çok başarılıydı.",
    author: "Mustafa Kara, Tekno A.Ş.",
    date: "Nisan 2026"
  },
  {
    stars: 5,
    quote: "Doğum günü partisi için muazzam bir organizasyon oldu. Süslemeler ve lazer gösterisi harikaydı. Kesinlikle tekrar kiralayacağız.",
    author: "Merve Yalçın",
    date: "Mayıs 2026"
  }
];

export function ReviewsSection() {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((prevIndex) => (prevIndex === 0 ? REVIEWS.length - 1 : prevIndex - 1));
  };

  const next = () => {
    setIndex((prevIndex) => (prevIndex === REVIEWS.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <section className="py-24 sm:py-32 bg-blue-50/50">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20">
        <div className="text-center max-w-[720px] mx-auto mb-16 flex flex-col gap-4">
          <h2 className="font-sans text-3xl sm:text-5xl text-slate-900 leading-tight font-bold">
            Misafirlerimizin Değerlendirmeleri
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Hizmet kalitemizin en büyük kanıtı, bizi tercih eden binlerce mutlu misafirimizin yorumlarıdır.
          </p>
        </div>

        <div className="max-w-[800px] mx-auto relative">
          <div className="bg-white border border-slate-200 p-8 sm:p-12 rounded-2xl text-center shadow-lg">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(REVIEWS[index].stars)].map((_, i) => (
                <Star key={i} size={18} fill="#F59E0B" className="text-amber-400" />
              ))}
            </div>
            <p className="font-sans text-lg sm:text-2xl text-slate-700 leading-relaxed mb-8 italic">
              "{REVIEWS[index].quote}"
            </p>
            <div className="flex flex-col gap-1">
              <strong className="text-slate-800 text-base font-semibold">{REVIEWS[index].author}</strong>
              <span className="text-slate-400 text-xs">{REVIEWS[index].date}</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
