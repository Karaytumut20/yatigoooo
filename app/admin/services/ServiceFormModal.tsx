"use client";

import { useState } from "react";
import { Service, ServicePriceType } from "../../../types/service";
import { createService, updateService } from "../../../lib/admin-actions";
import { Area, Field, Modal } from "../experiences/ExperienceFormModal";

export function ServiceFormModal({
  initial,
  onClose,
  onSuccess,
}: {
  initial?: Service | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    description: string;
    price: number;
    price_type: ServicePriceType;
    is_active: boolean;
    sort_order: number;
  }>({
    name: initial?.name || "",
    description: initial?.description || "",
    price: initial?.price || 0,
    price_type: initial?.priceType || "fixed",
    is_active: initial?.isActive ?? true,
    sort_order: initial?.sortOrder || 0,
  });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      price_type: form.price_type,
      is_active: form.is_active,
      sort_order: Number(form.sort_order),
    };
    const result = initial
      ? await updateService(initial.id, payload)
      : await createService(payload);
    setSaving(false);
    if (result.success) onSuccess();
    else setError((result as { error?: { message?: string } }).error?.message || "İşlem başarısız.");
  };

  return (
    <Modal title={initial ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"} onClose={onClose}>
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Hizmet Adı" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
        <Field label="Fiyat (TL)" type="number" value={String(form.price)} onChange={(value) => setForm({ ...form, price: Number(value) })} required />
        <label className="text-sm font-semibold">
          Fiyatlandırma
          <select value={form.price_type} onChange={(event) => setForm({ ...form, price_type: event.target.value as ServicePriceType })} className="input mt-1">
            <option value="fixed">Sabit fiyat</option>
            <option value="per_person">Kişi başı</option>
          </select>
        </label>
        <Field label="Sıralama" type="number" value={String(form.sort_order)} onChange={(value) => setForm({ ...form, sort_order: Number(value) })} />
        <Area label="Açıklama" value={form.description} onChange={(value) => setForm({ ...form, description: value })} className="sm:col-span-2" />
        <label className="sm:col-span-2 flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-semibold cursor-pointer">
          <input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} className="accent-blue-600 w-5 h-5" />
          Rezervasyon ekranında yayınla
        </label>
        {error && <p className="text-red-600 text-sm sm:col-span-2">{error}</p>}
        <button disabled={saving} className="sm:col-span-2 bg-blue-600 text-white rounded-xl py-3 font-bold disabled:opacity-60">
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </Modal>
  );
}
