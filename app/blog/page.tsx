"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "../../lib/data";
import { FinalCTA } from "../../components/home/FinalCTA";

export default function BlogCatalogPage() {
  const featured = BLOG_POSTS[0];

  return (
    <main className="bg-[#021C24] min-h-screen text-white pt-32 pb-12">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 mb-12">
        <div className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-widest text-[#2ED3C6] font-bold">Bosphorus Editorial</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white leading-none">
            Yatçılık Dergisi
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-[620px] leading-relaxed mt-2">
            Lüks yatçılık kültürü, İstanbul Boğazı gezi rehberleri ve özel tüyolarla dolu dergimizi keşfedin.
          </p>
        </div>
      </div>

      {/* Featured post */}
      {featured && (
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 mb-16">
          <div className="bg-white/5 border border-white/12 rounded-[32px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 items-center">
            <div className="lg:col-span-7 relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#063B45]">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-xs text-white/50 uppercase tracking-wider font-bold">
                <span className="text-[#2ED3C6]">{featured.category}</span>
                <span>•</span>
                <span>{featured.readTime}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl text-white font-medium group-hover:text-[#2ED3C6] transition-all">
                {featured.title}
              </h2>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                {featured.excerpt}
              </p>
              <div className="pt-2">
                <Link href={`/blog/${featured.slug}`}>
                  <button className="px-6 py-3.5 rounded-full bg-[#2ED3C6] text-[#021C24] text-xs font-bold hover:shadow-[0_0_15px_rgba(46,211,198,0.4)] transition-all cursor-pointer">
                    Okumaya Devam Et
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of posts */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.slug}
            className="group bg-white/5 border border-white/12 rounded-[32px] overflow-hidden flex flex-col transition-all duration-300 hover:border-[#2ED3C6] hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#063B45]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-8 flex flex-col justify-between flex-1 gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-white/50 uppercase tracking-wider font-bold">
                  <span className="text-[#2ED3C6]">{post.category}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-serif text-2xl text-white font-medium group-hover:text-[#2ED3C6] transition-all">
                  {post.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
              <div className="border-t border-white/8 pt-5">
                <Link href={`/blog/${post.slug}`} className="w-full block">
                  <button className="w-full py-3 rounded-full border border-white/12 text-white text-xs font-bold hover:bg-white/10 transition-all cursor-pointer">
                    Yazıyı Oku
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FinalCTA />
    </main>
  );
}
