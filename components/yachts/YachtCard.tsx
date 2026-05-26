"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Maximize2 } from "lucide-react";
import { Yacht } from "../../types/yacht";
import { Badge } from "../ui/Badge";
import { formatPrice } from "../../lib/utils";

interface YachtCardProps {
  yacht: Yacht;
}

export function YachtCard({ yacht }: YachtCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="group relative bg-white/5 border border-white/12 rounded-[32px] overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-[#2ED3C6] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1">
      {/* Visual media container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#063B45]">
        <Image
          src={yacht.images[0]}
          alt={yacht.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="w-10 h-10 rounded-full bg-[#021C24]/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-red-500 transition-all cursor-pointer"
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-red-500" : ""} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 z-10">
          <Badge variant="turquoise">{yacht.capacity} Misafir</Badge>
        </div>
      </div>

      {/* Details info container */}
      <div className="p-6 flex flex-col justify-between flex-1 gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <h3 className="font-serif text-2xl text-white font-medium group-hover:text-[#2ED3C6] transition-all">
              {yacht.name}
            </h3>
            <span className="text-[11px] font-bold text-white/50 border border-white/12 px-2.5 py-1 rounded">
              {yacht.length}
            </span>
          </div>
          <p className="text-white/60 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {yacht.shortDescription}
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/8 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-white/50">Saatlik Fiyat</span>
              <strong className="text-[#2ED3C6] text-xl font-bold">{formatPrice(yacht.hourlyPrice)}</strong>
            </div>
            <div className="text-right flex flex-col text-xs text-white/50 gap-0.5">
              <span>{yacht.cabins} Kabin • {yacht.speed} Hız</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/yatlarimiz/${yacht.slug}`} className="flex-1">
              <button className="w-full py-3 rounded-full border border-white/12 text-white text-xs font-bold bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                Detayları Gör
              </button>
            </Link>
            <Link href={`/rezervasyon?yacht=${yacht.slug}`} className="flex-1">
              <button className="w-full py-3 rounded-full bg-[#2ED3C6] text-[#021C24] text-xs font-bold hover:shadow-[0_0_20px_rgba(46,211,198,0.4)] transition-all cursor-pointer">
                Rezervasyon
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
