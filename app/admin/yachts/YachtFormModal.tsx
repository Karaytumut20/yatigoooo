"use client";

import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { createYacht, updateYacht } from "../../../lib/admin-actions";
import { isValidYachtImageUrl } from "../../../lib/yacht-images";
import { slugifyYacht } from "../../../lib/yacht-slug";
import { Yacht } from "../../../types/yacht";
import { Experience } from "../../../types/experience";

interface YachtFormModalProps {
  yachts: Yacht[];
  experiences: Experience[];
  onClose: () => void;
  onSuccess: (slug: string) => void;
  initialYacht?: Yacht | null;
}

export function YachtFormModal({ yachts, experiences, onClose, onSuccess, initialYacht }: YachtFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Dynamically extract all existing features in the system as unique values
  const allSystemFeatures = Array.from(
    new Set(yachts.flatMap((y) => y.features || []).filter((f) => f && f.trim() !== ""))
  ) as string[];

  // Dynamically extract all existing yacht types in the system
  const allSystemTypes = Array.from(
    new Set(yachts.map((y) => y.yachtType).filter(Boolean))
  ) as string[];

  const isInitialCustomType = initialYacht?.yachtType && !["motor-yacht", "catamaran", "mega-yacht"].includes(initialYacht.yachtType);
  const [showCustomTypeInput, setShowCustomTypeInput] = useState(isInitialCustomType || false);
  const [customYachtType, setCustomYachtType] = useState<string>(isInitialCustomType ? (initialYacht.yachtType || "") : "");

  const [typesList, setTypesList] = useState<string[]>(() => {
    const base = ["motor-yacht", "catamaran", "mega-yacht"];
    const merged = Array.from(new Set([...base, ...allSystemTypes]));
    return merged;
  });

  const handleAddNewType = () => {
    if (!customYachtType.trim()) return;
    const slugified = slugifyYacht(customYachtType.trim());
    if (!typesList.includes(slugified)) {
      setTypesList([...typesList, slugified]);
    }
    setFormData((prev) => ({ ...prev, yacht_type: slugified }));
    setShowCustomTypeInput(false);
    setCustomYachtType("");
  };

  const handleCustomTypeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNewType();
    }
  };

  const [availableFeatures, setAvailableFeatures] = useState<string[]>(allSystemFeatures.length > 0 ? allSystemFeatures : ["Havuz/Jakuzi", "Flybridge"]);
  const [newFeatureText, setNewFeatureText] = useState("");

  const [formData, setFormData] = useState({
    name: initialYacht?.name || "",
    slug: initialYacht?.slug || "",
    short_description: initialYacht?.shortDescription || "",
    description: initialYacht?.description || "",
    length: initialYacht?.length ? (parseInt(initialYacht.length, 10) || 20) : 20,
    capacity: initialYacht?.capacity || 10,
    hourly_price: initialYacht?.hourlyPrice || 500,
    yacht_type: initialYacht?.yachtType || "motor-yacht",
    cabin_count: initialYacht?.cabinCount || initialYacht?.cabins || 2,
    has_pool: initialYacht?.hasPool || false,
    has_flybridge: initialYacht?.hasFlybridge || false,
    visible_specs: {
      length: initialYacht?.visibleSpecs?.length ?? true,
      capacity: initialYacht?.visibleSpecs?.capacity ?? true,
      hourly_price: initialYacht?.visibleSpecs?.hourlyPrice ?? true,
    },
    images: initialYacht?.images && initialYacht.images.length > 0 ? initialYacht.images : [""],
    amenities: initialYacht?.amenities && initialYacht.amenities.length > 0 ? initialYacht.amenities : [""],
    show_amenities: initialYacht?.showAmenities ?? true,
    features: initialYacht?.features || [], // Now maps directly to checkboxes
    show_features: initialYacht?.showFeatures ?? true,
    packages: (initialYacht?.packages || []).map((pkg) => ({
      ...pkg,
      duration: pkg.duration ? String(parseInt(pkg.duration, 10) || "") : "",
      price: pkg.price ? Number(String(pkg.price).replace(/[^0-9]/g, "")) || 0 : 0
    })),
    show_packages: initialYacht?.showPackages ?? true,
    extra_guest_pricing: initialYacht?.extraGuestPricing || [],
    pickup_points: initialYacht?.pickupPoints || [],
    dropoff_points: initialYacht?.dropoffPoints || [],
    experience_slugs: initialYacht?.experienceSlugs && initialYacht.experienceSlugs.length > 0 
      ? initialYacht.experienceSlugs 
      : ["saatlik-yat-turu"],
  });
  const slugPreview = slugifyYacht(formData.slug || formData.name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.target.name === "yacht_type") {
      if (e.target.value === "new-type") {
        setShowCustomTypeInput(true);
      } else {
        setShowCustomTypeInput(false);
      }
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field: 'images' | 'amenities' | 'features', index: number, value: string) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addArrayItem = (field: 'images' | 'amenities' | 'features') => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayItem = (field: 'images' | 'amenities' | 'features', index: number) => {
    const newArr = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArr });
  };

  const toggleSpecVisibility = (field: keyof typeof formData.visible_specs) => {
    setFormData({
      ...formData,
      visible_specs: {
        ...formData.visible_specs,
        [field]: !formData.visible_specs[field],
      },
    });
  };

  const addPackage = () => {
    setFormData({ 
      ...formData, 
      packages: [...formData.packages, { title: "", duration: "", price: 0, description: "" }] 
    });
  };

  const updatePackage = (index: number, field: string, value: string) => {
    const newPackages = [...formData.packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setFormData({ ...formData, packages: newPackages });
  };

  const removePackage = (index: number) => {
    const newPackages = formData.packages.filter((_, i) => i !== index);
    setFormData({ ...formData, packages: newPackages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const images = formData.images.filter(i => i.trim() !== "");
    if (!images.length || images.some((image) => !isValidYachtImageUrl(image))) {
      setErrorMessage("En az bir geçerli http:// veya https:// görsel URL'si girmelisiniz.");
      return;
    }

    setLoading(true);

    const finalYachtType = formData.yacht_type === "new-type" ? slugifyYacht(customYachtType) : formData.yacht_type;
    const finalFeatures = formData.features.filter((f: string) => f && f.trim() !== "");

    const payload = {
      name: formData.name,
      slug: slugifyYacht(formData.slug || formData.name),
      short_description: formData.short_description,
      description: formData.description,
      length: formData.length + " Metre",
      capacity: Number(formData.capacity),
      hourly_price: Number(formData.hourly_price),
      images,
      amenities: formData.amenities.filter((a: string) => a.trim() !== ""),
      features: finalFeatures,
      packages: formData.packages
        .filter((pkg) => pkg.title.trim() || pkg.duration || pkg.description.trim() || Number(pkg.price) > 0)
        .map((pkg) => ({
          ...pkg,
          duration: pkg.duration ? pkg.duration + " Saat" : "",
          price: Number(pkg.price) || 0
        })),
      yacht_type: finalYachtType,
      cabin_count: Number(formData.cabin_count),
      has_pool: finalFeatures.some((f) => f.toLowerCase().includes("havuz") || f.toLowerCase().includes("jakuzi")),
      has_flybridge: finalFeatures.some((f) => f.toLowerCase().includes("flybridge")),
      extra_guest_pricing: formData.extra_guest_pricing,
      pickup_points: formData.pickup_points.filter((point) => point.name.trim()),
      dropoff_points: formData.dropoff_points.filter((point) => point.name.trim()),
      experience_slugs: formData.experience_slugs,
      seo: {
        title: initialYacht?.seo?.title,
        description: initialYacht?.seo?.description,
        display_options: {
          show_amenities: formData.show_amenities,
          show_packages: formData.show_packages,
          show_features: formData.show_features,
          visible_specs: formData.visible_specs,
        },
      },
    };

    let res;
    if (initialYacht) {
      res = await updateYacht(initialYacht.slug, payload);
    } else {
      res = await createYacht(payload);
    }

    setLoading(false);
    if (res.success) {
      onSuccess(res.slug || payload.slug);
    } else {
      setErrorMessage(res.error?.message || "Yat kaydedilirken bilinmeyen bir hata oluştu.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-bold text-lg">{initialYacht ? "Yatı Düzenle" : "Yeni Yat Ekle"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <form id="yachtForm" onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* GENEL BİLGİLER */}
            <div className="space-y-4">
              <h3 className="font-bold text-blue-600 border-b pb-2">Genel Bilgiler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Yat Adı</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Slug (URL)</label>
                  <input
                    placeholder="ornek-yat"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    onBlur={() => setFormData({ ...formData, slug: slugPreview })}
                    className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-slate-500 break-all">Detay adresi: /yatlarimiz/{slugPreview || "ornek-yat"}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Kısa Açıklama</label>
                <input required name="short_description" value={formData.short_description} onChange={handleChange} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Uzun Açıklama</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500" />
              </div>
            </div>

            {/* KATALOG FİLTRELEME ÖZELLİKLERİ */}
            <div className="space-y-4">
              <h3 className="font-bold text-blue-600 border-b pb-2">Katalog Filtreleme Özellikleri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Yat Türü</label>
                  <select
                    name="yacht_type"
                    value={formData.yacht_type}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 bg-white outline-none focus:border-blue-500"
                  >
                    {typesList.map((type) => (
                      <option key={type} value={type}>
                        {type === "motor-yacht" ? "Motor Yat" :
                         type === "catamaran" ? "Katamaran" :
                         type === "mega-yacht" ? "Mega Yat" :
                         type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
                      </option>
                    ))}
                    <option value="new-type">+ Yeni Tür Ekle...</option>
                  </select>
                </div>

                {showCustomTypeInput ? (
                  <div>
                    <label className="flex items-center justify-between text-sm font-semibold mb-1 w-full">
                      <span>Yeni Yat Türü Adı</span>
                      <button
                        type="button"
                        onClick={handleAddNewType}
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold bg-blue-50 px-2 py-1 rounded transition-colors"
                      >
                        + Ekle
                      </button>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Örn: Yelkenli Yat"
                      value={customYachtType}
                      onChange={(e) => setCustomYachtType(e.target.value)}
                      onKeyDown={handleCustomTypeKeyDown}
                      className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <div className="hidden md:block" />
                )}
              </div>
            </div>

            {/* DENEYİM ATAMALARI */}
            <div className="space-y-4">
              <h3 className="font-bold text-blue-600 border-b pb-2">Desteklenen Deneyimler (Turlar)</h3>
              <p className="text-xs text-slate-500">
                Bu yatın hangi turlar/deneyimler için kiralanabileceğini seçin.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {experiences.map((exp) => {
                  const isChecked = formData.experience_slugs.includes(exp.slug);
                  return (
                    <label key={exp.slug} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const newSlugs = e.target.checked
                            ? [...formData.experience_slugs, exp.slug]
                            : formData.experience_slugs.filter((s: string) => s !== exp.slug);
                          setFormData({ ...formData, experience_slugs: newSlugs });
                        }}
                        className="mt-0.5 h-4 w-4 accent-blue-600"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-slate-800">{exp.title}</span>
                        <span className="block text-xs text-slate-500 mt-0.5">{exp.duration}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* TEKNİK ÖZELLİKLER */}
            <div className="space-y-4">
              <h3 className="font-bold text-blue-600 border-b pb-2">Teknik Özellikler</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center justify-between gap-2 text-sm font-semibold mb-1">
                    <span>Uzunluk (Metre)</span>
                    <input aria-label="Uzunluğu detayda göster" type="checkbox" checked={formData.visible_specs.length} onChange={() => toggleSpecVisibility("length")} className="h-4 w-4 accent-blue-600" />
                  </label>
                  <input required type="number" name="length" value={formData.length} onChange={handleChange} min={1} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="flex items-center justify-between gap-2 text-sm font-semibold mb-1">
                    <span>Kapasite (Kişi)</span>
                    <input aria-label="Kapasiteyi detayda göster" type="checkbox" checked={formData.visible_specs.capacity} onChange={() => toggleSpecVisibility("capacity")} className="h-4 w-4 accent-blue-600" />
                  </label>
                  <input required type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="flex items-center justify-between gap-2 text-sm font-semibold mb-1">
                    <span>Saatlik Fiyat (TL)</span>
                    <input aria-label="Saatlik fiyatı detayda göster" type="checkbox" checked={formData.visible_specs.hourly_price} onChange={() => toggleSpecVisibility("hourly_price")} className="h-4 w-4 accent-blue-600" />
                  </label>
                  <input required type="number" name="hourly_price" value={formData.hourly_price} onChange={handleChange} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>

            {/* BİNİŞ VE İNİŞ NOKTALARI */}
            <div className="space-y-5">
              <div className="border-b pb-2">
                <h3 className="font-bold text-blue-600">Biniş ve İniş Noktaları</h3>
                <p className="mt-1 text-xs text-slate-500">Standart noktalar için ek ücreti 0 bırakın. Alternatif noktalar için toplam tutara eklenecek ücreti girin.</p>
              </div>

              {([
                { key: "pickup_points", title: "Biniş Noktaları", button: "Biniş Noktası Ekle" },
                { key: "dropoff_points", title: "İniş Noktaları", button: "İniş Noktası Ekle" },
              ] as const).map((section) => (
                <div key={section.key} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-bold text-slate-800">{section.title}</h4>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        [section.key]: [...formData[section.key], { name: "", price: 0 }],
                      })}
                      className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100"
                    >
                      <Plus size={14} /> {section.button}
                    </button>
                  </div>
                  {formData[section.key].length === 0 && (
                    <p className="text-xs text-slate-500">Henüz seçenek eklenmedi.</p>
                  )}
                  {formData[section.key].map((point, index) => (
                    <div key={index} className="grid grid-cols-[1fr_110px_40px] items-end gap-2">
                      <label className="text-xs font-semibold text-slate-600">
                        Nokta adı
                        <input
                          value={point.name}
                          onChange={(event) => {
                            const points = [...formData[section.key]];
                            points[index] = { ...points[index], name: event.target.value };
                            setFormData({ ...formData, [section.key]: points });
                          }}
                          placeholder="Örn: Bebek İskelesi"
                          className="mt-1 w-full rounded-lg border bg-white p-2 text-sm outline-none focus:border-blue-500"
                        />
                      </label>
                      <label className="text-xs font-semibold text-slate-600">
                        Ek ücret
                        <input
                          type="number"
                          min="0"
                          value={point.price}
                          onChange={(event) => {
                            const points = [...formData[section.key]];
                            points[index] = { ...points[index], price: Number(event.target.value) || 0 };
                            setFormData({ ...formData, [section.key]: points });
                          }}
                          className="mt-1 w-full rounded-lg border bg-white p-2 text-sm outline-none focus:border-blue-500"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          [section.key]: formData[section.key].filter((_, itemIndex) => itemIndex !== index),
                        })}
                        className="flex h-10 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                        aria-label={`${point.name || "Nokta"} seçeneğini sil`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* EKSTRA KİŞİ FİYATLANDIRMASI */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-blue-600">Ekstra Kişi Fiyatlandırma Kuralları</h3>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      extra_guest_pricing: [
                        ...formData.extra_guest_pricing,
                        { min_guests: 1, max_guests: 3, price: 1000 }
                      ]
                    });
                  }}
                  className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100 flex items-center gap-1"
                >
                  <Plus size={14} /> Yeni Kural Ekle
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Kapasite limiti aşılırsa, getirilecek ekstra kişi aralığına göre toplam rezervasyon tutarına eklenecek sabit ücretler belirleyebilirsiniz.
              </p>
              <div className="space-y-3">
                {formData.extra_guest_pricing.map((rule: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex-1">
                        <label className="block text-[10px] font-semibold text-slate-500">Min Ekstra Kişi</label>
                        <input
                          type="number"
                          min="1"
                          value={rule.min_guests}
                          onChange={(e) => {
                            const newRules = [...formData.extra_guest_pricing];
                            newRules[idx].min_guests = Number(e.target.value);
                            setFormData({ ...formData, extra_guest_pricing: newRules });
                          }}
                          className="w-full border rounded p-1 text-sm bg-white"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] font-semibold text-slate-500">Max Ekstra Kişi</label>
                        <input
                          type="number"
                          min="1"
                          value={rule.max_guests}
                          onChange={(e) => {
                            const newRules = [...formData.extra_guest_pricing];
                            newRules[idx].max_guests = Number(e.target.value);
                            setFormData({ ...formData, extra_guest_pricing: newRules });
                          }}
                          className="w-full border rounded p-1 text-sm bg-white"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] font-semibold text-slate-500">İlave Ücret (TL)</label>
                        <input
                          type="number"
                          min="0"
                          value={rule.price}
                          onChange={(e) => {
                            const newRules = [...formData.extra_guest_pricing];
                            newRules[idx].price = Number(e.target.value);
                            setFormData({ ...formData, extra_guest_pricing: newRules });
                          }}
                          className="w-full border rounded p-1 text-sm bg-white"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newRules = formData.extra_guest_pricing.filter((_: any, i: number) => i !== idx);
                        setFormData({ ...formData, extra_guest_pricing: newRules });
                      }}
                      className="text-red-500 p-2 hover:bg-red-50 rounded-lg mt-4"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* OLANAKLAR */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-blue-600">Olanaklar (Amenities)</h3>
                <button type="button" onClick={() => addArrayItem('amenities')} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100 flex items-center gap-1">
                  <Plus size={14} /> Yeni Ekle
                </button>
              </div>
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.show_amenities}
                  onChange={(e) => setFormData({ ...formData, show_amenities: e.target.checked })}
                  className="mt-0.5 h-4 w-4 accent-blue-600"
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-800">Yat detayında olanaklar bölümünü göster</span>
                  <span className="block text-xs text-slate-500 mt-0.5">Seçiliyse ve olanak girilmemişse standart bilgilendirme yazısı gösterilir.</span>
                </span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input 
                      placeholder="Örn: Wi-Fi, Klima..." 
                      value={item} 
                      onChange={(e) => handleArrayChange('amenities', idx, e.target.value)} 
                      className="w-full border rounded-lg p-2 outline-none focus:border-blue-500 text-sm" 
                    />
                    <button type="button" onClick={() => removeArrayItem('amenities', idx)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>


            {/* PAKETLER */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-blue-600">Paket Seçenekleri</h3>
                <button type="button" onClick={addPackage} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100 flex items-center gap-1">
                  <Plus size={14} /> Yeni Paket Ekle
                </button>
              </div>
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.show_packages}
                  onChange={(e) => setFormData({ ...formData, show_packages: e.target.checked })}
                  className="mt-0.5 h-4 w-4 accent-blue-600"
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-800">Yat detayında paket seçeneklerini göster</span>
                  <span className="block text-xs text-slate-500 mt-0.5">Seçiliyse ve paket girilmemişse standart bilgilendirme yazısı gösterilir.</span>
                </span>
              </label>
              <div className="space-y-3">
                {formData.packages.map((pkg, idx) => (
                  <div key={idx} className="p-3 border rounded-lg bg-slate-50 relative flex flex-col gap-3">
                    <button type="button" onClick={() => removePackage(idx)} className="absolute top-2 right-2 text-red-500 p-1 hover:bg-red-100 rounded">
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-2 gap-3 pr-8">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Paket Adı</label>
                        <input value={pkg.title} onChange={(e) => updatePackage(idx, 'title', e.target.value)} placeholder="Tam Gün Adalar Turu" className="w-full border rounded p-1.5 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Süre (Saat)</label>
                        <input type="number" min="1" value={pkg.duration} onChange={(e) => updatePackage(idx, 'duration', e.target.value)} placeholder="8" className="w-full border rounded p-1.5 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Fiyat (TL)</label>
                        <input type="number" min="0" value={pkg.price} onChange={(e) => updatePackage(idx, 'price', e.target.value)} placeholder="3200" className="w-full border rounded p-1.5 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Açıklama</label>
                        <input value={pkg.description} onChange={(e) => updatePackage(idx, 'description', e.target.value)} placeholder="Adalar'da yüzme molaları dahil lüks paket." className="w-full border rounded p-1.5 text-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GÖRSELLER */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-blue-600">Görseller</h3>
                <button type="button" onClick={() => addArrayItem('images')} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100 flex items-center gap-1">
                  <Plus size={14} /> Yeni Görsel Ekle
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {formData.images.map((imgUrl, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="Görsel URL'si (Örn: https://...)" 
                        value={imgUrl} 
                        onChange={(e) => handleArrayChange('images', idx, e.target.value)} 
                        className="w-full border rounded-lg p-2 outline-none focus:border-blue-500" 
                      />
                      {formData.images.length > 1 && (
                        <button type="button" onClick={() => removeArrayItem('images', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className="w-12 h-12 rounded-lg border bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                      {isValidYachtImageUrl(imgUrl) ? (
                        <img src={imgUrl} alt="preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} onLoad={(e) => (e.currentTarget.style.display = 'block')} />
                      ) : (
                        <span className="px-1 text-center text-[10px] text-slate-400">{imgUrl ? "Geçersiz URL" : "Boş"}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">Supabase Storage veya başka bir kaynaktan tam görsel URL&apos;si girin.</p>
            </div>

          </form>
        </div>
        <div className="p-4 border-t bg-slate-50 flex justify-end gap-2 shrink-0">
          {errorMessage && <p className="mr-auto self-center text-sm font-medium text-red-600">{errorMessage}</p>}
          <button onClick={onClose} type="button" className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-200 rounded-lg">İptal</button>
          <button form="yachtForm" disabled={loading} type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
