"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";
import { QuickBookingBar } from "./QuickBookingBar";

export function HeroCinematic() {
  const { scrollY } = useScroll();
  // Image scale and opacity transitions driven by scroll position
  const scale = useTransform(scrollY, [0, 500], [0.85, 1]);
  const borderRadius = useTransform(scrollY, [0, 500], ["40px", "0px"]);
  const y = useTransform(scrollY, [0, 500], [40, 0]);

  return (
    <section className="relative h-screen min-height-[750px] w-full flex items-center overflow-hidden pt-20">
      {/* Cinematic top-view yacht background inspired by reference */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#021c24]/50 z-10 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-5">
          <span className="font-serif text-[18vw] font-bold text-white/5 opacity-[0.06] tracking-tighter leading-none select-none">
            YATIGOTR
          </span>
        </div>
        <Image
          src="/yacht_aerial_hero.png"
          alt="Istanbul Bosphorus Luxury Yacht"
          fill
          priority
          className="object-cover scale-105 animate-[zoom_20s_infinite_alternate] brightness-[0.4] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#021C24] via-transparent to-transparent h-1/2 bottom-0 z-10" />
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.1] tracking-tight">
            İstanbul Boğazı’nda <br />
            <span className="text-[#2ED3C6] font-medium italic">Size Özel</span> Yat Deneyimi
          </h1>
          <p className="text-white/75 text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-[620px]">
            Boğaz turu, gün batımı, yemekli tur ve özel organizasyonlar için premium yatınızı seçin, dakikalar içinde rezervasyon yapın.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link href="/rezervasyon">
              <Button variant="primary">Hemen Rezervasyon Yap</Button>
            </Link>
            <Link href="/yatlarimiz">
              <Button variant="secondary">Yatları İncele</Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 mt-8 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/70">
              <CheckCircle2 size={18} className="text-[#2ED3C6]" />
              <span>Güvenli Ödeme</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/70">
              <CheckCircle2 size={18} className="text-[#2ED3C6]" />
              <span>Profesyonel Mürettebat</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/70">
              <CheckCircle2 size={18} className="text-[#2ED3C6]" />
              <span>Anında Onay</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 w-full max-w-[450px] lg:max-w-none mx-auto">
          <QuickBookingBar />
        </div>
      </div>
    </section>
  );
}
