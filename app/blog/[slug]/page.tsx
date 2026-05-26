import { Metadata } from "next";
import { getSiteMetadata } from "../../../lib/seo";
import { BLOG_POSTS } from "../../../lib/data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogArticleSchema } from "../../../lib/schema";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return getSiteMetadata(post.seo.title, post.seo.description, `/blog/${post.slug}`);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) {
    notFound();
  }

  const schemaJson = getBlogArticleSchema(post);

  return (
    <main className="bg-[#021C24] min-h-screen text-white pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <article className="max-w-[800px] mx-auto px-5 sm:px-10">
        <header className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-3 text-xs text-white/50 uppercase tracking-wider font-bold">
            <span className="text-[#2ED3C6]">{post.category}</span>
            <span>•</span>
            <span>{post.readTime}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium leading-tight">
            {post.title}
          </h1>
        </header>

        <div className="relative w-full aspect-[16/9] rounded-[32px] overflow-hidden border border-white/12 mb-10">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Article Body content */}
        <div
          className="prose prose-invert max-w-none text-white/70 text-sm sm:text-base leading-relaxed flex flex-col gap-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col gap-6 items-center text-center">
          <h3 className="font-serif text-xl sm:text-2xl text-white">İstanbul Boğazı Özel Yat Turunuzu Şimdi Planlayın</h3>
          <p className="text-white/60 text-sm max-w-[500px]">
            Profesyonel ekip ve elit yatlarımızla rüya gibi bir organizasyonu anında rezerve edebilirsiniz.
          </p>
          <Link href="/rezervasyon">
            <button className="bg-[#2ED3C6] hover:bg-white text-[#021C24] px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(46,211,198,0.4)] cursor-pointer">
              Online Rezervasyon Yap
            </button>
          </Link>
        </div>
      </article>
    </main>
  );
}
