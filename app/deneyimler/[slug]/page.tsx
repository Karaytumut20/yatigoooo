import { Metadata } from "next";
import { getSiteMetadata } from "../../../lib/seo";
import { getExperienceBySlug, getYachts, getSettings } from "../../../lib/api";
import { getYachtImage } from "../../../lib/yacht-images";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExperienceSchema } from "../../../lib/schema";
import { CheckCircle2 } from "lucide-react";
import { WhatsAppIcon } from "../../../components/ui/WhatsAppIcon";
import { Accordion } from "../../../components/ui/Accordion";
import { formatPrice } from "../../../lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getExperienceBySlug(slug);
  if (!exp) return {};
  return getSiteMetadata(exp.title, exp.shortDescription || "", `/deneyimler/${exp.slug}`);
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [exp, yachts, settings] = await Promise.all([
    getExperienceBySlug(slug),
    getYachts(),
    getSettings(),
  ]);
  if (!exp) {
    notFound();
  }

  const schemaJson = getExperienceSchema(exp);

  // Filter recommended yachts based on the experience's recommendedYachts array
  const recommendedYachts = yachts.filter((yacht) =>
    exp.recommendedYachts.includes(yacht.slug)
  );

  return (
    <main className="bg-white min-h-screen pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Main Details Panel */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
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
              <span className="text-xs uppercase tracking-widest text-blue-600 font-bold">Özel Boğaz Deneyimleri</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-500">{exp.duration} Ortalama Süre</span>
            </div>
            <h1 className="font-sans text-4xl sm:text-6xl text-slate-900 font-bold leading-none">
              {exp.title}
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mt-2">
              {exp.description}
            </p>
          </div>

          {/* Suitable for & includes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <h3 className="font-sans text-lg text-blue-700 font-bold mb-4">Kimler İçin Uygun?</h3>
              <ul className="flex flex-col gap-3 text-sm text-slate-600">
                {exp.suitableFor.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h3 className="font-sans text-lg text-slate-800 font-bold mb-4">Paket İçeriği Nelerdir?</h3>
              <ul className="flex flex-col gap-3 text-sm text-slate-600">
                {exp.includes.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sample Flow Timeline */}
          <div className="flex flex-col gap-6">
            <h2 className="font-sans text-2xl sm:text-3xl text-slate-900 font-bold">Örnek Tur Akışı</h2>
            <div className="flex flex-col gap-4 border-l-2 border-blue-200 pl-6 ml-2">
              {exp.sampleFlow.map((flow, i) => (
                <div key={i} className="relative py-2">
                  <span className="absolute -left-[29px] top-4 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
                  <p className="text-sm sm:text-base text-slate-600">{flow}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="flex flex-col gap-6">
            <h2 className="font-sans text-2xl sm:text-3xl text-slate-900 font-bold">Sıkça Sorulan Sorular</h2>
            <Accordion items={exp.faq} />
          </div>

          {/* Recommended Yachts Section */}
          {recommendedYachts.length > 0 && (
            <div className="flex flex-col gap-6 mt-8">
              <div className="flex flex-col gap-2">
                <h2 className="font-sans text-2xl sm:text-3xl text-slate-900 font-bold">
                  Bu Yatlar ile {exp.title}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  {exp.title} deneyimi için özenle seçilmiş yatlarımız. Her biri bu özel anınız için mükemmel.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recommendedYachts.map((yacht) => (
                  <Link
                    key={yacht.slug}
                    href={`/yatlarimiz/${yacht.slug}`}
                    className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all duration-300"
                  >
                    {/* Yacht Image */}
                    <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
                      <Image
                        src={yacht.images[0] || "/yacht_aerial_hero.png"}
                        alt={yacht.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <p className="text-xs text-slate-600 font-medium">Başlangıç</p>
                        <p className="text-blue-600 font-bold text-lg leading-none mt-0.5">
                          {formatPrice(yacht.hourlyPrice)}/saat
                        </p>
                      </div>
                    </div>

                    {/* Yacht Details */}
                    <div className="p-6 flex flex-col gap-4">
                      <div>
                        <h3 className="font-sans text-xl text-slate-900 font-bold group-hover:text-blue-600 transition-colors">
                          {yacht.name}
                        </h3>
                        <p className="text-slate-600 text-sm mt-2 line-clamp-2">
                          {yacht.shortDescription}
                        </p>
                      </div>

                      {/* Yacht Specs */}
                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="font-medium">{yacht.capacity} Kişi</span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="font-medium">{yacht.length}</span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <button className="mt-2 w-full bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white py-3 rounded-xl font-semibold text-sm transition-all duration-300 group-hover:shadow-lg">
                        Yat Detaylarını Gör
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              {/* CTA to all yachts */}
              <div className="mt-6 text-center">
                <Link
                  href="/yatlarimiz"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
                >
                  <span>Tüm Yatlarımızı Keşfedin</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* Booking sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-[110px] flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex items-end justify-between border-b border-slate-100 pb-5">
              <span className="text-xs text-slate-400">Tahmini Fiyat</span>
              <strong className="text-blue-600 text-3xl font-bold">{formatPrice(exp.startingPrice)}</strong>
            </div>

            <p className="text-slate-500 text-sm leading-relaxed">
              Özel ekstralar ve seçilen yat türüne bağlı olarak nihai fiyat değişiklik gösterebilir. Formu doldurarak anında teklifinizi alın.
            </p>

            <div className="flex flex-col gap-3.5 mt-2">
              <Link href={`/rezervasyon?experience=${exp.slug}`} className="w-full">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_8px_30px_rgba(37,99,235,0.35)] cursor-pointer">
                  Online Rezervasyon Yap
                </button>
              </Link>
              <a href={`https://wa.me/${settings.whatsapp_number}`} className="w-full">
                <button className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 rounded-full font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(37,211,102,0.3)] cursor-pointer">
                  <WhatsAppIcon size={16} />
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
