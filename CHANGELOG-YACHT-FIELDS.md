# Yat Alanları Değişiklik Günlüğü

**Tarih:** 8 Haziran 2026  
**Versiyon:** 2.0.0  
**Durum:** ✅ Tamamlandı

## 📋 Özet

Yat detay sayfalarından ve admin panelinden gereksiz teknik özellik alanları kaldırıldı. Sadece gerekli alanlar (Kapasite, Uzunluk, Fiyat) bırakıldı.

## 🗑️ Kaldırılan Alanlar

1. **Kabin Sayısı** (`cabins`)
2. **Banyo Sayısı** (`bathrooms`)
3. **Mürettebat** (`crew`)
4. **Seyir Hızı** (`speed`)
5. **Yemekli Kapasite** (`dining_capacity`)

## ✅ Kalan Alanlar

1. **Maksimum Kapasite** (`capacity`) - Yolcu sayısı
2. **Yat Uzunluğu** (`length`) - Metre cinsinden
3. **Saatlik Fiyat** (`hourly_price`) - TL cinsinden

## 📁 Değiştirilen Dosyalar

### Frontend Dosyaları

1. **`app/yatlarimiz/[slug]/page.tsx`**
   - Detay sayfasından 5 alan kaldırıldı
   - Sadece kapasite ve uzunluk gösteriliyor
   - Specs grid 2 kolona düşürüldü

2. **`app/deneyimler/[slug]/page.tsx`**
   - Önerilen yatlar kartlarından speed kaldırıldı
   - Sadece kapasite ve uzunluk gösteriliyor

3. **`app/admin/yachts/YachtFormModal.tsx`**
   - Form'dan 5 alan kaldırıldı
   - Visible specs checkboxları güncellendi (3 checkbox kaldı)
   - Form payload'u basitleştirildi

### Type Definitions

4. **`types/yacht.ts`**
   - Yacht interface güncellendi
   - visibleSpecs sadece 3 alan içeriyor
   - Eski alanlar deprecated olarak işaretlendi (backward compatibility için)

5. **`lib/admin-actions.ts`**
   - YachtMutationInput interface güncellendi
   - 5 alan kaldırıldı
   - SEO visible_specs yapısı güncellendi

6. **`lib/api.ts`**
   - mapYacht fonksiyonu güncellendi
   - visibleSpecs mapping sadece 3 alan için yapılıyor

## 🗄️ Database Migration

### Migration Dosyası
**Dosya:** `remove-yacht-fields-migration.sql`

### Çalıştırma Adımları

1. **Yedek Alın:**
   ```sql
   -- Supabase Dashboard > SQL Editor > New Query
   -- Önce mevcut yachts tablosunu yedekleyin
   ```

2. **Migration'ı Çalıştırın:**
   - Supabase Dashboard'a gidin
   - SQL Editor açın
   - `remove-yacht-fields-migration.sql` içeriğini kopyalayıp çalıştırın

3. **Değişiklikleri Doğrulayın:**
   ```sql
   SELECT * FROM yachts LIMIT 5;
   ```

### Migration İçeriği

```sql
-- Kolonları sil
ALTER TABLE yachts 
  DROP COLUMN IF EXISTS dining_capacity,
  DROP COLUMN IF EXISTS speed,
  DROP COLUMN IF EXISTS cabins,
  DROP COLUMN IF EXISTS bathrooms,
  DROP COLUMN IF EXISTS crew;

-- JSONB visible_specs güncelle
UPDATE yachts 
SET seo = jsonb_set(
  COALESCE(seo, '{}'::jsonb),
  '{display_options,visible_specs}',
  jsonb_build_object(
    'length', COALESCE(seo->'display_options'->'visible_specs'->>'length', 'true')::boolean,
    'capacity', COALESCE(seo->'display_options'->'visible_specs'->>'capacity', 'true')::boolean,
    'hourly_price', COALESCE(seo->'display_options'->'visible_specs'->>'hourly_price', 'true')::boolean
  )
);
```

### Rollback

Eğer geri almak isterseniz, migration dosyasının sonundaki ROLLBACK scriptini çalıştırın.

## 🧪 Test Checklist

- [x] Build başarılı
- [x] TypeScript hataları yok
- [ ] Yat detay sayfası doğru görünüyor
- [ ] Admin panelinde yat ekleme/düzenleme çalışıyor
- [ ] Deneyim sayfalarında önerilen yatlar görünüyor
- [ ] Supabase migration çalıştırıldı
- [ ] Mevcut yatlar doğru görüntüleniyor

## 🚀 Deployment

1. Frontend değişikliklerini deploy edin
2. Supabase migration'ı çalıştırın
3. Test edin
4. Production'a geçin

## 📝 Notlar

- Eski `cabins`, `bathrooms`, `crew`, `speed`, `dining_capacity` verileri database'den silinecek
- Backward compatibility için type definitions'da deprecated olarak bırakıldı
- Yeni yat eklerken artık bu alanlar istenmeyecek
- Mevcut yat kartları otomatik olarak yeni format ile görünecek

## ⚠️ Önemli

Bu değişikliklerden sonra:
- **Yedek alınması önerilir**
- **Migration geri alınabilir** (rollback script mevcut)
- **Admin panelinde yeni yat eklerken** artık sadece 3 teknik özellik girilecek

## 🎉 Faydaları

1. **Daha temiz UI** - Gereksiz bilgi kalabalığı yok
2. **Hızlı veri girişi** - Admin panelinde daha az alan
3. **Basit maintenance** - Daha az alan = daha az hata
4. **Mobil uyumlu** - Daha az alan daha iyi responsive tasarım
