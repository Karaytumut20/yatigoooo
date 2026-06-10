import { Metadata } from "next";
import { getSiteMetadata } from "../../lib/seo";
import YachtsCatalogClient from "./YachtsCatalogClient";
import { getYachts } from "../../lib/api";

export const metadata: Metadata = getSiteMetadata(
  "Yatlarımız | yatigotr",
  "İstanbul Boğazı'nın en prestijli lüks yat filosu. Özel kutlamalar, davetler ve kurumsal organizasyonlar için saatlik veya günlük yat kiralama seçenekleri."
);

export default async function YachtsPage() {
  const yachts = await getYachts();
  
  return <YachtsCatalogClient yachts={yachts} />;
}
