"use server";

import { unstable_cache } from "next/cache";
import { supabase } from "./supabase";
import { YACHTS, EXPERIENCES, BLOG_POSTS } from "./data";
import { Yacht } from "../types/yacht";
import { Experience } from "../types/experience";
import { BlogPost } from "../types/blog";
import { AdminBooking } from "../types/booking";
import { Service } from "../types/service";

const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const getCachedYachtRows = unstable_cache(async () => {
  const { data, error } = await supabase.from("yachts").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}, ["yachts"], { tags: ["yachts"], revalidate: 300 });

const getCachedYachtRow = unstable_cache(async (slug: string) => {
  const { data, error } = await supabase.from("yachts").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}, ["yacht-by-slug"], { tags: ["yachts"], revalidate: 300 });

const getCachedExperienceRows = unstable_cache(async () => {
  const { data, error } = await supabase.from("experiences").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}, ["experiences"], { tags: ["experiences"], revalidate: 300 });

const getCachedExperienceRow = unstable_cache(async (slug: string) => {
  const { data, error } = await supabase.from("experiences").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}, ["experience-by-slug"], { tags: ["experiences"], revalidate: 300 });

const getCachedBlogRows = unstable_cache(async () => {
  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}, ["blog-posts"], { tags: ["blog-posts"], revalidate: 300 });

const getCachedServiceRows = unstable_cache(async () => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}, ["services"], { tags: ["services"], revalidate: 300 });

const getCachedSettingsRow = unstable_cache(async () => {
  const { data, error } = await supabase.from("settings").select("*").limit(1).maybeSingle();
  if (error && error.code !== "PGRST116") throw error;
  return data;
}, ["settings"], { tags: ["settings"], revalidate: 300 });

interface DbYacht {
  slug: string;
  name: string;
  short_description: string;
  description: string;
  images: string[];
  capacity: number;
  dining_capacity: number;
  length: string;
  cabins?: number;
  bathrooms?: number;
  crew?: number;
  speed: string;
  hourly_price: number;
  min_hours?: number;
  full_day_price?: number;
  features?: string[];
  amenities?: string[];
  packages?: Yacht["packages"];
  seo?: Yacht["seo"];
  yacht_type?: string;
  cabin_count?: number;
  has_pool?: boolean;
  has_flybridge?: boolean;
  extra_guest_pricing?: any;
  pickup_points?: Yacht["pickupPoints"];
  dropoff_points?: Yacht["dropoffPoints"];
  experience_slugs?: string[];
  [key: string]: unknown;
}

export async function getYachts(): Promise<Yacht[]> {
  if (!hasSupabase) return YACHTS;
  
  try {
    const data = await getCachedYachtRows();
    
    if (!data) return [];
    return data.map(mapYacht) as Yacht[];
  } catch (error) {
    console.error("Error fetching yachts from Supabase:", error);
    return [];
  }
}

function mapYacht(dbYacht: DbYacht): Yacht {
  return {
    ...dbYacht,
    shortDescription: dbYacht.short_description,
    diningCapacity: dbYacht.dining_capacity,
    hourlyPrice: dbYacht.hourly_price,
    minHours: dbYacht.min_hours || 2,
    fullDayPrice: dbYacht.full_day_price,
    packages: dbYacht.packages || [],
    features: dbYacht.features || [],
    amenities: dbYacht.amenities || [],
    showAmenities: dbYacht.seo?.display_options?.show_amenities ?? true,
    showPackages: dbYacht.seo?.display_options?.show_packages ?? true,
    showFeatures: dbYacht.seo?.display_options?.show_features ?? true,
    yachtType: dbYacht.yacht_type,
    cabinCount: dbYacht.cabin_count,
    hasPool: dbYacht.has_pool,
    hasFlybridge: dbYacht.has_flybridge,
    extraGuestPricing: dbYacht.extra_guest_pricing || [],
    pickupPoints: dbYacht.pickup_points || [],
    dropoffPoints: dbYacht.dropoff_points || [],
    visibleSpecs: {
      length: dbYacht.seo?.display_options?.visible_specs?.length ?? true,
      capacity: dbYacht.seo?.display_options?.visible_specs?.capacity ?? true,
      hourlyPrice: dbYacht.seo?.display_options?.visible_specs?.hourly_price ?? true,
    },
    experienceSlugs: dbYacht.experience_slugs || [],
  };
}

export async function getYachtBySlug(slug: string): Promise<Yacht | null> {
  if (!hasSupabase) return YACHTS.find(y => y.slug === slug) || null;

  try {
    const data = await getCachedYachtRow(slug);
    if (!data) return null;
    return mapYacht(data);
  } catch (error) {
    console.error(`Error fetching yacht ${slug} from Supabase:`, error);
    return null;
  }
}

