"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Phone } from "lucide-react";
import { Button } from "../ui/Button";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";

export function FinalCTA() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#0F172A] relative overflow-hidden text-center">
      {/* Subtle decorative circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-[900px] mx-auto px-5 sm:px-10 lg:px-20 relative z-10 flex flex-col gap-6 items-center">
        <h2 className="font-sans text-4xl sm:text-6xl text-white leading-tight font-bold">
          Hayalinizdeki Yat Turunu Planlayalım
        </h2>
        <p className="text-white/70 text-base sm:text-lg max-w-[620px] leading-relaxed">
          Seçtiğiniz yatı %50 ön ödeme güvencesiyle anında adınıza rezerve edelim.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link href="/rezervasyon">
            <Button variant="primary" className="flex items-center gap-2">
              <Calendar size={18} />
              <span>Online Rezervasyon</span>
            </Button>
          </Link>
          <a href="https://wa.me/905556667788">
            <Button variant="whatsapp" className="flex items-center gap-2">
              <WhatsAppIcon size={18} />
              <span>WhatsApp ile Yaz</span>
            </Button>
          </a>
          <a href="tel:+902125556677">
            <Button variant="glass" className="flex items-center gap-2 text-white border-white/20 hover:bg-white/15">
              <Phone size={18} />
              <span>Hemen Arayın</span>
            </Button>
          </a>
        </div>

        <span className="text-xs text-blue-300 tracking-wider uppercase font-bold mt-4">
          %50 Ön Ödeme Sonrası Kesin Onaylı Rezervasyon
        </span>
      </div>
    </section>
  );
}
