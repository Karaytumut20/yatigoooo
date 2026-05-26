"use client";

import React from "react";
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";

export default function ContactPage() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    alert("Talebiniz alınmıştır! En kısa sürede sizinle iletişime geçeceğiz.");
    reset();
  };

  return (
    <main className="bg-[#021C24] min-h-screen text-white pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column info details */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-[#2ED3C6] font-bold">Bize Ulaşın</span>
            <h1 className="font-serif text-4xl sm:text-6xl text-white leading-none">
              İletişim
            </h1>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed mt-2">
              Özel yat kiralama teklifleri ve organizasyon detayları için ofisimizi ziyaret edebilir veya telefonla 7/24 arayabilirsiniz.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white/5 border border-white/8 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#2ED3C6]">
                <Phone size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-white/50">Telefon Numarası</span>
                <strong className="text-white text-base font-semibold">+90 212 555 66 77</strong>
              </div>
            </div>

            <div className="bg-white/5 border border-white/8 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#2ED3C6]">
                <Mail size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-white/50">E-posta Adresi</span>
                <strong className="text-white text-base font-semibold">info@bosphorusyachtcharter.com</strong>
              </div>
            </div>

            <div className="bg-white/5 border border-white/8 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#2ED3C6]">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-white/50">Liman Adresi</span>
                <strong className="text-white text-base font-semibold">Kuruçeşme Limanı, Beşiktaş / İstanbul</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Form */}
        <div className="lg:col-span-7 bg-white/5 border border-white/12 backdrop-blur-2xl rounded-[32px] p-6 sm:p-10">
          <h3 className="font-serif text-2xl text-white mb-6">Hızlı Teklif Formu</h3>
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
              <Input
                label="Tarih"
                required
                type="date"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Kişi Sayısı"
                required
                type="number"
                placeholder="10"
              />
              <Select
                label="Etkinlik Türü"
                options={[
                  { value: "evlilik-teklifi", label: "Evlilik Teklifi" },
                  { value: "bogaz-turu", label: "Boğaz Turu" },
                  { value: "yemekli-tur", label: "Yemekli Yat Turu" }
                ]}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-widest text-white/60 font-medium">Mesajınız</label>
              <textarea
                required
                placeholder="Özel isteklerinizi ve detayları buraya yazabilirsiniz..."
                className="bg-white/5 border border-white/10 text-white px-5 py-3.5 rounded-xl text-sm outline-none transition-all duration-300 focus:border-[#2ED3C6] focus:bg-white/10 placeholder:text-white/30 h-32 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#2ED3C6] hover:bg-white text-[#021C24] py-4 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(46,211,198,0.4)] cursor-pointer"
            >
              Fiyat Teklifi Al
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
