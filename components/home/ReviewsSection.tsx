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
    <section className="py-24 sm:py-32 bg-[#021C24]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20">
        <div className="text-center max-w-[720px] mx-auto mb-16 flex flex-col gap-4">
          <h2 className="font-serif text-3xl sm:text-5xl text-white leading-tight">
            Misafirlerimizin Değerlendirmeleri
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            Hizmet kalitemizin en büyük kanıtı, bizi tercih eden binlerce mutlu misafirimizin yorumlarıdır.
          </p>
        </div>

        <div className="max-w-[800px] mx-auto relative">
          <div className="bg-white/4 border border-white/8 p-8 sm:p-12 rounded-[32px] text-center backdrop-blur-md">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(REVIEWS[index].stars)].map((_, i) => (
                <Star key={i} size={18} fill="#C6A15B" className="text-[#C6A15B]" />
              ))}
            </div>
            <p className="font-serif text-lg sm:text-2xl text-white/90 leading-relaxed mb-8 italic">
              "{REVIEWS[index].quote}"
            </p>
            <div className="flex flex-col gap-1">
              <strong className="text-white text-base font-semibold">{REVIEWS[index].author}</strong>
              <span className="text-white/40 text-xs">{REVIEWS[index].date}</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-white/12 flex items-center justify-center text-white bg-white/5 hover:bg-[#2ED3C6] hover:text-[#021C24] transition-all cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-white/12 flex items-center justify-center text-white bg-white/5 hover:bg-[#2ED3C6] hover:text-[#021C24] transition-all cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
