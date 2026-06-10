import { Metadata } from "next";
import { getSiteMetadata } from "../../../lib/seo";
import { getBlogPosts } from "../../../lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogArticleSchema } from "../../../lib/schema";
import { ArrowLeft, CalendarDays, Clock3, Link as LinkIcon, Share2, UserRound } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return getSiteMetadata(post.title, post.excerpt || "", `/blog/${post.slug}`);
}

import { formatDate } from "../../../lib/utils";

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    notFound();
  }

  const schemaJson = getBlogArticleSchema(post);
  const relatedPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <main className="bg-slate-50 min-h-screen text-slate-800 pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <article>
        <header className="max-w-[1040px] mx-auto px-5 sm:px-10 flex flex-col gap-6 mb-10 text-center items-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowLeft size={16} />
            Tüm yazılara dön
          </Link>
          <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-slate-400 uppercase tracking-wider font-bold">
            <span className="text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">{post.category}</span>
          </div>
          <h1 className="font-sans max-w-[940px] text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-slate-900">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="max-w-[720px] text-sm sm:text-lg leading-relaxed text-slate-500">
              {post.excerpt}
            </p>
          )}
          <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2"><UserRound size={16} className="text-blue-500" /> Bosphorus Editorial</span>
            <span className="inline-flex items-center gap-2"><CalendarDays size={16} className="text-blue-500" /> {formatDate(post.date)}</span>
            <span className="inline-flex items-center gap-2"><Clock3 size={16} className="text-blue-500" /> {post.readTime} okuma</span>
          </div>
        </header>

        {post.showImage !== false && (
          <div className="relative max-w-[1200px] mx-auto aspect-[16/8] rounded-none sm:rounded-3xl overflow-hidden border-y sm:border border-slate-200 shadow-xl mb-12 bg-slate-100">
            <Image src={post.image} alt={post.title} fill className="object-cover" />
          </div>
        )}

        <div className="max-w-[1040px] mx-auto px-5 sm:px-10 grid grid-cols-1 lg:grid-cols-[72px_minmax(0,1fr)] gap-8 items-start">
          <aside className="hidden lg:flex sticky top-28 flex-col items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 [writing-mode:vertical-rl] rotate-180 mb-2">Paylaş</span>
            {[Share2, LinkIcon].map((Icon, index) => (
              <button key={index} aria-label="Yazıyı paylaş" className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-500 flex items-center justify-center hover:border-blue-200 hover:text-blue-600 transition-colors shadow-sm">
                <Icon size={16} />
              </button>
            ))}
          </aside>

          <div>
            <div
              className="max-w-none text-slate-700 text-[16px] sm:text-[18px] leading-8 sm:leading-9 [&>p:first-child]:text-xl [&>p:first-child]:leading-9 [&>p:first-child]:text-slate-600 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-slate-900 [&_h3]:mt-9 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_p]:mb-6 [&_a]:font-semibold [&_a]:text-blue-600 [&_ul]:my-7 [&_ul]:list-disc [&_ul]:pl-7 [&_ol]:my-7 [&_ol]:list-decimal [&_ol]:pl-7 [&_li]:mb-3 [&_li]:pl-1 [&_strong]:font-bold [&_strong]:text-slate-900 [&_blockquote]:my-10 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:bg-blue-50 [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:text-xl [&_blockquote]:font-medium [&_blockquote]:italic [&_blockquote]:text-slate-700 [&_img]:my-10 [&_img]:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col sm:flex-row gap-5 sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">BE</div>
                <div><strong className="block text-slate-900">Bosphorus Editorial</strong><span className="text-sm text-slate-500">Yatçılık, Boğaz kültürü ve özel organizasyon rehberleri</span></div>
              </div>
              <Link href="/blog" className="text-sm font-bold text-blue-600 hover:text-blue-700">Tüm yazılar →</Link>
            </div>

            <div className="mt-14 rounded-2xl border border-blue-100 bg-blue-50 px-6 py-10 sm:p-12 flex flex-col gap-6 items-center text-center">
              <h3 className="font-sans text-xl sm:text-3xl font-bold text-slate-900">İstanbul Boğazı Özel Yat Turunuzu Şimdi Planlayın</h3>
              <p className="text-slate-600 text-sm max-w-[500px]">Profesyonel ekip ve elit yatlarımızla rüya gibi bir organizasyonu anında rezerve edebilirsiniz.</p>
              <Link href="/rezervasyon"><button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_8px_24px_rgba(37,99,235,0.3)] cursor-pointer">Online Rezervasyon Yap</button></Link>
            </div>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-5 sm:px-10 mt-20">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div><span className="text-xs uppercase tracking-widest text-blue-600 font-bold">Okumaya Devam Edin</span><h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mt-2">İlgili Yazılar</h2></div>
            <Link href="/blog" className="hidden sm:block text-sm font-bold text-blue-600">Tüm yazılar →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((item) => (
              <Link key={item.slug} href={`/blog/${item.slug}`} className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
                {item.showImage !== false && <div className="relative aspect-[16/10] bg-slate-100"><Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /></div>}
                <div className="p-5"><span className="text-xs font-bold uppercase tracking-wider text-blue-600">{item.category}</span><h3 className="mt-2 text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{item.title}</h3><p className="mt-3 text-xs text-slate-400">{item.readTime} okuma</p></div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
