import { Metadata } from "next";
import { getSiteMetadata } from "../../lib/seo";
import ExperiencesCatalogClient from "./ExperiencesCatalogClient";
import { getExperiences } from "../../lib/api";

export const metadata: Metadata = getSiteMetadata(
  "Deneyimler | yatigotr",
  "İstanbul Boğazı'nda romantik akşam yemekleri, özel kutlamalar ve kurumsal etkinlikler için premium yat kiralama deneyimleri."
);

export default async function ExperiencesPage() {
  const experiences = await getExperiences();
  
  return <ExperiencesCatalogClient experiences={experiences} />;
}
