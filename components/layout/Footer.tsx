"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer({ settings }: { settings?: Record<string, unknown> }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="py-20 bg-[#0F172A] text-white">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16">
        
        {/* Info Column */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="font-sans text-2xl font-bold tracking-tight">
            yatigotr
          </Link>
          <p className="text-white/60 text-sm leading-relaxed max-w-[280px]">
            İstanbul Boğazı'nın en lüks ve prestijli özel yat kiralama filosu ile unutulmaz deniz turları ve davetler tasarlıyoruz.
          </p>
          <p className="text-white/40 text-xs">
            © 2026 yatigotr. Tüm Hakları Saklıdır.
          </p>
        </div>

        {/* Links Column */}
        <div className="flex flex-col gap-6">
          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-blue-400">
            Hızlı Bağlantılar
          </h4>
          <ul className="flex flex-col gap-3.5 text-sm text-white/70">
            <li><Link href="/" className="hover:text-blue-400 transition-all">Ana Sayfa</Link></li>
            <li><Link href="/yatlarimiz" className="hover:text-blue-400 transition-all">Yatlarımız</Link></li>
            <li><Link href="/deneyimler" className="hover:text-blue-400 transition-all">Deneyimler</Link></li>
            <li><Link href="/hakkimizda" className="hover:text-blue-400 transition-all">Hakkımızda</Link></li>
          </ul>
        </div>

        {/* Experiences Column */}
        <div className="flex flex-col gap-6">
          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-blue-400">
            Popüler Hizmetler
          </h4>
          <ul className="flex flex-col gap-3.5 text-sm text-white/70">
            <li><Link href="/deneyimler/yatta-evlilik-teklifi" className="hover:text-blue-400 transition-all">Evlilik Teklifi</Link></li>
            <li><Link href="/deneyimler/yemekli-yat-turu" className="hover:text-blue-400 transition-all">Yemekli Yat Turu</Link></li>
            <li><Link href="/deneyimler/gun-batimi-turu" className="hover:text-blue-400 transition-all">Gün Batımı Turu</Link></li>
            <li><Link href="/deneyimler/bogaz-turu" className="hover:text-blue-400 transition-all">Boğaz Turu</Link></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="flex flex-col gap-6">
          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-blue-400">
            İletişim Bilgileri
          </h4>
          <div className="flex flex-col gap-4 text-sm text-white/70">
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-blue-400" />
              <span>{String(settings?.contact_phone || "+90 212 555 66 77")}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-blue-400" />
              <span>{String(settings?.contact_email || "info@bosphorusyachtcharter.com")}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{String(settings?.address || "Kuruçeşme Limanı, Beşiktaş / İstanbul")}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 font-bold text-xs transition-all duration-300">
              IG
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 font-bold text-xs transition-all duration-300">
              FB
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 font-bold text-xs transition-all duration-300">
              YT
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-10 text-center text-white/40 text-xs max-w-[1440px] mx-auto px-5">
        <p>Grup Şirketler Lisansı: yatigotr Tourism Group • Tursab Belge No: 6543</p>
      </div>
    </footer>
  );
}
