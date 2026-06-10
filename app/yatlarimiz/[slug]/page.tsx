import { Metadata } from "next";
import { getSiteMetadata } from "../../../lib/seo";
import { getYachtBySlug, getSettings } from "../../../lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getYachtSchema } from "../../../lib/schema";
import { Phone, CheckCircle2 } from "lucide-react";
import { WhatsAppIcon } from "../../../components/ui/WhatsAppIcon";
import { formatPrice } from "../../../lib/utils";
import { getYachtImage } from "../../../lib/yacht-images";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const yacht = await getYachtBySlug(slug);
  if (!yacht) return {};
  return getSiteMetadata(yacht.name, yacht.shortDescription || "", `/yatlarimiz/${yacht.slug}`);
}

export default async function YachtDetailPage({ params }: Props) {
  const { slug } = await params;
  const [yacht, settings] = await Promise.all([getYachtBySlug(slug), getSettings()]);
  if (!yacht) {
    notFound();
  }

  const schemaJson = getYachtSchema(yacht);
  const visibleSpecs = yacht.visibleSpecs ?? {
    length: true,
    capacity: true,
    hourlyPrice: true,
  };

  return (
    <main className="bg-white min-h-screen pt-32 pb-24 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Main Details Panel */}
        <div className="lg:col-span-8 flex flex-col gap-8 lg:gap-10 min-w-0">
          
          {/* Hero image */}
          <div className="relative w-full aspect-[16/9] rounded-xl lg:rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
            <Image
              src={getYachtImage(yacht.images)}
              alt={yacht.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-3 lg:gap-4 min-w-0">
            <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-blue-600 font-bold whitespace-nowrap">Özel Yat Filosu</span>
              {(visibleSpecs.length || visibleSpecs.capacity) && (
                <>
                  <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-slate-300 shrink-0" />
                  <div className="flex items-center gap-1.5 lg:gap-2 text-[10px] sm:text-xs text-slate-500 flex-wrap">
                    {visibleSpecs.length && <span className="whitespace-nowrap">{yacht.length}</span>}
                    {visibleSpecs.length && visibleSpecs.capacity && <span className="shrink-0">•</span>}
                    {visibleSpecs.capacity && <span className="whitespace-nowrap">{yacht.capacity} Misafir</span>}
                  </div>
                </>
              )}
            </div>
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-slate-900 font-bold leading-tight break-words">
              {yacht.name}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed break-words overflow-wrap-anywhere">
              {yacht.description}
            </p>
          </div>

          {/* Amenities checklist */}
          {yacht.showAmenities !== false && (
            <div className="flex flex-col gap-4 lg:gap-6 min-w-0">
              <h2 className="font-sans text-xl sm:text-2xl lg:text-3xl text-slate-900 font-bold break-words">Yat Olanakları</h2>
              {yacht.amenities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  {yacht.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-start gap-2 lg:gap-3 text-xs sm:text-sm text-slate-600 min-w-0">
                      <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                      <span className="break-words overflow-wrap-anywhere">{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl lg:rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:p-6 text-xs sm:text-sm leading-relaxed text-slate-600 break-words">
                  Bu yatın standart konfor ve güvenlik donanımları rezervasyonunuza dahildir. Detaylı olanak bilgisi için ekibimizle iletişime geçebilirsiniz.
                </p>
              )}
            </div>
          )}

          {/* Packages */}
          {yacht.showPackages !== false && (
            <div className="flex flex-col gap-4 lg:gap-6 min-w-0">
              <h2 className="font-sans text-xl sm:text-2xl lg:text-3xl text-slate-900 font-bold break-words">Paket Seçenekleri</h2>
              {yacht.packages.length > 0 ? (
                <div className="flex flex-col gap-3 lg:gap-4">
                  {yacht.packages.map((pkg, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-xl lg:rounded-2xl p-4 lg:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 lg:gap-4 hover:shadow-lg hover:border-blue-200 transition-all min-w-0">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-slate-800 break-words">{pkg.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 break-words overflow-wrap-anywhere">{pkg.description}</p>
                      </div>
                      <div className="text-left sm:text-right flex flex-col gap-1 items-start sm:items-end shrink-0">
                        <span className="text-xs text-slate-400 whitespace-nowrap">{pkg.duration}</span>
                        <strong className="text-blue-600 text-lg sm:text-xl font-bold whitespace-nowrap">{formatPrice(pkg.price)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl lg:rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:p-6 text-xs sm:text-sm leading-relaxed text-slate-600 break-words">
                  Bu yat için saatlik kiralama ve özel organizasyon seçenekleri sunulmaktadır. Güncel paketler ve fiyatlandırma için ekibimizle iletişime geçebilirsiniz.
                </p>
              )}
            </div>
          )}

        </div>

        {/* Sticky booking sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-[110px] flex flex-col gap-6 min-w-0">
          <div className="bg-white border border-slate-200 rounded-xl lg:rounded-2xl p-5 sm:p-6 lg:p-8 flex flex-col gap-5 lg:gap-6 shadow-xl">
            {visibleSpecs.hourlyPrice && (
              <div className="flex items-end justify-between border-b border-slate-100 pb-4 lg:pb-5 gap-3">
                <span className="text-xs text-slate-400 whitespace-nowrap">Saatlik Başlayan</span>
                <strong className="text-blue-600 text-2xl sm:text-3xl font-bold break-words text-right">{formatPrice(yacht.hourlyPrice)}</strong>
              </div>
            )}

            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed break-words">
              Fiyatlarımıza kaptan, mürettebat, yakıt ve sigorta dahildir. Rezervasyonunuzu online olarak başlatabilir veya temsilcimizle WhatsApp üzerinden görüşebilirsiniz.
            </p>

            <div className="flex flex-col gap-3 lg:gap-3.5 mt-2">
              <Link href={`/rezervasyon?yacht=${yacht.slug}`} className="w-full">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_8px_30px_rgba(37,99,235,0.35)] cursor-pointer">
                  Bu Yat ile Rezervasyon Yap
                </button>
              </Link>
              <a href={`https://wa.me/${settings.whatsapp_number}`} className="w-full">
                <button className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(37,211,102,0.3)] cursor-pointer">
                  <WhatsAppIcon size={16} />
                  <span>WhatsApp ile Danış</span>
                </button>
              </a>
              <a href="tel:+902125556677" className="w-full">
                <button className="w-full bg-white border border-slate-200 text-slate-700 py-3.5 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-blue-200 transition-all cursor-pointer">
                  <Phone size={16} />
                  <span>Hemen Telefonla Ara</span>
                </button>
              </a>
            </div>
          </div>
        </div>

      </div>
      </div>
    </main>
  );
}
