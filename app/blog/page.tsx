import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getBlogPosts } from "../../lib/api";
import { FinalCTA } from "../../components/home/FinalCTA";

export default async function BlogCatalogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="bg-slate-50 min-h-screen pt-32 pb-12">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 mb-12">
        <div className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-widest text-blue-600 font-bold">Bosphorus Editorial</span>
          <h1 className="font-sans text-4xl sm:text-6xl text-slate-900 font-bold leading-none">
            Yatçılık Dergisi
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-[620px] leading-relaxed mt-2">
            Lüks yatçılık kültürü, İstanbul Boğazı gezi rehberleri ve özel tüyolarla dolu dergimizi keşfedin.
          </p>
        </div>
      </div>

      {/* Grid of posts */}
      <div className="max-w-[1600px] mx-auto px-5 sm:px-10 lg:px-16 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-20">
        {posts.map((post) => (
          <div key={post.slug} className="group relative aspect-[4/5] flex flex-col border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-slate-200">
            <div className="relative h-[46%] w-full shrink-0 overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50">
              {post.showImage !== false ? (
                <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <>
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[18px] border-blue-100/70" />
                  <div className="absolute left-5 bottom-5 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Bosphorus Editorial</div>
                </>
              )}
            </div>
            <div className="relative p-5 flex flex-col justify-between flex-1 min-h-0 gap-4">
              <div className="relative flex flex-col min-h-0 gap-2">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  <span className="text-blue-600">{post.category}</span>
                </div>
                <h3 className="font-sans font-bold transition-all line-clamp-3 text-lg text-slate-900 group-hover:text-blue-600">
                  {post.title}
                </h3>
                <p className="text-sm leading-relaxed line-clamp-3 text-slate-500">
                  {post.excerpt}
                </p>
              </div>
              <div className="relative w-full pt-3 border-t border-slate-100">
                <Link href={`/blog/${post.slug}`} className="w-full block">
                  <button className="w-full py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600">
                    Yazıyı Oku →
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
