import { Yacht } from "../types/yacht";
import { Experience } from "../types/experience";
import { BlogPost } from "../types/blog";

export const YACHTS: Yacht[] = [
  {
    slug: "su-royal",
    name: "SU Royal",
    shortDescription: "İstanbul Boğazı'nın En Prestijli Ultra Lüks Mega Yat Davet Teknesi",
    description: "SU Royal, modern minimalist İtalyan tasarımı, 35 kişiye varan kokteyl kapasitesi, konforlu flybridge güneşlenme alanı ve profesyonel ses/ışık sistemleriyle özel davetleriniz için kusursuzdur.",
    images: [
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1605281317010-fe5fed93a4c8?auto=format&fit=crop&q=80&w=600"
    ],
    capacity: 35,
    diningCapacity: 24,
    length: "36 Metre",
    cabins: 5,
    bathrooms: 4,
    crew: 4,
    speed: "22kts",
    hourlyPrice: 450,
    minHours: 2,
    fullDayPrice: 3200,
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
    ],
    packages: [
      { title: "Saatlik Kiralama", price: 450, duration: "1 Saat", description: "Minimum 2 saat kiralama şartı mevcuttur." },
      { title: "Tam Gün Boğaz Turu", price: 2800, duration: "6 Saat", description: "Tüm Boğaz boyunca seyir imkanı." },
      { title: "Tam Gün Adalar Turu", price: 3200, duration: "8 Saat", description: "Adalar'da yüzme molaları dahil lüks paket." }
    ],
    seo: {
      title: "SU Royal Lüks Mega Yat Kiralama | İstanbul Boğazı Davet Teknesi",
      description: "SU Royal mega yat ile İstanbul Boğazı'nda lüks özel yat kiralama deneyimi. 35 kişilik kapasite, 5 kabin ve flybridge ile elit organizasyonlar."
    }
  },
  {
    slug: "su-orion",
    name: "SU Orion",
    shortDescription: "Geniş Sosyal Alanlara Sahip Sarsıntısız Lüks Katamaran",
    description: "SU Orion, çift gövde yapısı sayesinde Bosphorus'ta sarsıntısız ve son derece konforlu bir seyir sunar. Yemekli davetler, aile gezileri ve gün batımı turları için en popüler yatımızdır.",
    images: [
      "https://images.unsplash.com/photo-1505242859870-65c797444b0f?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=600"
    ],
    capacity: 20,
    diningCapacity: 14,
    length: "24 Metre",
    cabins: 4,
    bathrooms: 3,
    crew: 3,
    speed: "18kts",
    hourlyPrice: 300,
    minHours: 2,
    fullDayPrice: 2200,
    features: ["Stabil Çift Gövde", "Geniş Güverte", "Açık Yemek Masası"],
    amenities: [
      "Panoramik Salon",
      "Flybridge & Güneşlenme Alanı",
      "Wi-Fi & Bluetooth",
      "Klima",
      "Arka Güverte Oturma Alanı",
      "Yemek Masası"
    ],
    packages: [
      { title: "Saatlik Kiralama", price: 300, duration: "1 Saat", description: "Minimum 2 saat kiralama şartı." },
      { title: "Tam Gün Boğaz Turu", price: 1800, duration: "6 Saat", description: "Sakin ve dengeli Boğaz seyahati." },
      { title: "Tam Gün Adalar Turu", price: 2200, duration: "8 Saat", description: "Burgazada ve Heybeliada yüzme molalı tur." }
    ],
    seo: {
      title: "SU Orion Lüks Katamaran Kiralama | İstanbul Boğazı",
      description: "SU Orion katamaran yatı ile konforlu ve geniş yaşam alanlarında Boğaz turu yapın. 20 kişi kapasiteli, stabil çift gövde avantajı."
    }
  },
  {
    slug: "su-prestige",
    name: "SU Prestige",
    shortDescription: "Sportif Tasarım ve Yüksek Performanslı Motor Yat",
    description: "SU Prestige, sürat ve şıklığı bir arada arayan elit misafirlerimiz için tasarlanmıştır. Modern çizgileri, panoramik salonu ve lüks flybridge alanı ile Boğaz'ın gözdesi.",
    images: [
      "https://images.unsplash.com/photo-1621275471769-e6aa344546d5?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=600"
    ],
    capacity: 12,
    diningCapacity: 8,
    length: "28 Metre",
    cabins: 3,
    bathrooms: 2,
    crew: 2,
    speed: "25kts",
    hourlyPrice: 380,
    minHours: 2,
    fullDayPrice: 2800,
    features: ["Sportif Flybridge", "Lüks İç Salon", "Hızlı Seyir"],
    amenities: [
      "Panoramik Salon",
      "Flybridge & Güneşlenme Alanı",
      "Bluetooth Müzik Sistemi",
      "Wi-Fi",
      "Klima",
      "Arka Güverte Oturma Alanı"
    ],
    packages: [
      { title: "Saatlik Kiralama", price: 380, duration: "1 Saat", description: "Hızlı transferler ve özel geziler." },
      { title: "Tam Gün Adalar Turu", price: 2800, duration: "8 Saat", description: "Adaların eşsiz koylarına hızlı erişim." }
    ],
    seo: {
      title: "SU Prestige Motor Yat Kiralama | İstanbul VIP Boğaz Turu",
      description: "SU Prestige VIP motor yat kiralama seçeneği. 12 kişilik kapasitesi, 25 knot hızı ve üst düzey konforu ile İstanbul Boğazı'nda özel yat keyfi."
    }
  },
  {
    slug: "su-classic",
    name: "SU Classic",
    shortDescription: "Nostaljik Tasarımlı Samimi Klasik Ahşap Yat",
    description: "Sakin ve samimi turlar, baş başa evlilik teklifleri ve küçük aile kahvaltıları için biçilmiş kaftan olan SU Classic, vintage lüks havasıyla benzersizdir.",
    images: [
      "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=1200"
    ],
    capacity: 10,
    diningCapacity: 6,
    length: "18 Metre",
    cabins: 2,
    bathrooms: 2,
    crew: 2,
    speed: "16kts",
    hourlyPrice: 200,
    minHours: 2,
    fullDayPrice: 1500,
    features: ["Vintage Ahşap Tasarım", "Samimi Atmosfer", "Ekonomik Lüks"],
    amenities: [
      "İç Salon",
      "Müzik Sistemi",
      "Wi-Fi",
      "Güneşlenme Alanı",
      "Yemek Masası"
    ],
    packages: [
      { title: "Saatlik Kiralama", price: 200, duration: "1 Saat", description: "Evlilik teklifi ve kısa turlar için ideal." },
      { title: "Tam Gün Boğaz Turu", price: 1200, duration: "6 Saat", description: "Ahşap yat konforuyla nostaljik yolculuk." }
    ],
    seo: {
      title: "SU Classic Klasik Ahşap Yat Kiralama | İstanbul Evlilik Teklifi",
      description: "SU Classic ahşap yat kiralama. Evlilik teklifi, yıldönümü ve aile kahvaltıları için 10 kişilik ideal, samimi Bosphorus yatı."
    }
  }
];

