import { Metadata } from "next";
import { getSiteMetadata } from "../../../lib/seo";
import { EXPERIENCES, YACHTS } from "../../../lib/data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExperienceSchema } from "../../../lib/schema";
import { Phone, MessageSquare, Compass, Shield, Users, CheckCircle2 } from "lucide-react";
import { Accordion } from "../../../components/ui/Accordion";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exp = EXPERIENCES.find((e) => e.slug === slug);
  if (!exp) return {};
  return getSiteMetadata(exp.seo.title, exp.seo.description, `/deneyimler/${exp.slug}`);
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params;
  const exp = EXPERIENCES.find((e) => e.slug === slug);
  if (!exp) {
    notFound();
  }

  const schemaJson = getExperienceSchema(exp);

  return (
    <main className="bg-[#021C24] min-h-screen text-white pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Main Details Panel */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          <div className="relative w-full aspect-[16/9] rounded-[32px] overflow-hidden border border-white/12">
            <Image
              src={exp.image}
              alt={exp.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-[#2ED3C6] font-bold">Özel Boğaz Deneyimleri</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="text-xs text-white/50">{exp.duration} Ortalama Süre</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl text-white font-medium leading-none">
              {exp.title}
            </h1>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed mt-2">
              {exp.description}
            </p>
          </div>

          {/* Suitable for & includes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white/4 border border-white/8 rounded-[24px] p-6">
              <h3 className="font-serif text-xl text-[#C6A15B] mb-4">Kimler İçin Uygun?</h3>
              <ul className="flex flex-col gap-3 text-sm text-white/75">
                {exp.suitableFor.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[#2ED3C6]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/4 border border-white/8 rounded-[24px] p-6">
              <h3 className="font-serif text-xl text-[#2ED3C6] mb-4">Paket İçeriği Nelerdir?</h3>
              <ul className="flex flex-col gap-3 text-sm text-white/75">
                {exp.includes.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[#C6A15B]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sample Flow Timeline */}
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-2xl sm:text-3xl text-white">Örnek Tur Akışı</h2>
            <div className="flex flex-col gap-4 border-l border-white/10 pl-6 ml-2">
              {exp.sampleFlow.map((flow, i) => (
                <div key={i} className="relative py-2">
                  <span className="absolute -left-[31px] top-4 w-2.5 h-2.5 rounded-full bg-[#2ED3C6] border-2 border-[#021C24]" />
                  <p className="text-sm sm:text-base text-white/80">{flow}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-2xl sm:text-3xl text-white">Sıkça Sorulan Sorular</h2>
            <Accordion items={exp.faq} />
          </div>

        </div>

        {/* Dynamic Booking Card Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-[110px] flex flex-col gap-6">
          <div className="bg-[#063B45]/40 border border-white/12 rounded-[32px] p-6 lg:p-8 flex flex-col gap-6 backdrop-blur-2xl">
            <div className="flex items-end justify-between border-b border-white/10 pb-5">
              <span className="text-xs text-white/50">Tahmini Fiyat</span>
              <strong className="text-[#C6A15B] text-3xl font-bold">€{exp.startingPrice}</strong>
            </div>

            <p className="text-white/60 text-sm leading-relaxed">
              Özel ekstralar ve seçilen yat türüne bağlı olarak nihai fiyat değişiklik gösterebilir. Formu doldurarak anında teklifinizi alın.
            </p>

            <div className="flex flex-col gap-3.5 mt-2">
              <Link href={`/rezervasyon?experience=${exp.slug}`} className="w-full">
                <button className="w-full bg-[#2ED3C6] hover:bg-white text-[#021C24] py-4 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(46,211,198,0.4)] cursor-pointer">
                  Online Rezervasyon Yap
                </button>
              </Link>
              <a href="https://wa.me/905556667788" className="w-full">
                <button className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 rounded-full font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] cursor-pointer">
                  <MessageSquare size={16} />
                  <span>WhatsApp ile Danış</span>
                </button>
              </a>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
