import { Metadata } from "next";
import { getSiteMetadata } from "../../lib/seo";
import BookingClient from "./BookingClient";
import { getYachts, getExperiences, getServices } from "../../lib/api";

export const metadata: Metadata = getSiteMetadata(
  "Online Rezervasyon | yatigotr",
  "İstanbul Boğazı yat kiralama rezervasyonunuzu anında oluşturun. İhtiyaçlarınıza uygun yatı seçin ve fiyat teklifini anında görün."
);

interface PageProps {
  searchParams: Promise<{ 
    yacht?: string;
    experience?: string;
    date?: string;
    guests?: string;
  }>;
}

export default async function BookingPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const initialYachtSlug = resolvedSearchParams?.yacht;
  const initialExperienceSlug = resolvedSearchParams?.experience;
  const initialDate = resolvedSearchParams?.date;
  const initialGuests = resolvedSearchParams?.guests;

  const [yachts, experiences, services] = await Promise.all([
    getYachts(),
    getExperiences(),
    getServices(),
  ]);
  
  return (
    <BookingClient 
      yachts={yachts} 
      experiences={experiences} 
      services={services} 
      initialYachtSlug={initialYachtSlug} 
      initialExperienceSlug={initialExperienceSlug}
      initialDate={initialDate}
      initialGuests={initialGuests}
    />
  );
}
