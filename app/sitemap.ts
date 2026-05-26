import { YACHTS, EXPERIENCES, BLOG_POSTS } from "../lib/data";

export default async function sitemap() {
  const baseUrl = "https://bosphorusyachtcharter.com";

  // Static pages
  const staticPages = [
    "",
    "/yatlarimiz",
    "/deneyimler",
    "/yat-kiralama-fiyatlari",
    "/rezervasyon",
    "/blog",
    "/hakkimizda",
    "/iletisim",
    "/sikca-sorulanlar",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic Yacht pages
  const yachtPages = YACHTS.map((y) => ({
    url: `${baseUrl}/yatlarimiz/${y.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Experience pages
  const experiencePages = EXPERIENCES.map((e) => ({
    url: `${baseUrl}/deneyimler/${e.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Blog pages
  const blogPages = BLOG_POSTS.map((bp) => ({
    url: `${baseUrl}/blog/${bp.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...yachtPages, ...experiencePages, ...blogPages];
}
