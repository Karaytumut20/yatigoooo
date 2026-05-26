"use client";

import React from "react";
import Link from "next/link";
import { Phone, MessageCircle, Calendar } from "lucide-react";

export function StickyMobileCTA() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[990] bg-[#021C24]/90 border-t border-white/12 backdrop-blur-xl px-5 py-4 flex items-center justify-between gap-4">
      <a
        href="tel:+902125556677"
        className="flex items-center justify-center w-12 h-12 rounded-full border border-white/12 text-white bg-white/5 active:bg-white/10 transition-all"
        aria-label="Ara"
      >
        <Phone size={20} />
      </a>
      <a
        href="https://wa.me/905556667788"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white active:scale-95 transition-all"
        aria-label="WhatsApp"
      >
        <MessageCircle size={20} />
      </a>
      <Link
        href="/rezervasyon"
        className="flex-1 flex items-center justify-center gap-2 bg-[#2ED3C6] text-[#021C24] font-bold text-sm h-12 rounded-full shadow-[0_0_20px_rgba(46,211,198,0.3)] active:scale-95 transition-all"
      >
        <Calendar size={18} />
        <span>Hemen Kirala</span>
      </Link>
    </div>
  );
}
