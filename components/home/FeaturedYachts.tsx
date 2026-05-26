"use client";

import React from "react";
import { YACHTS } from "../../lib/data";
import { YachtCard } from "../yachts/YachtCard";

export function FeaturedYachts() {
  return (
    <section className="py-24 sm:py-32 bg-[#021C24] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 relative z-10">
        <div className="text-center max-w-[720px] mx-auto mb-16 flex flex-col gap-4">
          <h2 className="font-serif text-3xl sm:text-5xl text-white leading-tight">
            Öne Çıkan Lüks Yatlar
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            Kendine has mimarileri, geniş sosyal alanları ve profesyonel mürettebatıyla hayalinizdeki filoyu keşfedin.
          </p>
        </div>

        {/* 4 Column Yacht Grid for Desktop, Tablet 2, Mobile Carousel/Flex stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {YACHTS.map((yacht) => (
            <div key={yacht.slug}>
              <YachtCard yacht={yacht} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
