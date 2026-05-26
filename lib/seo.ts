import { Yacht } from "../types/yacht";
import { Experience } from "../types/experience";
import { BlogPost } from "../types/blog";

export function getSiteMetadata(title: string, description: string, path = "") {
  const url = `https://bosphorusyachtcharter.com${path}`;
  return {
    title,
    description,
    metadataBase: new URL("https://bosphorusyachtcharter.com"),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Bosphorus Yacht Charter",
      images: [
        {
          url: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200",
          width: 1200,
          height: 630,
          alt: "Bosphorus Yacht Charter",
        },
      ],
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
      },
    },
  };
}
