"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CalendarDays, CheckCircle, Clock3, Trash2, XCircle } from "lucide-react";
import { getBookings, getYachts } from "../../../lib/api";
import { deleteBooking, updateBookingStatus } from "../../../lib/admin-actions";
import { formatPrice, formatDate } from "../../../lib/utils";
import { AdminBooking } from "../../../types/booking";
import { Yacht } from "../../../types/yacht";
import { getYachtImage } from "../../../lib/yacht-images";
import { AdminList } from "../experiences/page";

export default function BookingsAdminPage() {
  const [items, setItems] = useState<AdminBooking[]>([]);
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  const load = async () => {
    const [bookingsData, yachtsData] = await Promise.all([
      getBookings(),
      getYachts()
    ]);
    setItems(bookingsData);
    setYachts(yachtsData);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    await updateBookingStatus(id, status);
  };

  const selectedDayBookings = items
    .filter((booking) => booking.booking_date === selectedDate && booking.status === "Onaylandı")
    .sort((a, b) => (a.start_time || "00:00").localeCompare(b.start_time || "00:00"));

  const selectedDateLabel = new Intl.DateTimeFormat("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${selectedDate}T00:00:00`));

  return (
    <AdminList title="Rezervasyon Talepleri" subtitle="Talepleri görüntüleyin, durumunu güncelleyin veya silin." loading={loading}>
      <section className="col-span-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-600">
              <CalendarDays size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Sefer Takvimi</span>
            </div>
            <h2 className="mt-2 text-xl font-bold capitalize text-slate-900">{selectedDateLabel}</h2>
            <p className="mt-1 text-sm text-slate-500">{selectedDayBookings.length} aktif sefer bulunuyor.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-blue-300">
              Bugün
            </button>
            <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="p-5">
          {selectedDayBookings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
              Bu tarih için planlanmış aktif sefer bulunmuyor.
            </div>
          ) : (
             <div className="flex flex-col gap-3">
               {selectedDayBookings.map((booking) => {
                 const bookingYacht = yachts.find(y => y.slug === booking.yacht_slug);
                 return (
                   <div key={`schedule-${booking.id}`} className="grid grid-cols-[76px_1fr] gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[90px_1fr_auto] sm:items-center">
                     <div className="flex items-center gap-2 text-blue-600">
                       <Clock3 size={16} />
                       <strong className="text-base">{booking.start_time || "10:00"}</strong>
                     </div>
                     <div className="flex items-center gap-3">
                       {bookingYacht && (
                         <div className="relative w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-slate-200 border border-slate-300">
                           <Image src={getYachtImage(bookingYacht.images)} alt={bookingYacht.name} fill className="object-cover" />
                         </div>
                       )}
                       <div>
                         <p className="font-bold text-slate-900">{bookingYacht ? bookingYacht.name : (booking.yacht_slug || booking.experience_slug)}</p>
                         <p className="mt-0.5 text-xs text-slate-500">{booking.customer_name} · {booking.duration || 0} saat · {booking.guests || 0} kişi</p>
                         {(booking.pickup_point || booking.dropoff_point) && <p className="mt-0.5 text-xs text-blue-600">{booking.pickup_point || "-"} → {booking.dropoff_point || "-"}</p>}
                       </div>
                     </div>
                     <span className="col-start-2 w-fit rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 sm:col-start-auto">{booking.status}</span>
                   </div>
                 );
               })}
             </div>
          )}
        </div>
      </section>
      {items.map((booking) => {
        const isPending = booking.status !== "Onaylandı" && booking.status !== "İptal";
        const bookingYacht = yachts.find(y => y.slug === booking.yacht_slug);
        return (
          <article 
            key={booking.id} 
            className={`admin-card items-start transition-all duration-300 ${
              isPending 
                ? "border-l-4 border-l-amber-500 bg-amber-50/15 shadow-[0_4px_12px_rgba(245,158,11,0.06)] ring-1 ring-amber-200/50 hover:shadow-lg scale-[1.01]" 
                : "hover:shadow-md"
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-bold text-slate-900">{booking.customer_name}</h3>
                {isPending && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Yeni Talep
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 break-words">{booking.phone} · {booking.email}</p>
              
              <div className="flex items-center gap-3 mt-3 bg-slate-50 border border-slate-100 p-2.5 rounded-xl w-fit">
                {bookingYacht && (
                  <div className="relative w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-slate-200 border border-slate-200">
                    <Image src={getYachtImage(bookingYacht.images)} alt={bookingYacht.name} fill className="object-cover" />
                  </div>
                )}
                <div className="text-xs">
                  <span className="block text-slate-400 font-medium leading-none">Kiralanan Yat / Hizmet</span>
                  <strong className="text-slate-800 font-bold leading-none mt-1.5 block">
                    {bookingYacht ? bookingYacht.name : (booking.yacht_slug || booking.experience_slug)}
                  </strong>
                </div>
              </div>

              <p className="text-sm mt-3 font-medium text-slate-700">
                Tarih: <strong className="text-slate-900">{formatDate(booking.booking_date)}</strong> · Saat: <strong className="text-slate-900">{booking.start_time || "10:00"}</strong> · Süre: <strong className="text-slate-900">{booking.duration} saat</strong> · Kapasite: <strong className="text-slate-900">{booking.guests} kişi</strong> · Tutar: <strong className="text-blue-600 font-bold">{formatPrice(booking.total_amount || 0)}</strong>
              </p>
              {!!booking.extras?.length && (
                <p className="text-xs text-blue-600 mt-2">
                  Ek Hizmetler: {booking.extras.map((service) => service.name).join(", ")}
                </p>
              )}
              {(booking.pickup_point || booking.dropoff_point) && (
                <p className="text-xs text-slate-500 mt-2">
                  Biniş: {booking.pickup_point || "-"} · İniş: {booking.dropoff_point || "-"}
                </p>
              )}
              {booking.notes && <p className="text-xs text-slate-500 mt-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100 italic">Not: {booking.notes}</p>}
              <span className={`inline-block mt-3 px-2 py-1 rounded text-xs font-bold ${booking.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-700' : booking.status === 'İptal' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{booking.status}</span>
            </div>
            <div className="flex gap-1">
              {booking.status !== "Onaylandı" && (
                <button title="Onayla" onClick={() => updateStatus(booking.id, "Onaylandı")} className="admin-icon text-emerald-600"><CheckCircle size={18} /></button>
              )}
              {booking.status !== "İptal" && (
                <button title="İptal" onClick={() => updateStatus(booking.id, "İptal")} className="admin-icon text-amber-600"><XCircle size={18} /></button>
              )}
              <button title="Sil" onClick={async () => { if (confirm("Rezervasyon silinsin mi?")) { setItems((prev) => prev.filter(i => i.id !== booking.id)); await deleteBooking(booking.id); } }} className="admin-icon text-red-600"><Trash2 size={18} /></button>
            </div>
          </article>
        );
      })}
    </AdminList>
  );
}
