"use client";

import React, { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getYachts, getExperiences } from "../../../lib/api";
import { deleteYacht } from "../../../lib/admin-actions";
import { YachtFormModal } from "./YachtFormModal";
import { Yacht } from "../../../types/yacht";
import { Experience } from "../../../types/experience";
import { getYachtImage } from "../../../lib/yacht-images";
import { formatPrice } from "../../../lib/utils";

export default function YachtsAdminPage() {
  const router = useRouter();
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [yachtToEdit, setYachtToEdit] = useState<Yacht | null>(null);

  async function loadData() {
    setLoading(true);
    const [yachtsData, experiencesData] = await Promise.all([
      getYachts(),
      getExperiences()
    ]);
    setYachts(yachtsData);
    setExperiences(experiencesData);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (yacht: Yacht) => {
    setYachtToEdit(yacht);
    setIsModalOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (confirm("Bu yatı silmek istediğinize emin misiniz?")) {
      const res = await deleteYacht(slug);
      if (res.success) {
        loadData();
      } else {
        alert("Silme işlemi başarısız oldu.");
      }
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Yatlar yükleniyor...</div>;

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Yat Yönetimi</h1>
          <p className="text-sm text-slate-500 mt-1">Sistemdeki tüm yatları buradan yönetebilirsiniz.</p>
        </div>
        <button onClick={() => { setYachtToEdit(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-md">
          <Plus size={18} />
          <span>Yeni Yat Ekle</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Yat Ara..." 
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Yat Bilgisi</th>
                <th className="px-6 py-4 font-semibold">Kapasite</th>
                <th className="px-6 py-4 font-semibold">Saatlik Fiyat</th>
                <th className="px-6 py-4 font-semibold">Durum</th>
                <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {yachts.map((yacht, i) => (
                <tr key={yacht.slug || i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 relative rounded-lg overflow-hidden bg-slate-100">
                        <Image src={getYachtImage(yacht.images)} alt={yacht.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{yacht.name}</p>
                        <p className="text-xs text-slate-500">{yacht.length} · /{yacht.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="font-semibold">{yacht.capacity} Kişi</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{formatPrice(yacht.hourlyPrice)}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      Aktif
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/yatlarimiz/${yacht.slug}`} prefetch={false} target="_blank" title="Yat detayını aç" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <ExternalLink size={18} />
                      </Link>
                      <button onClick={() => handleEdit(yacht)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(yacht.slug)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <YachtFormModal 
          yachts={yachts}
          experiences={experiences}
          initialYacht={yachtToEdit}
          onClose={() => {
            setIsModalOpen(false);
            setYachtToEdit(null);
          }} 
          onSuccess={() => {
            setIsModalOpen(false);
            setYachtToEdit(null);
            loadData();
          }} 
        />
      )}
    </div>
  );
}
