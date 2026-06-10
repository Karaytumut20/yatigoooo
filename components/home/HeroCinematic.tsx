"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";
import { QuickBookingBar } from "./QuickBookingBar";
import { Yacht } from "../../types/yacht";
import { Experience } from "../../types/experience";

export function HeroCinematic({ yachts, experiences }: { yachts: Yacht[], experiences: Experience[] }) {
  const { scrollY } = useScroll();
  // Image scale and opacity transitions driven by scroll position
  const scale = useTransform(scrollY, [0, 500], [0.85, 1]);
  const borderRadius = useTransform(scrollY, [0, 500], ["40px", "0px"]);
  const y = useTransform(scrollY, [0, 500], [40, 0]);

  return (
    <section className="relative min-h-screen lg:h-screen w-full flex items-center overflow-hidden pt-28 pb-12 lg:py-0">
      {/* Background image with navy/blue overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/75 via-[#1E3A5F]/60 to-[#0F172A]/70 z-10 pointer-events-none" />
        <Image
          src="/yacht_aerial_hero.png"
          alt="Istanbul Bosphorus Luxury Yacht"
          fill
          priority
          className="object-cover scale-105 animate-[zoom_20s_infinite_alternate] brightness-[0.5]"
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/60 to-transparent z-10" />
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight">
            İstanbul Boğazı'nda <br />
            <span className="text-blue-400 font-medium">Size Özel</span> Yat Deneyimi
          </h1>
          <p className="text-white/80 text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-[620px]">
            Boğaz turu, gün batımı, yemekli tur ve özel organizasyonlar için premium yatınızı seçin, dakikalar içinde rezervasyon yapın.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link href="/rezervasyon">
              <Button variant="primary" size="lg">Hemen Rezervasyon Yap</Button>
            </Link>
            <Link href="/yatlarimiz">
              <Button variant="glass" size="lg" className="text-white border-white/20 hover:bg-white/20">Yatları İncele</Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 mt-8 border-t border-white/15 pt-6">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/75">
              <CheckCircle2 size={18} className="text-blue-400" />
              <span>Güvenli Ödeme</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/75">
              <CheckCircle2 size={18} className="text-blue-400" />
              <span>Profesyonel Mürettebat</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/75">
              <CheckCircle2 size={18} className="text-blue-400" />
              <span>Anında Onay</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 w-full max-w-[450px] lg:max-w-none mx-auto relative z-30">
          <QuickBookingBar yachts={yachts} experiences={experiences} />
        </div>
      </div>
    </section>
  );
}
