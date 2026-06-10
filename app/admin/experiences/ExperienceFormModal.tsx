"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Check } from "lucide-react";
import Image from "next/image";
import { Experience } from "../../../types/experience";
import { Yacht } from "../../../types/yacht";
import { createExperience, updateExperience } from "../../../lib/admin-actions";
import { getYachts } from "../../../lib/api";
import { slugifyYacht } from "../../../lib/yacht-slug";
import { getYachtImage } from "../../../lib/yacht-images";

export function ExperienceFormModal({
  initial,
  onClose,
  onSuccess,
}: {
  initial?: Experience | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [loadingYachts, setLoadingYachts] = useState(true);

  useEffect(() => {
    async function loadYachts() {
      setLoadingYachts(true);
      const data = await getYachts();
      setYachts(data);
      setLoadingYachts(false);
    }
    loadYachts();
  }, []);

  const [form, setForm] = useState({
    title: initial?.title || "",
    slug: initial?.slug || "",
    category: initial?.category || "celebration",
    short_description: initial?.shortDescription || "",
    description: initial?.description || "",
    starting_price: initial?.startingPrice || 0,
    duration: initial?.duration || "",
    image: initial?.image || "/yacht_aerial_hero.png",
    suitable_for: initial?.suitableFor || [""],
    includes: initial?.includes || [""],
    sample_flow: initial?.sampleFlow || [""],
    recommended_yachts: initial?.recommendedYachts || [],
    faq: initial?.faq || [],
  });

  const toggleYacht = (slug: string) => {
    const current = form.recommended_yachts.filter(Boolean);
    if (current.includes(slug)) {
      setForm({ ...form, recommended_yachts: current.filter(x => x !== slug) });
    } else {
      setForm({ ...form, recommended_yachts: [...current, slug] });
    }
  };

  const handleArrayChange = (
    field: "suitable_for" | "includes" | "sample_flow" | "recommended_yachts",
    index: number,
    value: string
  ) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm({ ...form, [field]: updated });
  };

  const addArrayItem = (field: "suitable_for" | "includes" | "sample_flow" | "faq") => {
    if (field === "faq") {
      setForm({ ...form, faq: [...form.faq, { question: "", answer: "" }] });
    } else {
      setForm({ ...form, [field]: [...form[field], ""] });
    }
  };

  const removeArrayItem = (field: "suitable_for" | "includes" | "sample_flow" | "faq", index: number) => {
    if (field === "faq") {
      setForm({ ...form, faq: form.faq.filter((_, i) => i !== index) });
    } else {
      setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });
    }
  };

  const handleFaqChange = (index: number, field: "question" | "answer", value: string) => {
    const updated = [...form.faq];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, faq: updated });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      slug: slugifyYacht(form.slug || form.title),
      title: form.title.trim(),
      category: form.category,
      short_description: form.short_description.trim(),
      description: form.description.trim(),
      starting_price: Number(form.starting_price),
      duration: form.duration.trim(),
      image: form.image.trim(),
      suitable_for: form.suitable_for.filter(Boolean),
      includes: form.includes.filter(Boolean),
      sample_flow: form.sample_flow.filter(Boolean),
      recommended_yachts: form.recommended_yachts.filter(Boolean),
      faq: form.faq.filter((f) => f.question.trim() && f.answer.trim()),
    };

    const result = initial
      ? await updateExperience(initial.slug, payload)
      : await createExperience(payload);

    setSaving(false);

    if (result.success) {
      onSuccess();
    } else {
      setError((result as { error?: { message?: string } }).error?.message || "İşlem başarısız.");
    }
  };

  return (
    <Modal title={initial ? "Deneyimi Düzenle" : "Yeni Deneyim Ekle"} onClose={onClose}>
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Başlık ve Slug */}
        <Field
          label="Deneyim Başlığı"
          value={form.title}
          onChange={(value) => setForm({ ...form, title: value, slug: slugifyYacht(value) })}
          required
        />
        <Field label="Slug (URL)" value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} required />

        {/* Kategori */}
        <label className="text-sm font-semibold">
          Kategori
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="input mt-1"
            required
          >
            <option value="celebration">Kutlama</option>
            <option value="romantic">Romantik</option>
            <option value="corporate">Kurumsal</option>
            <option value="leisure">Eğlence</option>
          </select>
        </label>

        {/* Fiyat ve Süre */}
        <Field
          label="Başlangıç Fiyatı (TL)"
          type="number"
          value={String(form.starting_price)}
          onChange={(value) => setForm({ ...form, starting_price: Number(value) })}
          required
        />
        <Field label="Süre" value={form.duration} onChange={(value) => setForm({ ...form, duration: value })} required />

        {/* Görsel URL */}
        <Field
          label="Görsel URL"
          value={form.image}
          onChange={(value) => setForm({ ...form, image: value })}
          className="sm:col-span-2"
        />

        {/* Kısa Açıklama */}
        <Area
          label="Kısa Açıklama"
          value={form.short_description}
          onChange={(value) => setForm({ ...form, short_description: value })}
          className="sm:col-span-2"
        />

        {/* Detaylı Açıklama */}
        <Area
          label="Detaylı Açıklama"
          value={form.description}
          onChange={(value) => setForm({ ...form, description: value })}
          className="sm:col-span-2"
          rows={4}
        />

        {/* Suitable For */}
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold mb-2 block">Kimler İçin Uygun?</label>
          {form.suitable_for.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange("suitable_for", index, e.target.value)}
                className="input flex-1"
                placeholder="Örn: Çiftler, Aileler"
              />
              <button
                type="button"
                onClick={() => removeArrayItem("suitable_for", index)}
                className="admin-icon text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("suitable_for")} className="admin-secondary text-sm">
            <Plus size={16} />
            Ekle
          </button>
        </div>

        {/* Includes */}
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold mb-2 block">Paket İçeriği</label>
          {form.includes.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange("includes", index, e.target.value)}
                className="input flex-1"
                placeholder="Örn: Profesyonel fotoğrafçı"
              />
              <button
                type="button"
                onClick={() => removeArrayItem("includes", index)}
                className="admin-icon text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("includes")} className="admin-secondary text-sm">
            <Plus size={16} />
            Ekle
          </button>
        </div>

        {/* Sample Flow */}
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold mb-2 block">Örnek Program Akışı</label>
          {form.sample_flow.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange("sample_flow", index, e.target.value)}
                className="input flex-1"
                placeholder="Örn: 18:00 - Karşılama & İçecek"
              />
              <button
                type="button"
                onClick={() => removeArrayItem("sample_flow", index)}
                className="admin-icon text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("sample_flow")} className="admin-secondary text-sm">
            <Plus size={16} />
            Ekle
          </button>
        </div>

        {/* Önerilen Yatlar - Yeni Tasarım */}
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold mb-3 block">Önerilen Yatlar</label>
          <p className="text-xs text-slate-500 mb-4">Bu deneyim için uygun olan yatları seçin (birden fazla seçilebilir)</p>
          
          {loadingYachts ? (
            <p className="text-sm text-slate-500">Yatlar yükleniyor...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-2 bg-slate-50 rounded-xl">
              {yachts.map((yacht) => {
                const isSelected = form.recommended_yachts.includes(yacht.slug);
                return (
                  <div
                    key={yacht.slug}
                    onClick={() => toggleYacht(yacht.slug)}
                    className={`relative cursor-pointer rounded-xl border-2 transition-all overflow-hidden group hover:shadow-lg ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    {/* Seçim İşareti */}
                    <div
                      className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected ? "bg-blue-600" : "bg-white border-2 border-slate-300"
                      }`}
                    >
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>

                    {/* Yat Görseli */}
                    <div className="relative w-full h-32 bg-slate-100">
                      <Image
                        src={getYachtImage(yacht.images)}
                        alt={yacht.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Yat Bilgileri */}
                    <div className="p-3">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{yacht.name}</h4>
                      <div className="flex items-center justify-between mt-2 text-xs text-slate-600">
                        <span>{yacht.capacity} Kişi</span>
                        <span>{yacht.length}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">₺{yacht.hourlyPrice}/saat</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Seçili Yatlar Özeti */}
          {form.recommended_yachts.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                Seçili Yatlar ({form.recommended_yachts.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {form.recommended_yachts.map((slug) => {
                  const yacht = yachts.find((y) => y.slug === slug);
                  if (!yacht) return null;
                  return (
                    <span
                      key={slug}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-blue-200"
                    >
                      {yacht.name}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleYacht(slug);
                        }}
                        className="hover:text-red-600 ml-1"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold mb-2 block">Sık Sorulan Sorular</label>
          {form.faq.map((item, index) => (
            <div key={index} className="mb-4 p-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-500">Soru {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeArrayItem("faq", index)}
                  className="admin-icon text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <input
                type="text"
                value={item.question}
                onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                className="input mb-2 break-words"
                placeholder="Soru"
              />
              <textarea
                value={item.answer}
                onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                className="input resize-y min-h-[80px] break-words whitespace-pre-wrap"
                rows={3}
                placeholder="Cevap"
              />
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("faq")} className="admin-secondary text-sm">
            <Plus size={16} />
            Soru Ekle
          </button>
        </div>

        {/* Hata Mesajı */}
        {error && <p className="text-red-600 text-sm sm:col-span-2">{error}</p>}

        {/* Kaydet Butonu */}
        <button disabled={saving} className="sm:col-span-2 bg-blue-600 text-white rounded-xl py-3 font-bold disabled:opacity-60">
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </Modal>
  );
}

// Reusable Components
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="admin-icon text-slate-400 hover:text-slate-600">
            <X size={22} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`text-sm font-semibold ${className}`}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input mt-1"
        required={required}
      />
    </label>
  );
}

export function Area({
  label,
  value,
  onChange,
  required = false,
  rows = 3,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
  className?: string;
}) {
  return (
    <label className={`text-sm font-semibold ${className}`}>
      {label}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input mt-1"
        rows={rows}
        required={required}
      />
    </label>
  );
}
