"use client";

import React from "react";
import Image from "next/image";
import { Users, Compass, Anchor, ShieldCheck } from "lucide-react";

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
    <section className="py-24 sm:py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Specifications Details panel */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-blue-600 font-bold">Özel Tasarım Gözdesi</span>
            <h2 className="font-sans text-4xl sm:text-5xl text-slate-900 font-bold leading-none">
              Asha Prestige
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 border-t border-b border-slate-200 py-8">
            {specs.map((spec, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  {spec.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">{spec.label}</span>
                  <strong className="text-slate-800 text-base font-semibold">{spec.value}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Dahil Olan Premium Olanaklar
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-sm text-slate-500">
              {includes.map((inc, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-1 border-t border-slate-200 pt-6">
            <span className="text-xs text-slate-400">Tam Gün Seyir Paketi</span>
            <strong className="font-sans text-3xl sm:text-4xl text-blue-600 font-bold">
              9.999 TL&apos;den başlayan
            </strong>
          </div>
        </div>

        {/* Aerial visual of yacht */}
        <div className="lg:col-span-6 relative flex justify-center items-center h-[400px] sm:h-[500px]">
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" className="w-full h-full max-w-[450px] mx-auto">
              <circle cx="200" cy="200" r="180" stroke="#2563EB" strokeWidth="1" />
              <line x1="200" y1="0" x2="200" y2="400" stroke="#2563EB" strokeWidth="1" />
              <line x1="0" y1="200" x2="400" y2="200" stroke="#2563EB" strokeWidth="1" />
            </svg>
          </div>
          <div className="relative w-full h-full max-w-[380px] z-10 transition-transform duration-500 hover:rotate-2">
            <Image
              src="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800"
              alt="Asha Yacht top view"
              fill
              className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