export const EXPERIENCES: Experience[] = [
  {
    slug: "bogaz-turu",
    title: "İstanbul Boğazı Özel Yat Turu",
    category: "romantic",
    shortDescription: "Asya ile Avrupa'nın kesişiminde tarihi yalıların ve sarayların gölgesinde lüks seyir.",
    description: "İstanbul'u denizden keşfetmenin en özel yolu. Dolmabahçe Sarayı, Çırağan Sarayı, Rumeli Hisarı ve tarihi yalıların önünden geçerken, sadece size ve misafirlerinize özel lüks hizmetin keyfini sürün.",
    startingPrice: 400,
    duration: "2 Saat",
    image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&q=80&w=800",
    suitableFor: ["Aileler", "Turistler", "İş Ortakları", "Özel Davetliler"],
    includes: ["Kaptan ve Mürettebat", "Yakıt ve Liman Masrafları", "Hoş Geldin Kokteyli", "Çay, Kahve & Su İkramı", "Kablosuz İnternet & Müzik Bağlantısı"],
    sampleFlow: [
      "Kuruçeşme veya Bebek Limanı'ndan karşılama ve yata biniş",
      "Avrupa yakası kıyı şeridinden yalılar eşliğinde Rumeli Hisarı'na kadar kuzey seyri",
      "Fatih Sultan Mehmet Köprüsü altında duraklama ve fotoğraf çekimi",
      "Asya yakası kıyı şeridine geçerek Beylerbeyi Sarayı ve Üsküdar hattından dönüş",
      "Başlangıç noktasına varış ve vedalaşma"
    ],
    recommendedYachts: ["su-orion", "su-prestige", "su-classic"],
    faq: [
      { question: "Tur rotası değiştirilebilir mi?", answer: "Evet, kiralama süreniz dahilinde kalmak kaydıyla başlangıç ve bitiş noktalarını ve özel duraklama isteklerinizi kaptanımızla koordine edebilirsiniz." },
      { question: "Hava yağmurlu olursa ne olur?", answer: "Yatlarımızın kapalı salonları ısıtmalıdır. Şiddetli fırtına veya sis olmadığı sürece turlarımız kesintisiz gerçekleştirilir." }
    ],
    seo: {
      title: "İstanbul Boğazı Özel Yat Turu | VIP yatigotr",
      description: "İstanbul Boğazı'nda size özel kiralık yatlarla VIP yat turu. Kaptanlı, mürettebatlı, ikramlı lüks Boğaz gezisi rezervasyonu yapın."
    }
  },
  {
    slug: "yemekli-yat-turu",
    title: "Yemekli Yat Turu",
    category: "dining",
    shortDescription: "Boğaz'ın ışıltılı silüeti eşliğinde özel şeflerimizden gurme akşam yemeği.",
    description: "İstanbul Boğazı'nın büyüleyici gece manzarasında, yatımızın özel mutfağında hazırlanan zengin menüler eşliğinde unutulmaz bir akşam yemeği deneyimi.",
    startingPrice: 650,
    duration: "3 Saat",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
    suitableFor: ["Çiftler", "Aileler", "Şirket Yemekleri", "Özel Kutlamalar"],
    includes: ["3 Saat Özel Yat Kiralama", "Gurme Set Menü (Et/Balık/Vejetaryen)", "Limitsiz Soft İçecekler", "Garsonluk Hizmeti", "Özel Masa Süslemesi"],
    sampleFlow: [
      "Akşam saat 20:00 limandan hareket ve karşılama kokteyli",
      "Soğuk mezeler ve ara sıcak servisi eşliğinde yavaş Boğaz seyri",
      "Asya yakasının tarihi yalıları önünde ana yemek servisi",
      "Köprü altında canlı müzik eşliğinde tatlı, meyve ve Türk kahvesi keyfi",
      "Liman dönüşü"
    ],
    recommendedYachts: ["su-royal", "su-orion"],
    faq: [
      { question: "Alkol getirmek serbest mi?", answer: "Evet, dilerseniz alkollü içeceklerinizi kendiniz getirebilirsiniz. Garsonlarımız servis edecektir." },
      { question: "Menülerde değişiklik yapabiliyor muyuz?", answer: "Rezervasyondan en az 2 gün önce haber vererek vejetaryen, vegan veya alerjen hassasiyetli menü düzenlemeleri talep edebilirsiniz." }
    ],
    seo: {
      title: "Yemekli Yat Turu İstanbul | Yatta Lüks Akşam Yemeği",
      description: "İstanbul Boğazı'nda özel kiralık yatta yemekli tur organizasyonu. Gurme set menüler ve kusursuz servis eşliğinde lüks akşam yemeği."
    }
  },
  {
    slug: "gun-batimi-turu",
    title: "Gün Batımı Yat Turu",
    category: "romantic",
    shortDescription: "Gökyüzünün altın saatlerinde şampanya eşliğinde romantik Bosphorus seyri.",
    description: "İstanbul'un en fotojenik anı olan gün batımını, kalabalıklardan uzak, lüks bir yatın ön güvertesinde şampanyanızı yudumlarken izleyin.",
    startingPrice: 450,
    duration: "2 Saat",
    image: "https://images.unsplash.com/photo-1618083707368-b3823daa2726?auto=format&fit=crop&q=80&w=800",
    suitableFor: ["Çiftler", "Fotoğraf Tutkunları", "Küçük Arkadaş Grupları"],
    includes: ["2 Saat Yat Kiralama", "1 Şişe Premium Köpüklü Şarap", "Gurme Peynir & Meyve Tabağı", "Özel Müzik Listesi Bağlantısı"],
    sampleFlow: [
      "Gün batımından 1 saat önce yatımıza biniş",
      "Kız Kulesi yönüne doğru hafif dalgalar eşliğinde seyir",
      "Gün batımı anında şampanya patlatma ve fotoğraf çekimleri",
      "Köprü ışıklarının yanışı eşliğinde yavaş dönüş seyri"
    ],
    recommendedYachts: ["su-prestige", "su-classic"],
    faq: [
      { question: "Tur saatleri nasıl ayarlanıyor?", answer: "Turlarımız her ayın gün batımı saatine göre özel olarak planlanır. Rezervasyon ekibimiz güncel saat bilgisini iletecektir." }
    ],
    seo: {
      title: "Gün Batımı Yat Turu İstanbul | Yatta Şampanya Keyfi",
      description: "İstanbul Boğazı'nda lüks yatta gün batımı turu. Altın saatlerde şampanya, peynir tabağı ve unutulmaz anlar için rezervasyon yapın."
    }
  },
  {
    slug: "yatta-evlilik-teklifi",
    title: "Yatta Lüks Evlilik Teklifi",
    category: "celebration",
    shortDescription: "Köprüye lazerle yazılan isimler ve keman melodileriyle 'Evet!' dedirten anlar.",
    description: "İstanbul Boğazı'nın tam ortasında, Boğaziçi Köprüsü'nün altına lazerle isimleriniz yazılırken, keman melodileri ve volkan gösterileri eşliğinde hayatınızın en önemli sorusunu sorun.",
    startingPrice: 800,
    duration: "2 Saat",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
    suitableFor: ["Çiftler"],
    includes: [
      "2 Saat Özel Yat Kiralama",
      "Köprü Altında Yüksek Güçlü Lazer Gösterisi",
      "Profesyonel Kemancı Performansı",
      "Kırmızı Halı Karşılama ve Lüks Masa Süsleme",
      "Şampanya veya Alkolsüz Kokteyl İkramı",
      "Volkan (Soğuk Ateş) Gösterisi"
    ],
    sampleFlow: [
      "Yata kırmızı halı ve gül yaprakları arasından giriş",
      "Arka güvertedeki özel süslenmiş masada kokteyl ikramı",
      "Keman eşliğinde yavaş seyir",
      "Köprü altına gelindiğinde lazerle yazı gösterisinin başlaması ve teklif anı",
      "Teklif anında volkanların patlatılması ve şampanya ikramı",
      "Kutlama eşliğinde limana dönüş seyri"
    ],
    recommendedYachts: ["su-classic", "su-prestige"],
    faq: [
      { question: "Lazerle istediğimiz metni yazabiliyor muyuz?", answer: "Evet, evlilik teklifi cümlenizi veya isimlerinizi rezervasyon anında bize iletmeniz yeterlidir." },
      { question: "Fotoğraf ve video çekimi dahil mi?", answer: "Dilerseniz ek hizmet olarak profesyonel dron ve fotoğrafçı desteği sağlayabiliriz." }
    ],
    seo: {
      title: "Yatta Evlilik Teklifi İstanbul | Lazerli & Kemanlı VIP Paket",
      description: "İstanbul Boğaz köprüsünün altında lazer şovlu yatta evlilik teklifi. Keman dinletisi, süslemeler ve volkanlar dahil en lüks teklif paketleri."
    }
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "bogazda-en-iyi-gun-batimi-rotalari",
    title: "İstanbul Boğazı'nda En İyi Gün Batımı Rotaları",
    excerpt: "İstanbul'da gün batımını lüks bir yatın güvertesinden izlemek için en harika seyir noktaları ve gezi rehberi.",
    content: `
      <p>İstanbul, yedi tepesinden de ayrı bir gün batımı manzarası sunan büyüleyici bir şehirdir. Ancak bu eşsiz doğa olayını izlemenin en ayrıcalıklı yolu, şüphesiz Boğaz'ın serin sularında lüks bir yatın güvertesidir.</p>
      
      <h2>1. Tarihi Yarımada ve Kız Kulesi Önü</h2>
      <p>Günün son ışıkları Topkapı Sarayı, Ayasofya ve Sultanahmet Camii silüetinin arkasından kaybolurken, Kız Kulesi'nin hemen açıklarında demirleyen bir yatta olmak paha biçilemezdir. Gökyüzünün kızıla büründüğü bu anlarda fotoğraflarınız adeta bir tabloya dönüşecektir.</p>
      
      <h2>2. Fatih Sultan Mehmet Köprüsü Altı</h2>
      <p>Köprünün devasa ayaklarının hemen altında, Asya ve Avrupa kıtalarını aynı anda izleyerek gün batımını deneyimleyebilirsiniz. Özellikle bu noktada rüzgarın sakinleştiği altın saatlerde şampanya patlatmak harika bir yat turu klasiğidir.</p>
    `,
    image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&q=80&w=800",
    category: "Gezi Rehberi",
    readTime: "5 Dk Okuma",
    date: "27 Mayıs 2026",
    seo: {
      title: "İstanbul Boğazı Gün Batımı Rotaları | Yat Kiralama Blog",
      description: "Lüks yat turlarında gün batımını en iyi izleyebileceğiniz Kız Kulesi, Ortaköy ve Bebek kıyılarındaki özel seyir rotaları rehberi."
    }
  }
];
