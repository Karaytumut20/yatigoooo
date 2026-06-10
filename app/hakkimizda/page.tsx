import React from "react";
import { FinalCTA } from "../../components/home/FinalCTA";
import { StatsStrip } from "../../components/home/StatsStrip";
import { StepsSection } from "../../components/home/StepsSection";

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen pt-32 pb-12">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="text-xs uppercase tracking-widest text-blue-600 font-bold">Biz Kimiz?</span>
            <h1 className="font-sans text-4xl sm:text-6xl text-slate-900 font-bold leading-tight">
              Aracısız, Kendi Filomuzla Lüks Hizmet
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              2010 yılından beri İstanbul Boğazı'nda lüks denizcilik standartlarını yeniden tanımlıyoruz. Biz bir komisyoncu veya acente değiliz; bünyemizdeki lüks yatların tamamı kendi öz sermayemizdir.
            </p>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Temizlik, bakım, güvenlik ve personel standartlarımızı doğrudan kendimiz denetliyoruz. Böylece misafirlerimize en üst düzey konforu en uygun fiyatlarla sunabiliyoruz.
            </p>
          </div>
          <div className="lg:col-span-5 bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center shadow-lg">
            <span className="font-sans text-6xl text-blue-600 font-bold block mb-4">16+ Yıl</span>
            <strong className="text-slate-800 text-lg font-semibold block mb-2">Denizcilik Güveni</strong>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              İstanbul Boğazı'nda binlerce mutlu misafire ev sahipliği yaparak en özel anları tasarladık.
            </p>
          </div>
        </div>
      </div>

      <StatsStrip />
      <StepsSection />
      <FinalCTA />
    </main>
  );
}
