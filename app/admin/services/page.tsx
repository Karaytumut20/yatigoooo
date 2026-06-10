"use client";

import { useEffect, useState } from "react";
import { Actions, AdminList } from "../experiences/page";
import { deleteService } from "../../../lib/admin-actions";
import { getAdminServices } from "../../../lib/api";
import { formatPrice } from "../../../lib/utils";
import { Service } from "../../../types/service";
import { ServiceFormModal } from "./ServiceFormModal";

export default function ServicesAdminPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await getAdminServices());
    } catch {
      setError("Hizmetler yüklenemedi. Önce services.sql dosyasını Supabase SQL Editor'de çalıştırın.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  return (
    <AdminList title="Hizmetler" subtitle="Rezervasyon sırasında seçilebilecek ek hizmetleri yönetin." add={() => setEditing(null)} loading={loading}>
      {error && <p className="lg:col-span-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!error && items.length === 0 && <p className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">Henüz hizmet eklenmedi.</p>}
      {items.map((service) => (
        <article key={service.id} className="admin-card items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-900">{service.name}</h3>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${service.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {service.isActive ? "Yayında" : "Gizli"}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{service.description || "Açıklama yok"}</p>
            <p className="mt-2 text-sm font-semibold text-blue-600">
              {formatPrice(service.price)} {service.priceType === "per_person" ? "/ kişi" : "sabit"} · Sıra {service.sortOrder}
            </p>
          </div>
          <Actions
            edit={() => setEditing(service)}
            remove={async () => {
              if (confirm("Hizmet silinsin mi?")) {
                await deleteService(service.id);
                void load();
              }
            }}
          />
        </article>
      ))}
      {editing !== undefined && (
        <ServiceFormModal
          initial={editing}
          onClose={() => setEditing(undefined)}
          onSuccess={() => { setEditing(undefined); void load(); }}
        />
      )}
    </AdminList>
  );
}
