"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath, updateTag } from "next/cache";
import { isValidYachtImageUrl } from "./yacht-images";
import { slugifyYacht } from "./yacht-slug";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Admin client bypasses RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const hasSupabase = !!(supabaseUrl && supabaseServiceKey);

export interface YachtMutationInput {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  length: string;
  capacity: number;
  hourly_price: number;
  images: string[];
  amenities: string[];
  features: string[];
  packages: Array<{
    title: string;
    duration: string;
    price: string | number;
    description: string;
  }>;
  yacht_type?: string;
  cabin_count?: number;
  has_pool?: boolean;
  has_flybridge?: boolean;
  extra_guest_pricing?: Array<{ min_guests: number; max_guests: number; price: number }>;
  pickup_points?: Array<{ name: string; price: number }>;
  dropoff_points?: Array<{ name: string; price: number }>;
  experience_slugs?: string[];
  seo?: {
    title?: string;
    description?: string;
    display_options: {
      show_amenities: boolean;
      show_packages: boolean;
      show_features: boolean;
      visible_specs: {
        length: boolean;
        capacity: boolean;
        hourly_price: boolean;
      };
    };
  };
}

function validateYachtData(yachtData: YachtMutationInput) {
  if (!slugifyYacht(yachtData.slug || yachtData.name)) {
    return "Yat adı veya slug geçerli bir URL oluşturmalıdır.";
  }

  if (!yachtData.images.length || yachtData.images.some((image) => !isValidYachtImageUrl(image))) {
    return "En az bir geçerli http:// veya https:// görsel URL'si girmelisiniz.";
  }

  return null;
}

function revalidateYachtPages(slug: string) {
  updateTag("yachts");
  revalidatePath("/admin/yachts");
  revalidatePath("/yatlarimiz");
  revalidatePath(`/yatlarimiz/${slug}`);
  revalidatePath("/");
}

export async function createYacht(yachtData: YachtMutationInput) {
  const validationError = validateYachtData(yachtData);
  if (validationError) return { success: false, error: { message: validationError } };
  const normalizedYachtData = { ...yachtData, slug: slugifyYacht(yachtData.slug || yachtData.name) };

  if (!hasSupabase) {
    console.log("Mock yacht created:", normalizedYachtData);
    return { success: true, data: normalizedYachtData, slug: normalizedYachtData.slug };
  }

  try {
    const { data, error } = await supabaseAdmin.from("yachts").insert([normalizedYachtData]).select();
    if (error) throw error;
    revalidateYachtPages(normalizedYachtData.slug);
    return { success: true, data, slug: normalizedYachtData.slug };
  } catch (error) {
    console.error("Error creating yacht in Supabase:", error);
    return { success: false, error: { message: error instanceof Error ? error.message : "Yat kaydedilemedi." } };
  }
}

export async function updateYacht(slug: string, yachtData: YachtMutationInput) {
  const validationError = validateYachtData(yachtData);
  if (validationError) return { success: false, error: { message: validationError } };
  const normalizedYachtData = { ...yachtData, slug: slugifyYacht(yachtData.slug || yachtData.name) };

  if (!hasSupabase) return { success: true, data: normalizedYachtData, slug: normalizedYachtData.slug };

  try {
    const { data, error } = await supabaseAdmin.from("yachts").update(normalizedYachtData).eq("slug", slug).select();
    if (error) throw error;
    revalidateYachtPages(slug);
    if (slug !== normalizedYachtData.slug) revalidateYachtPages(normalizedYachtData.slug);
    return { success: true, data, slug: normalizedYachtData.slug };
  } catch (error) {
    console.error(`Error updating yacht ${slug} in Supabase:`, error);
    return { success: false, error: { message: error instanceof Error ? error.message : "Yat güncellenemedi." } };
  }
}

