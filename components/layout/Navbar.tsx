"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MessageSquare } from "lucide-react";
import { Button } from "../ui/Button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Yatlarımız", href: "/yatlarimiz" },
    { label: "Deneyimler", href: "/deneyimler" },
    { label: "Fiyatlar", href: "/yat-kiralama-fiyatlari" },
    { label: "Blog", href: "/blog" },
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "İletişim", href: "/iletisim" }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
          isScrolled
            ? "py-4 bg-[#021C24]/85 backdrop-blur-xl border-b border-white/12"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
            Bosphorus <span className="text-[#2ED3C6] font-sans font-light">Yacht</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-300 hover:text-[#2ED3C6] ${
                    isActive ? "text-[#2ED3C6] font-semibold" : "text-white/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <select className="bg-transparent border border-white/12 text-xs font-bold px-3 py-1.5 rounded-lg text-white/90 outline-none cursor-pointer">
              <option value="tr" className="bg-[#021C24] text-white">TR</option>
              <option value="en" className="bg-[#021C24] text-white">EN</option>
              <option value="ar" className="bg-[#021C24] text-white">AR</option>
            </select>
            <Link href="/rezervasyon">
              <Button variant="primary" size="sm">
                Rezervasyon Yap
              </Button>
            </Link>
          </div>

          {/* Hamburger menu for mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-[#2ED3C6] transition-all cursor-pointer"
            aria-label="Menü"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[999] bg-[#021C24]/98 backdrop-blur-2xl flex flex-col justify-center items-center gap-10 p-10 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-white hover:text-[#2ED3C6] cursor-pointer"
          >
            <X size={30} />
          </button>

          <nav className="flex flex-col items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-serif text-2xl transition-all duration-300 hover:text-[#2ED3C6] ${
                    isActive ? "text-[#2ED3C6] font-bold" : "text-white/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-4 w-full max-w-[280px]">
            <a
              href="tel:+902125556677"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full border border-white/12 text-white text-sm font-semibold hover:bg-white/5 transition-all"
            >
              <Phone size={16} />
              <span>Telefonla Ara</span>
            </a>
            <a
              href="https://wa.me/905556667788"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all"
            >
              <MessageSquare size={16} />
              <span>WhatsApp Destek</span>
            </a>
            <Link href="/rezervasyon" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">
                Online Rezervasyon
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
