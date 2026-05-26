import { Metadata } from "next";
import { getSiteMetadata } from "../../../lib/seo";
import { YACHTS } from "../../../lib/data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getYachtSchema } from "../../../lib/schema";
import { Phone, MessageSquare, Compass, Shield, Users, Wind, DollarSign } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const yacht = YACHTS.find((y) => y.slug === slug);
  if (!yacht) return {};
  return getSiteMetadata(yacht.seo.title, yacht.seo.description, `/yatlarimiz/${yacht.slug}`);
}

export default async function YachtDetailPage({ params }: Props) {
  const { slug } = await params;
  const yacht = YACHTS.find((y) => y.slug === slug);
  if (!yacht) {
    notFound();
  }

  const schemaJson = getYachtSchema(yacht);

  return (
    <main className="bg-[#021C24] min-h-screen text-white pt-32 pb-24">
      {/* Schema.org integration */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Main Details Panel */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          {/* Hero image visual */}
          <div className="relative w-full aspect-[16/9] rounded-[32px] overflow-hidden border border-white/12">
            <Image
              src={yacht.images[0]}
              alt={yacht.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-[#2ED3C6] font-bold">Özel Yat Filosu</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="text-xs text-white/50">{yacht.length} Uzunluk</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl text-white font-medium leading-none">
              {yacht.name}
            </h1>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed mt-2">
              {yacht.description}
            </p>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/8 rounded-2xl p-6 text-center">
              <span className="text-xs text-white/50 block mb-1">Maksimum Kapasite</span>
              <strong className="text-white text-lg font-semibold">{yacht.capacity} Misafir</strong>
            </div>
            <div className="bg-white/5 border border-white/8 rounded-2xl p-6 text-center">
              <span className="text-xs text-white/50 block mb-1">Yemekli Kapasite</span>
              <strong className="text-white text-lg font-semibold">{yacht.diningCapacity} Kişi</strong>
            </div>
            <div className="bg-white/5 border border-white/8 rounded-2xl p-6 text-center">
              <span className="text-xs text-white/50 block mb-1">Seyir Hızı</span>
              <strong className="text-white text-lg font-semibold">{yacht.speed}</strong>
            </div>
            <div className="bg-white/5 border border-white/8 rounded-2xl p-6 text-center">
              <span className="text-xs text-white/50 block mb-1">Kabin Sayısı</span>
              <strong className="text-white text-lg font-semibold">{yacht.cabins} Kabin</strong>
            </div>
            <div className="bg-white/5 border border-white/8 rounded-2xl p-6 text-center">
              <span className="text-xs text-white/50 block mb-1">Banyo Sayısı</span>
              <strong className="text-white text-lg font-semibold">{yacht.bathrooms} Banyo</strong>
            </div>
            <div className="bg-white/5 border border-white/8 rounded-2xl p-6 text-center">
              <span className="text-xs text-white/50 block mb-1">Mürettebat</span>
              <strong className="text-white text-lg font-semibold">{yacht.crew} Profesyonel</strong>
            </div>
          </div>

          {/* Amenities checklist */}
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-2xl sm:text-3xl text-white">Yat Olanakları</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {yacht.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ED3C6]" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Packages */}
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-2xl sm:text-3xl text-white">Paket Seçenekleri</h2>
            <div className="flex flex-col gap-4">
              {yacht.packages.map((pkg, index) => (
                <div key={index} className="bg-white/4 border border-white/8 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-white">{pkg.title}</h3>
                    <p className="text-xs text-white/50 mt-1">{pkg.description}</p>
                  </div>
                  <div className="text-right flex flex-col gap-1 items-start sm:items-end">
                    <span className="text-xs text-white/50">{pkg.duration}</span>
                    <strong className="text-[#2ED3C6] text-xl font-bold">€{pkg.price}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Dynamic Sticky booking Card sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-[110px] flex flex-col gap-6">
          <div className="bg-[#063B45]/40 border border-white/12 rounded-[32px] p-6 lg:p-8 flex flex-col gap-6 backdrop-blur-2xl">
            <div className="flex items-end justify-between border-b border-white/10 pb-5">
              <span className="text-xs text-white/50">Saatlik Başlayan</span>
              <strong className="text-[#2ED3C6] text-3xl font-bold">€{yacht.hourlyPrice}</strong>
            </div>

            <p className="text-white/60 text-sm leading-relaxed">
              Fiyatlarımıza kaptan, mürettebat, yakıt ve sigorta dahildir. Rezervasyonunuzu online olarak başlatabilir veya temsilcimizle WhatsApp üzerinden görüşebilirsiniz.
            </p>

            <div className="flex flex-col gap-3.5 mt-2">
              <Link href={`/rezervasyon?yacht=${yacht.slug}`} className="w-full">
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
              <a href="tel:+902125556677" className="w-full">
                <button className="w-full bg-transparent border border-white/16 text-white py-4 rounded-full font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-white/5 transition-all cursor-pointer">
                  <Phone size={16} />
                  <span>Hemen Telefonla Ara</span>
                </button>
              </a>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
