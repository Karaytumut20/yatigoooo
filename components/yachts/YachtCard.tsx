"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Yacht } from "../../types/yacht";
import { Badge } from "../ui/Badge";
import { formatPrice } from "../../lib/utils";
import { getYachtImage } from "../../lib/yacht-images";

interface YachtCardProps {
  yacht: Yacht;
}

export function YachtCard({ yacht }: YachtCardProps) {
  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
      {/* Visual media container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={getYachtImage(yacht.images)}
          alt={yacht.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-4 left-4 z-10">
          <Badge variant="turquoise">{yacht.capacity} Misafir</Badge>
        </div>
      </div>

      {/* Details info container */}
      <div className="p-6 flex flex-col justify-between flex-1 gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <h3 className="font-sans text-xl text-slate-900 font-bold group-hover:text-blue-600 transition-all">
              {yacht.name}
            </h3>
            <span className="text-[11px] font-bold text-slate-400 border border-slate-200 px-2.5 py-1 rounded">
              {yacht.length}
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {yacht.shortDescription}
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-100 pt-5">
          <div className="flex items-center">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Saatlik Fiyat</span>
              <strong className="text-blue-600 text-xl font-bold">{formatPrice(yacht.hourlyPrice)}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/yatlarimiz/${yacht.slug}`} prefetch={false} className="flex-1">
              <button className="w-full py-3 rounded-full border border-slate-200 text-slate-700 text-xs font-bold bg-white hover:bg-slate-50 hover:border-blue-200 transition-all cursor-pointer">
                Detayları Gör
              </button>
            </Link>
            <Link href={`/rezervasyon?yacht=${yacht.slug}`} prefetch={false} className="flex-1">
              <button className="w-full py-3 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 hover:shadow-[0_4px_20px_rgba(37,99,235,0.3)] transition-all cursor-pointer">
                Rezervasyon
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
