import { Yacht } from "../types/yacht";
import { Experience } from "../types/experience";
import { BlogPost } from "../types/blog";

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Bosphorus Yacht Charter",
    "image": "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800",
    "telephone": "+902125556677",
    "email": "info@bosphorusyachtcharter.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kuruçeşme Cd. No:45",
      "addressLocality": "Beşiktaş",
      "addressRegion": "İstanbul",
      "postalCode": "34345",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.0601,
      "longitude": 29.0345
    },
    "url": "https://bosphorusyachtcharter.com",
    "priceRange": "$$$$"
  };
}

export function getYachtSchema(yacht: Yacht) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": yacht.name,
    "image": yacht.images[0],
    "description": yacht.shortDescription,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": yacht.hourlyPrice,
      "priceValidUntil": "2027-12-31",
      "availability": "https://schema.org/InStock"
    }
  };
}

export function getExperienceSchema(experience: Experience) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": experience.title,
    "description": experience.shortDescription,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Bosphorus Yacht Charter"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": experience.startingPrice
    }
  };
}

export function getBlogArticleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "image": [post.image],
    "datePublished": "2026-05-27T00:00:00Z",
    "author": {
      "@type": "Organization",
      "name": "Bosphorus Yacht Charter"
    }
  };
}