export async function getExperiences(): Promise<Experience[]> {
  if (!hasSupabase) return EXPERIENCES;

  try {
    const data = await getCachedExperienceRows();
    if (!data) return [];
    return data.map(mapExperience);
  } catch (error) {
    console.error("Error fetching experiences from Supabase:", error);
    return [];
  }
}

export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
  if (!hasSupabase) return EXPERIENCES.find(e => e.slug === slug) || null;

  try {
    const data = await getCachedExperienceRow(slug);
    if (!data) return null;
    return mapExperience(data);
  } catch (error) {
    console.error(`Error fetching experience ${slug} from Supabase:`, error);
    return null;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!hasSupabase) return BLOG_POSTS;

  try {
    const data = await getCachedBlogRows();
    if (!data) return [];
    return data.map(mapBlogPost);
  } catch (error) {
    console.error("Error fetching blog posts from Supabase:", error);
    return [];
  }
}

export async function getAdminExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase.from("experiences").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapExperience);
}

export async function getAdminBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapBlogPost);
}

export async function getServices(): Promise<Service[]> {
  if (!hasSupabase) return [];

  try {
    const data = await getCachedServiceRows();
    return (data || []).map(mapService);
  } catch (error) {
    console.error("Error fetching services from Supabase:", error);
    return [];
  }
}

export async function getAdminServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapService);
}

export async function getSettings() {
  if (!hasSupabase) {
    return {
      site_title: "yatigotr Turizm A.Ş.",
      site_description: "İstanbul Boğazı'nda lüks yat kiralama, teknede evlilik teklifi ve özel davet hizmetleri.",
      whatsapp_number: "905556667788",
      prepayment_percentage: 50
    };
  }

  try {
    const data = await getCachedSettingsRow();
    
    if (!data) {
      return {
        phone: "+90 212 555 66 77",
        email: "info@bosphorusyachtcharter.com",
        address: "Kuruçeşme Limanı, Beşiktaş / İstanbul",
        whatsapp_number: "905554443322",
        instagram_url: "https://instagram.com",
        facebook_url: "https://facebook.com",
        youtube_url: "https://youtube.com"
      };
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching settings from Supabase:", error);
    return {
      site_title: "yatigotr Turizm A.Ş.",
      site_description: "İstanbul Boğazı'nda lüks yat kiralama, teknede evlilik teklifi ve özel davet hizmetleri.",
      whatsapp_number: "905556667788",
      prepayment_percentage: 50
    };
  }
}

export async function createBooking(bookingData: Record<string, unknown>) {
  if (!hasSupabase) {
    console.log("Mock booking created:", bookingData);
    return { success: true, data: bookingData };
  }

  try {
    const { data, error } = await supabase.from("bookings").insert([bookingData]).select();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error creating booking in Supabase:", error);
    return { success: false, error };
  }
}

export async function getBookings(): Promise<AdminBooking[]> {
  if (!hasSupabase) return [];

  try {
    const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching bookings from Supabase:", error);
    return [];
  }
}

function mapExperience(row: Record<string, unknown>): Experience {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    category: (row.category as string) || "celebration",
    shortDescription: (row.short_description as string) || "",
    description: (row.description as string) || "",
    startingPrice: Number(row.starting_price || 0),
    duration: (row.duration as string) || "",
    image: (row.image as string) || "/yacht_aerial_hero.png",
    suitableFor: (row.suitable_for as string[]) || [],
    includes: (row.includes as string[]) || [],
    sampleFlow: (row.sample_flow as string[]) || [],
    recommendedYachts: (row.recommended_yachts as string[]) || [],
    faq: (row.faq as Experience["faq"]) || [],
    seo: row.seo as Experience["seo"],
  };
}

function mapBlogPost(row: Record<string, unknown>): BlogPost {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: (row.excerpt as string) || "",
    content: (row.content as string) || "",
    image: (row.image as string) || "/yacht_aerial_hero.png",
    category: (row.category as string) || "Genel",
    readTime: (row.read_time as string) || "5 dk",
    date: (row.published_at as string)?.slice(0, 10) || (row.created_at as string)?.slice(0, 10) || "",
    seo: row.seo as BlogPost["seo"],
    showImage: ((row.seo as BlogPost["seo"])?.display_options?.show_image) ?? true,
  };
}

function mapService(row: Record<string, unknown>): Service {
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) || "",
    price: Number(row.price || 0),
    priceType: row.price_type === "per_person" ? "per_person" : "fixed",
    isActive: row.is_active !== false,
    sortOrder: Number(row.sort_order || 0),
  };
}
