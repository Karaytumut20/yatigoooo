"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, Phone, Calendar } from "lucide-react";
import { Button } from "../ui/Button";

export function FinalCTA() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-t from-[#011116] to-[#021C24] relative overflow-hidden text-center">
      <div className="max-w-[900px] mx-auto px-5 sm:px-10 lg:px-20 relative z-10 flex flex-col gap-6 items-center">
        <h2 className="font-serif text-4xl sm:text-6xl text-white leading-tight">
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
              <MessageCircle size={18} />
              <span>WhatsApp ile Yaz</span>
            </Button>
          </a>
          <a href="tel:+902125556677">
            <Button variant="gold" className="flex items-center gap-2">
              <Phone size={18} />
              <span>Hemen Arayın</span>
            </Button>
          </a>
        </div>

        <span className="text-xs text-[#C6A15B] tracking-wider uppercase font-bold mt-4">
          %50 Ön Ödeme Sonrası Kesin Onaylı Rezervasyon
        </span>
      </div>
    </section>
  );
}
