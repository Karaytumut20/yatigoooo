import React from "react";

export function StatsStrip() {
  const stats = [
    { value: "16+ Yıl", label: "Sektör Tecrübesi" },
    { value: "4.8 / 5", label: "Google Müşteri Puanı" },
    { value: "65K+", label: "Mutlu Misafir Etkinliği" },
    { value: "%100", label: "Güvenli Ön Ödeme" }
  ];

  return (
    <div className="border-t border-b border-slate-100 py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <span className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600">
              {stat.value}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-semibold">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
