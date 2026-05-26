import { Metadata } from "next";
import { getSiteMetadata } from "../lib/seo";
import { HeroCinematic } from "../components/home/HeroCinematic";
import { StatsStrip } from "../components/home/StatsStrip";
import { StepsSection } from "../components/home/StepsSection";
import { FeaturedYachts } from "../components/home/FeaturedYachts";
import { YachtSpecShowcase } from "../components/home/YachtSpecShowcase";
import { ExperiencePreview } from "../components/home/ExperiencePreview";
import { PricingPreview } from "../components/home/PricingPreview";
import { ReviewsSection } from "../components/home/ReviewsSection";
import { FinalCTA } from "../components/home/FinalCTA";
import { getLocalBusinessSchema } from "../lib/schema";

export const metadata: Metadata = getSiteMetadata(
  "İstanbul Boğazı Özel Yat Kiralama | VIP Bosphorus Yacht Charter",
  "Awwwards kalitesinde lüks özel yat kiralama platformu. İstanbul Boğazı'nda evlilik teklifi, doğum günü, yemekli yat turu ve Adalar turları için premium filomuz."
);

export default function Home() {
  const schemaJson = getLocalBusinessSchema();

  return (
    <main className="bg-[#021C24] min-h-screen text-white overflow-hidden">
      {/* LocalBusiness Structured schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <HeroCinematic />
      <StatsStrip />
      <StepsSection />
      <FeaturedYachts />
      <YachtSpecShowcase />
      <ExperiencePreview />
      <PricingPreview />
      <ReviewsSection />
      <FinalCTA />
    </main>
  );
}
