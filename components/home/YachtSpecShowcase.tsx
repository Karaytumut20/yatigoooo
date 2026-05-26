"use client";

import React from "react";
import Image from "next/image";
import { Users, Compass, Anchor, Shield, ShieldCheck } from "lucide-react";

export function YachtSpecShowcase() {
  const specs = [
    { icon: <Users size={20} />, label: "Kapasite", value: "11 Misafir" },
    { icon: <Compass size={20} />, label: "Uzunluk", value: "13 Metre" },
    { icon: <Anchor size={20} />, label: "Kabin", value: "1 Lüks Kabin" },
    { icon: <ShieldCheck size={20} />, label: "Banyo", value: "1 Banyo" }
  ];

  const includes = [
    "Havlu Servisi",
    "Soğuk İçecekler",
    "Bluetooth Müzik",
    "Snorkel Seti",
    "Lüks Kaptan ve Ekip",
    "Mini Buzdolabı",
    "Prizler",
    "Paddle Board"
  ];

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-[#021C24] via-[#063B45]/20 to-[#021C24] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Specifications Details panel */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">Özel Tasarım Gözdesi</span>
            <h2 className="font-serif text-4xl sm:text-5xl text-white font-medium leading-none">
              Asha Prestige
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 border-t border-b border-white/12 py-8">
            {specs.map((spec, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#2ED3C6]">
                  {spec.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-white/50">{spec.label}</span>
                  <strong className="text-white text-base font-semibold">{spec.value}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C6A15B]">
              Dahil Olan Premium Olanaklar
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-sm text-white/60">
              {includes.map((inc, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-[#2ED3C6] font-bold">•</span>
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-1 border-t border-white/10 pt-6">
            <span className="text-xs text-white/50">Tam Gün Seyir Paketi</span>
            <strong className="font-serif text-3xl sm:text-4xl text-[#2ED3C6]">
              €9,999'dan başlayan
            </strong>
          </div>
        </div>

        {/* Aerial visual of yacht */}
        <div className="lg:col-span-6 relative flex justify-center items-center h-[400px] sm:h-[500px]">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" className="w-full h-full max-w-[450px] mx-auto">
              <circle cx="200" cy="200" r="180" stroke="white" strokeWidth="1" />
              <line x1="200" y1="0" x2="200" y2="400" stroke="white" strokeWidth="1" />
              <line x1="0" y1="200" x2="400" y2="200" stroke="white" strokeWidth="1" />
            </svg>
          </div>
          <div className="relative w-full h-full max-w-[380px] z-10 transition-transform duration-500 hover:rotate-2">
            <Image
              src="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800"
              alt="Asha Yacht top view"
              fill
              className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
