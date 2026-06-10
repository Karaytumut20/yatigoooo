"use server";

import { createClient } from "@supabase/supabase-js";

// Bypass RLS in Server Actions using the Service Role Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function getUserBookings(userId: string, email: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .or(`user_id.eq.${userId},email.eq.${email}`)
      .order("booking_date", { ascending: true });
      
    if (error) {
      console.error("Error fetching user bookings via Server Action:", error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("Exception in getUserBookings:", err);
    return [];
  }
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching profile via Server Action:", error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error("Exception in getUserProfile:", err);
    return null;
  }
}

export async function updateUserProfile(userId: string, fullName: string, phone: string) {
  try {
    const { error } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: userId,
        full_name: fullName,
        phone: phone,
        updated_at: new Date().toISOString()
      });
      
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("Exception in updateUserProfile:", err);
    return { success: false, error: err };
  }
}
