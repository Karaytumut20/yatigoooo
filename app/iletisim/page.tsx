"use client";

import React, { useEffect, useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { getYachts } from "../../lib/api";
import { YachtTransferPoint } from "../../types/yacht";
import { BookingDatePicker } from "../../components/ui/BookingDatePicker";

export default function ContactPage() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [pickupPoints, setPickupPoints] = useState<YachtTransferPoint[]>([]);
  const [dropoffPoints, setDropoffPoints] = useState<YachtTransferPoint[]>([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    getYachts().then((yachts) => {
      const uniquePoints = (points: YachtTransferPoint[]) => Array.from(
        new Map(points.map((point) => [point.name, point])).values()
      );
      setPickupPoints(uniquePoints(yachts.flatMap((yacht) => yacht.pickupPoints || [])));
      setDropoffPoints(uniquePoints(yachts.flatMap((yacht) => yacht.dropoffPoints || [])));
    });
  }, []);

  const onSubmit = (data: any) => {
    alert("Talebiniz alınmıştır! En kısa sürede sizinle iletişime geçeceğiz.");
    reset();
    setSelectedDate("");
  };

  return (
    <main className="bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column info details */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-blue-600 font-bold">Bize Ulaşın</span>
            <h1 className="font-sans text-4xl sm:text-6xl text-slate-900 font-bold leading-none">
              İletişim
            </h1>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed mt-2">
              Özel yat kiralama teklifleri ve organizasyon detayları için ofisimizi ziyaret edebilir veya telefonla 7/24 arayabilirsiniz.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Phone size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">Telefon Numarası</span>
                <strong className="text-slate-800 text-base font-semibold">+90 212 555 66 77</strong>
              </div>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Mail size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">E-posta Adresi</span>
                <strong className="text-slate-800 text-base font-semibold">info@bosphorusyachtcharter.com</strong>
              </div>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">Liman Adresi</span>
                <strong className="text-slate-800 text-base font-semibold">Kuruçeşme Limanı, Beşiktaş / İstanbul</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 shadow-xl rounded-2xl p-6 sm:p-10">
          <h3 className="font-sans text-2xl text-slate-900 font-bold mb-6">Hızlı Teklif Formu</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ad Soyad"
                required
                placeholder="Ahmet Yılmaz"
              />
              <Input
                label="Telefon"
                required
                placeholder="0555 555 5555"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="E-posta"
                required
                type="email"
                placeholder="ahmet@example.com"
              />
              <BookingDatePicker
                value={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setValue("date", date);
                }}
              />
              <input type="hidden" {...register("date", { required: true })} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Input
                label="Kişi Sayısı"
                required
                type="number"
                placeholder="10"
              />
              <Select
                {...register("pickupPoint")}
                label="Biniş Yeri"
                required
                options={[
                  { value: "", label: pickupPoints.length ? "Biniş yeri seçin" : "Henüz biniş yeri tanımlanmadı" },
                  ...pickupPoints.map((point) => ({
                    value: point.name,
                    label: `${point.name}${point.price > 0 ? ` (+${point.price} TL)` : ""}`,
                  })),
                ]}
              />
              <Select
                {...register("dropoffPoint")}
                label="İniş Yeri"
                required
                options={[
                  { value: "", label: dropoffPoints.length ? "İniş yeri seçin" : "Henüz iniş yeri tanımlanmadı" },
                  ...dropoffPoints.map((point) => ({
                    value: point.name,
                    label: `${point.name}${point.price > 0 ? ` (+${point.price} TL)` : ""}`,
                  })),
                ]}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">Mesajınız</label>
              <textarea
                required
                placeholder="Özel isteklerinizi ve detayları buraya yazabilirsiniz..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white placeholder:text-slate-400 h-32 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_8px_30px_rgba(37,99,235,0.35)] cursor-pointer mt-2"
            >
              Fiyat Teklifi Al
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