export async function deleteYacht(slug: string) {
  if (!hasSupabase) return { success: true };

  try {
    const { error } = await supabaseAdmin.from("yachts").delete().eq("slug", slug);
    if (error) throw error;
    revalidateYachtPages(slug);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting yacht ${slug} from Supabase:`, error);
    return { success: false, error: { message: error instanceof Error ? error.message : "Yat silinemedi." } };
  }
}

export interface ExperienceMutationInput {
  slug: string; title: string; category: string; short_description: string; description: string;
  starting_price: number; duration: string; image: string; suitable_for: string[]; includes: string[];
  sample_flow: string[]; recommended_yachts: string[]; faq: Array<{ question: string; answer: string }>;
}

export interface BlogMutationInput {
  slug: string; title: string; excerpt: string; content: string; image: string; category: string;
  read_time: string; published_at: string; seo?: { display_options: { show_image: boolean } };
}

export interface ServiceMutationInput {
  name: string;
  description: string;
  price: number;
  price_type: "fixed" | "per_person";
  is_active: boolean;
  sort_order: number;
}

function actionError(error: unknown, fallback: string) {
  console.error("Action error occurred:", error);
  if (error && typeof error === "object") {
    const errObj = error as Record<string, any>;
    if (errObj.code === "23505") {
      return { success: false, error: { message: "Bu başlık veya URL (slug) zaten başka bir kayıt tarafından kullanılıyor. Lütfen benzersiz bir başlık veya slug belirleyin." } };
    }
    if (errObj.message) {
      return { success: false, error: { message: errObj.message + (errObj.details ? ` (${errObj.details})` : "") } };
    }
  }
  return { success: false, error: { message: error instanceof Error ? error.message : fallback } };
}

function revalidateContent(paths: string[]) {
  paths.forEach((path) => revalidatePath(path));
  revalidatePath("/");
}

export async function createExperience(input: ExperienceMutationInput) {
  try {
    const data = { ...input, slug: slugifyYacht(input.slug || input.title) };
    let { error } = await supabaseAdmin.from("experiences").insert([data]);
    if (error?.code === "PGRST204") {
      const { recommended_yachts: _recommended, faq: _faq, ...legacyData } = data;
      ({ error } = await supabaseAdmin.from("experiences").insert([legacyData]));
    }
    if (error) throw error;
    updateTag("experiences");
    revalidateContent(["/admin/experiences", "/deneyimler", `/deneyimler/${data.slug}`]);
    return { success: true };
  } catch (error) { return actionError(error, "Deneyim kaydedilemedi."); }
}

export async function updateExperience(slug: string, input: ExperienceMutationInput) {
  try {
    const data = { ...input, slug: slugifyYacht(input.slug || input.title) };
    let { error } = await supabaseAdmin.from("experiences").update(data).eq("slug", slug);
    if (error?.code === "PGRST204") {
      const { recommended_yachts: _recommended, faq: _faq, ...legacyData } = data;
      ({ error } = await supabaseAdmin.from("experiences").update(legacyData).eq("slug", slug));
    }
    if (error) throw error;
    updateTag("experiences");
    revalidateContent(["/admin/experiences", "/deneyimler", `/deneyimler/${slug}`, `/deneyimler/${data.slug}`]);
    return { success: true };
  } catch (error) { return actionError(error, "Deneyim güncellenemedi."); }
}

export async function deleteExperience(slug: string) {
  try {
    const { error } = await supabaseAdmin.from("experiences").delete().eq("slug", slug);
    if (error) throw error;
    updateTag("experiences");
    revalidateContent(["/admin/experiences", "/deneyimler", `/deneyimler/${slug}`]);
    return { success: true };
  } catch (error) { return actionError(error, "Deneyim silinemedi."); }
}

export async function createBlogPost(input: BlogMutationInput) {
  try {
    const data = { ...input, slug: slugifyYacht(input.slug || input.title) };
    let { error } = await supabaseAdmin.from("blog_posts").insert([data]);
    if (error?.code === "PGRST204") {
      const { published_at: _published, ...legacyData } = data;
      ({ error } = await supabaseAdmin.from("blog_posts").insert([{ ...legacyData, created_at: input.published_at }]));
    }
    if (error) throw error;
    updateTag("blog-posts");
    revalidateContent(["/admin/blog", "/blog", `/blog/${data.slug}`]);
    return { success: true };
  } catch (error) { return actionError(error, "Blog yazısı kaydedilemedi."); }
}

export async function updateBlogPost(slug: string, input: BlogMutationInput) {
  try {
    const data = { ...input, slug: slugifyYacht(input.slug || input.title) };
    let { error } = await supabaseAdmin.from("blog_posts").update(data).eq("slug", slug);
    if (error?.code === "PGRST204") {
      const { published_at: _published, ...legacyData } = data;
      ({ error } = await supabaseAdmin.from("blog_posts").update(legacyData).eq("slug", slug));
    }
    if (error) throw error;
    updateTag("blog-posts");
    revalidateContent(["/admin/blog", "/blog", `/blog/${slug}`, `/blog/${data.slug}`]);
    return { success: true };
  } catch (error) { return actionError(error, "Blog yazısı güncellenemedi."); }
}

export async function deleteBlogPost(slug: string) {
  try {
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("slug", slug);
    if (error) throw error;
    updateTag("blog-posts");
    revalidateContent(["/admin/blog", "/blog", `/blog/${slug}`]);
    return { success: true };
  } catch (error) { return actionError(error, "Blog yazısı silinemedi."); }
}

export async function createService(input: ServiceMutationInput) {
  try {
    const { error } = await supabaseAdmin.from("services").insert([input]);
    if (error) throw error;
    updateTag("services");
    revalidateContent(["/admin/services", "/rezervasyon"]);
    return { success: true };
  } catch (error) { return actionError(error, "Hizmet kaydedilemedi."); }
}

export async function updateService(id: string, input: ServiceMutationInput) {
  try {
    const { error } = await supabaseAdmin.from("services").update(input).eq("id", id);
    if (error) throw error;
    updateTag("services");
    revalidateContent(["/admin/services", "/rezervasyon"]);
    return { success: true };
  } catch (error) { return actionError(error, "Hizmet güncellenemedi."); }
}

export async function deleteService(id: string) {
  try {
    const { error } = await supabaseAdmin.from("services").delete().eq("id", id);
    if (error) throw error;
    updateTag("services");
    revalidateContent(["/admin/services", "/rezervasyon"]);
    return { success: true };
  } catch (error) { return actionError(error, "Hizmet silinemedi."); }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    const { error } = await supabaseAdmin.from("bookings").update({ status }).eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error) { return actionError(error, "Rezervasyon güncellenemedi."); }
}

export async function deleteBooking(id: string) {
  try {
    const { error } = await supabaseAdmin.from("bookings").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error) { return actionError(error, "Rezervasyon silinemedi."); }
}

export async function saveSettings(input: Record<string, unknown>, id?: string) {
  try {
    const query = id
      ? supabaseAdmin.from("settings").update(input).eq("id", id)
      : supabaseAdmin.from("settings").insert([input]);
    let { error } = await query;
    if (error?.code === "PGRST204") {
      const legacyInput = {
        site_title: input.site_title,
        site_description: input.site_description,
        whatsapp_number: input.whatsapp_number,
        prepayment_percentage: input.prepayment_percentage,
      };
      const legacyQuery = id
        ? supabaseAdmin.from("settings").update(legacyInput).eq("id", id)
        : supabaseAdmin.from("settings").insert([legacyInput]);
      ({ error } = await legacyQuery);
    }
    if (error) throw error;
    updateTag("settings");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) { return actionError(error, "Ayarlar kaydedilemedi."); }
}
