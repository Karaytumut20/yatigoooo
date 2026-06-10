"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, User, Home, Ship, Heart, BookOpen, Building, Mail, Globe, Calendar, ChevronDown, Compass } from "lucide-react";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";
import { Button } from "../ui/Button";
import { supabase } from "../../lib/supabase";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  if (pathname?.startsWith("/admin")) return null;

  const navLinks = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Yatlarımız", href: "/yatlarimiz" },
    { label: "Deneyimler", href: "/deneyimler" },
    { label: "Blog", href: "/blog" },
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "İletişim", href: "/iletisim" }
  ];

  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
          !isTransparent
            ? "py-3 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 flex items-center justify-between">
          <Link href="/" className="font-sans text-xl sm:text-2xl font-bold tracking-tight">
            <span className={`transition-colors duration-300 ${!isTransparent ? "text-slate-900" : "text-white"}`}>
              yatigotr
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-300 ${
                    !isTransparent
                      ? isActive
                        ? "text-blue-600 font-semibold"
                        : "text-slate-600 hover:text-blue-600"
                      : isActive
                        ? "text-white font-semibold"
                        : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <select className={`bg-transparent border text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer transition-all duration-300 ${
              !isTransparent
                ? "border-slate-200 text-slate-600"
                : "border-white/20 text-white/90"
            }`}>
              <option value="tr" className="bg-white text-slate-800">TR</option>
              <option value="en" className="bg-white text-slate-800">EN</option>
              <option value="ar" className="bg-white text-slate-800">AR</option>
            </select>
            {user ? (
              <Link href="/dashboard">
                <button className={`flex items-center gap-1.5 py-2 px-4 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer ${
                  !isTransparent ? "border-slate-200 text-slate-700 hover:bg-slate-50" : "border-white/30 text-white hover:bg-white/10"
                }`}>
                  <User size={14} />
                  <span>Hesabım</span>
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button className={`flex items-center gap-1.5 py-2 px-4 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer ${
                  !isTransparent ? "border-slate-200 text-slate-700 hover:bg-slate-50" : "border-white/30 text-white hover:bg-white/10"
                }`}>
                  <span>Giriş Yap</span>
                </button>
              </Link>
            )}
            <Link href="/rezervasyon">
              <Button variant="primary" size="sm">
                Rezervasyon Yap
              </Button>
            </Link>
          </div>

          {/* Hamburger menu for mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-all cursor-pointer ${
              !isTransparent ? "text-slate-700 hover:text-blue-600" : "text-white hover:text-blue-300"
            }`}
            aria-label="Menü"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[99999] bg-white lg:hidden flex flex-col h-screen overflow-hidden">
          {/* Header of mobile menu */}
          <div className="flex items-center justify-between px-5 h-[72px] border-b border-slate-100 bg-white shrink-0">
            {/* Logo */}
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="font-sans text-xl font-bold tracking-tight text-slate-900 flex items-center">
              yatigotr
            </Link>

            {/* Right side options: TR selector, Rezervasyon button, Close icon */}
            <div className="flex items-center gap-3">
              {/* TR Dropdown */}
              <div className="flex items-center gap-1 bg-slate-100/80 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>TR</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>

              {/* Rezervasyon Button */}
              <Link
                href="/rezervasyon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-1.5 bg-[#174472] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#1a4f85] transition-all shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Rezervasyon</span>
              </Link>

              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
                aria-label="Menüyü kapat"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Scrollable Navigation Area */}
          <div className="relative flex-grow overflow-y-auto px-5 py-6 flex flex-col justify-between bg-white">
            {/* Navigation List */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const getLinkIcon = (label: string) => {
                  switch (label) {
                    case "Ana Sayfa": return <Home className="w-5 h-5" />;
                    case "Yatlarımız": return <Compass className="w-5 h-5" />;
                    case "Deneyimler": return <Heart className="w-5 h-5" />;
                    case "Blog": return <BookOpen className="w-5 h-5" />;
                    case "Hakkımızda": return <Building className="w-5 h-5" />;
                    case "İletişim": return <Mail className="w-5 h-5" />;
                    default: return <Ship className="w-5 h-5" />;
                  }
                };
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-sans text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[#f0f4f8] text-[#174472] shadow-sm"
                        : "text-[#4a5568] hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className={isActive ? "text-[#174472]" : "text-slate-400"}>
                      {getLinkIcon(link.label)}
                    </span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions Area with Divider */}
            <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-4 relative">
              {/* Giriş Yap / Hesabım */}
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-2 text-sm font-semibold text-[#4a5568] hover:text-slate-900 transition-all"
                >
                  <User className="w-5 h-5 text-slate-400" />
                  <span>Hesabım</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-2 text-sm font-semibold text-[#4a5568] hover:text-slate-900 transition-all"
                >
                  <User className="w-5 h-5 text-slate-400" />
                  <span>Giriş</span>
                </Link>
              )}

              {/* Rezervasyon Yap Full-Width Button */}
              <Link href="/rezervasyon" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                <button className="w-full flex items-center justify-center gap-2 py-4 bg-[#174472] hover:bg-[#1a4f85] text-white font-bold rounded-2xl transition-all shadow-[0_4px_12px_rgba(23,68,114,0.2)] cursor-pointer">
                  <Calendar className="w-5 h-5" />
                  <span>Rezervasyon Yap</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
