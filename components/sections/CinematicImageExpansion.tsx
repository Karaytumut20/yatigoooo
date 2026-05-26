"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/Button";
import { QuickBookingBar } from "../home/QuickBookingBar";
import { CheckCircle2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type CinematicImageExpansionProps = {
  imageSrc: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function CinematicImageExpansion({
  imageSrc,
  imageAlt,
  eyebrow = "Premium Yacht Experience",
  title,
  description,
  ctaLabel = "Rezervasyon Yap",
  ctaHref = "/rezervasyon",
}: CinematicImageExpansionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Skip heavy animations if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const imageWrapper = imageWrapperRef.current;
    const content = contentRef.current;
    const overlay = overlayRef.current;
    const bgText = bgTextRef.current;

    if (!section || !imageWrapper || !content || !overlay || !bgText) return;

    // Responsive trigger options
    const isMobile = window.innerWidth < 768;
    const pinDuration = isMobile ? "120%" : "180%";

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${pinDuration}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Step 1: Scale down and fade background content (text and badges)
    tl.to(content, {
      opacity: 0,
      y: -50,
      scale: 0.95,
      duration: 1,
    }, 0);

    tl.to(bgText, {
      opacity: 0,
      scale: 0.9,
      duration: 1,
    }, 0);

    // Step 2: Expand small image container in the grid to full viewport width/height
    tl.to(imageWrapper, {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
      borderRadius: "0px",
      padding: "0px",
      duration: 2,
    }, 0.5);

    // Step 3: Fade in overlay text in the center
    tl.fromTo(overlay, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 },
      1.8
    );

    return () => {
      // Cleanup ScrollTrigger instances
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative h-screen w-full bg-[#021C24] overflow-hidden flex items-center">
      
      {/* Background large brand text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-5">
        <span ref={bgTextRef} className="font-serif text-[18vw] font-bold text-white/5 opacity-[0.06] tracking-tighter leading-none select-none">
          YATIGOTR
        </span>
      </div>

      {/* Grid container with initial small layout card */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full">
        
        {/* Left header text - collapses on scroll */}
        <div ref={contentRef} className="lg:col-span-7 flex flex-col gap-6 text-left py-12">
          <span className="text-xs uppercase tracking-widest text-[#2ED3C6] font-bold">
            {eyebrow}
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.1] tracking-tight">
            İstanbul Boğazı’nda <br />
            <span className="text-[#2ED3C6] font-medium italic">Size Özel</span> Yat Deneyimi
          </h1>
          <p className="text-white/75 text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-[620px]">
            {description}
          </p>
          <div className="flex flex-wrap gap-6 mt-6 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/70">
              <CheckCircle2 size={18} className="text-[#2ED3C6]" />
              <span>Güvenli Ödeme</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/70">
              <CheckCircle2 size={18} className="text-[#2ED3C6]" />
              <span>Profesyonel Mürettebat</span>
            </div>
          </div>
        </div>

        {/* Small grid card position that triggers expanding animation */}
        <div className="lg:col-span-5 relative w-full h-[400px] sm:h-[460px] flex items-center justify-center">
          <div 
            ref={imageWrapperRef}
            className="absolute w-[90%] h-[90%] sm:w-[85%] sm:h-[85%] border border-white/12 rounded-[28px] overflow-hidden z-10 bg-[#063B45]"
          >
            <div className="absolute inset-0 bg-[#021c24]/40 z-10 pointer-events-none" />
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#021C24]/80 via-transparent to-transparent h-1/2 bottom-0 z-10" />

            {/* Expands overlay text at full scale */}
            <div ref={overlayRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 sm:p-12 opacity-0">
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white mb-6 max-w-2xl leading-tight">
                {title}
              </h2>
              <p className="text-white/80 text-sm sm:text-base lg:text-lg max-w-[580px] leading-relaxed mb-8">
                {description}
              </p>
              <Link href={ctaHref}>
                <Button variant="primary" size="lg">
                  {ctaLabel}
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
