"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "../../lib/utils";
import { Yacht } from "../../types/yacht";

import { YachtCard } from "../yachts/YachtCard";

export function FeaturedYachts({ yachts }: { yachts: Yacht[] }) {
  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-16">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-600">Filomuz</span>
            <h2 className="font-sans text-4xl sm:text-5xl lg:text-6xl text-slate-900 font-bold leading-none tracking-tight">Öne Çıkan Yatlar</h2>
          </div>
        </div>

        {/* 4 Column Yacht Grid for Desktop, Tablet 2, Mobile Carousel/Flex stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {yachts.map((yacht) => (
            <div key={yacht.slug}>
              <YachtCard yacht={yacht} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
