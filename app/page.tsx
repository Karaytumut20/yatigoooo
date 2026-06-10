import { Metadata } from "next";
import { getSiteMetadata } from "../lib/seo";
import { HeroCinematic } from "../components/home/HeroCinematic";
import { StatsStrip } from "../components/home/StatsStrip";
import { StepsSection } from "../components/home/StepsSection";
import { FeaturedYachts } from "../components/home/FeaturedYachts";
import { ExperiencePreview } from "../components/home/ExperiencePreview";
import { ReviewsSection } from "../components/home/ReviewsSection";
import { FinalCTA } from "../components/home/FinalCTA";
import { getLocalBusinessSchema } from "../lib/schema";
import { getYachts, getExperiences } from "../lib/api";

export const metadata: Metadata = getSiteMetadata(
  "İstanbul Boğazı Özel Yat Kiralama | VIP yatigotr",
  "Awwwards kalitesinde lüks özel yat kiralama platformu. İstanbul Boğazı'nda evlilik teklifi, doğum günü, yemekli yat turu ve Adalar turları için premium filomuz."
);

export default async function Home() {
  const schemaJson = getLocalBusinessSchema();
  const [yachts, experiences] = await Promise.all([getYachts(), getExperiences()]);

  return (
    <main className="bg-white min-h-screen overflow-hidden">
      {/* LocalBusiness Structured schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <HeroCinematic yachts={yachts} experiences={experiences} />
      <StatsStrip />
      <StepsSection />
      <FeaturedYachts yachts={yachts} />
      <ExperiencePreview experiences={experiences} />
      <ReviewsSection />
      <FinalCTA />
    </main>
  );
}
