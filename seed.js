const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const YACHTS = [
  {
    slug: "su-royal",
    name: "SU Royal",
    short_description: "İstanbul Boğazı'nın En Prestijli Ultra Lüks Mega Yat Davet Teknesi",
    description: "SU Royal, modern minimalist İtalyan tasarımı, 35 kişiye varan kokteyl kapasitesi, konforlu flybridge güneşlenme alanı ve profesyonel ses/ışık sistemleriyle özel davetleriniz için kusursuzdur.",
    images: [
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1605281317010-fe5fed93a4c8?auto=format&fit=crop&q=80&w=600"
    ],
    capacity: 35,
    dining_capacity: 24,
    length: "36 Metre",
    cabins: 5,
    bathrooms: 4,
    crew: 4,
    speed: "22kts",
    hourly_price: 450,
    min_hours: 2,
    full_day_price: 3200,
    features: ["Flybridge", "Panoramik Salon", "Profesyonel Ses Sistemi", "Havuz/Jakuzi"],
    amenities: [
      "Panoramik Salon",
      "Flybridge & Güneşlenme Alanı",
      "Yüksek Çözünürlüklü Ses Sistemi",
      "Wi-Fi & Bluetooth",
      "Klima",
      "Güneşlenme Alanı",
      "Arka Güverte Oturma Alanı",
      "Yemek Masası"
    ]
  },
  {
    slug: "su-orion",
    name: "SU Orion",
    short_description: "Geniş Sosyal Alanlara Sahip Sarsıntısız Lüks Katamaran",
    description: "SU Orion, çift gövde yapısı sayesinde Bosphorus'ta sarsıntısız ve son derece konforlu bir seyir sunar. Yemekli davetler, aile gezileri ve gün batımı turları için en popüler yatımızdır.",
    images: [
      "https://images.unsplash.com/photo-1505242859870-65c797444b0f?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=600"
    ],
    capacity: 20,
    dining_capacity: 14,
    length: "24 Metre",
    cabins: 4,
    bathrooms: 3,
    crew: 3,
    speed: "18kts",
    hourly_price: 300,
    min_hours: 2,
    full_day_price: 2200,
    features: ["Stabil Çift Gövde", "Geniş Güverte", "Açık Yemek Masası"],
    amenities: [
      "Panoramik Salon",
      "Flybridge & Güneşlenme Alanı",
      "Wi-Fi & Bluetooth",
      "Klima",
      "Arka Güverte Oturma Alanı",
      "Yemek Masası"
    ]
  }
];

const EXPERIENCES = [
  {
    slug: "bogaz-turu",
    title: "İstanbul Boğazı Özel Yat Turu",
    category: "romantic",
    short_description: "Asya ile Avrupa'nın kesişiminde tarihi yalıların ve sarayların gölgesinde lüks seyir.",
    description: "İstanbul'u denizden keşfetmenin en özel yolu.",
    starting_price: 400,
    duration: "2 Saat",
    image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&q=80&w=800",
    suitable_for: ["Aileler", "Turistler"],
    includes: ["Kaptan", "Hoş Geldin Kokteyli"],
    sample_flow: ["Karşılama", "Seyir", "Dönüş"]
  }
];

const SETTINGS = {
  site_title: "yatigotr Turizm A.Ş.",
  site_description: "İstanbul Boğazı'nda lüks yat kiralama, teknede evlilik teklifi ve özel davet hizmetleri.",
  whatsapp_number: "905556667788",
  prepayment_percentage: 50
};

async function seed() {
  console.log("Seeding data to Supabase...");
  
  try {
    // Check if tables exist by querying them. If they don't, it will throw an error.
    const { error: checkErr } = await supabase.from('yachts').select('id').limit(1);
    if (checkErr) {
      console.log("Supabase tables not created yet! Skipping seed. Please run the SQL in Supabase Dashboard first.");
      return;
    }

    // Upsert Settings
    await supabase.from("settings").upsert([SETTINGS]);
    
    // Upsert Yachts (we use slug as identifier logic but upsert needs PK, so we just insert and ignore conflicts if possible, or delete all and insert)
    await supabase.from("yachts").delete().neq('id', '00000000-0000-0000-0000-000000000000'); // clear table for clean seed
    await supabase.from("yachts").insert(YACHTS);

    await supabase.from("experiences").delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from("experiences").insert(EXPERIENCES);

    console.log("Seeding completed successfully!");
  } catch (err) {
    console.error("Error during seed:", err.message);
  }
}

seed();
