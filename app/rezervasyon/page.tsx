"use client";

import React, { useState } from "react";
import Image from "next/image";
import { YACHTS, EXPERIENCES } from "../../lib/data";
import { formatPrice } from "../../lib/utils";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [bookingDetails, setBookingDetails] = useState({
    yachtSlug: YACHTS[0].slug,
    experienceSlug: EXPERIENCES[0].slug,
    date: "",
    duration: 2,
    guests: 10,
    extras: {
      catering: false,
      music: false,
      decor: false,
      laser: false
    }
  });

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleYachtChange = (val: string) => {
    setBookingDetails(prev => ({ ...prev, yachtSlug: val }));
  };

  const handleExpChange = (val: string) => {
    setBookingDetails(prev => ({ ...prev, experienceSlug: val }));
  };

  const handleExtraToggle = (key: "catering" | "music" | "decor" | "laser") => {
    setBookingDetails(prev => ({
      ...prev,
      extras: {
        ...prev.extras,
        [key]: !prev.extras[key]
      }
    }));
  };

  const calculateTotal = () => {
    const yacht = YACHTS.find(y => y.slug === bookingDetails.yachtSlug) || YACHTS[0];
    let cost = yacht.hourlyPrice * bookingDetails.duration;
    if (bookingDetails.extras.catering) cost += 40 * bookingDetails.guests;
    if (bookingDetails.extras.music) cost += 150;
    if (bookingDetails.extras.decor) cost += 200;
    if (bookingDetails.extras.laser) cost += 300;
    return cost;
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const onSubmit = (data: any) => {
    alert("Rezervasyon talebiniz alınmıştır! Temsilcimiz ön ödeme dekont kontrolü için sizinle iletişime geçecektir.");
    window.location.href = "/";
  };

  const currentYacht = YACHTS.find(y => y.slug === bookingDetails.yachtSlug) || YACHTS[0];
  const total = calculateTotal();
  const prepayment = Math.round(total * 0.5);

  return (
    <main className="bg-[#021C24] min-h-screen text-white pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left main form wrapper */}
        <div className="lg:col-span-8 bg-white/5 border border-white/12 backdrop-blur-2xl rounded-[32px] p-6 sm:p-10">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
            <h1 className="font-serif text-3xl text-white">Yat Kiralama Rezervasyonu</h1>
            <span className="text-xs font-bold text-[#C6A15B] uppercase tracking-wider">Adım {step} / 5</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Step 1: Yacht & Experience Selection */}
            {step === 1 && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {YACHTS.map((y) => (
                    <label
                      key={y.slug}
                      className={`glass-card p-5 cursor-pointer flex items-center gap-4 rounded-2xl border transition-all duration-300 ${
                        bookingDetails.yachtSlug === y.slug
                          ? "border-[#2ED3C6] bg-white/10"
                          : "border-white/8 bg-transparent"
                      }`}
                    >
                      <input
                        type="radio"
                        name="yacht-select"
                        value={y.slug}
                        checked={bookingDetails.yachtSlug === y.slug}
                        onChange={() => handleYachtChange(y.slug)}
                        className="accent-[#2ED3C6]"
                      />
                      <div>
                        <strong className="text-white block text-sm">{y.name}</strong>
                        <span className="text-xs text-white/50">{y.length} • Max {y.capacity} Kişi</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Date & duration */}
            {step === 2 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Tur Tarihi</label>
                  <input
                    type="date"
                    required
                    value={bookingDetails.date}
                    onChange={(e) => setBookingDetails(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-[#2ED3C6]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Süre (Saat)</label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={bookingDetails.duration}
                    onChange={(e) => setBookingDetails(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-[#2ED3C6]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Misafir Sayısı</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={bookingDetails.guests}
                    onChange={(e) => setBookingDetails(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-[#2ED3C6]"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Extras checklist */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <label className="glass-card p-5 flex items-center justify-between cursor-pointer rounded-2xl border border-white/8 hover:border-white/20">
                  <div>
                    <strong className="text-white block text-sm">Gurme Yemek Menüsü</strong>
                    <span className="text-xs text-white/50">Kişi başı zengin set menü servisi (+€40 / kişi)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={bookingDetails.extras.catering}
                    onChange={() => handleExtraToggle("catering")}
                    className="accent-[#2ED3C6] w-5 h-5"
                  />
                </label>

                <label className="glass-card p-5 flex items-center justify-between cursor-pointer rounded-2xl border border-white/8 hover:border-white/20">
                  <div>
                    <strong className="text-white block text-sm">Profesyonel Keman Dinletisi</strong>
                    <span className="text-xs text-white/50">Seyir süresince canlı keman resitali (+€150)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={bookingDetails.extras.music}
                    onChange={() => handleExtraToggle("music")}
                    className="accent-[#2ED3C6] w-5 h-5"
                  />
                </label>

                <label className="glass-card p-5 flex items-center justify-between cursor-pointer rounded-2xl border border-white/8 hover:border-white/20">
                  <div>
                    <strong className="text-white block text-sm">Köprüye Lazerle İsim Yazma</strong>
                    <span className="text-xs text-white/50">Boğaziçi köprüsü altına yüksek güç lazer şovu (+€300)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={bookingDetails.extras.laser}
                    onChange={() => handleExtraToggle("laser")}
                    className="accent-[#2ED3C6] w-5 h-5"
                  />
                </label>
              </div>
            )}

            {/* Step 4: Contact details info */}
            {step === 4 && (
              <div className="flex flex-col gap-4">
                <Input
                  label="Ad Soyad"
                  required
                  placeholder="Ahmet Yılmaz"
                />
                <Input
                  label="Telefon"
                  required
                  type="tel"
                  placeholder="0555 555 5555"
                />
                <Input
                  label="E-posta"
                  required
                  type="email"
                  placeholder="ahmet@example.com"
                />
              </div>
            )}

            {/* Step 5: Confirms bank transfer info */}
            {step === 5 && (
              <div className="flex flex-col gap-6">
                <p className="text-white/60 text-sm leading-relaxed">
                  Tebrikler, tüm adımları tamamladınız. Rezervasyon talebinizi onaylamak için lütfen aşağıdaki hesaba %50 oranında ön ödeme transferini gerçekleştiriniz.
                </p>
                <div className="bg-[#C6A15B]/10 border border-[#C6A15B]/30 rounded-2xl p-6">
                  <h4 className="text-[#C6A15B] font-bold text-sm uppercase tracking-wider mb-2">Banka EFT/Havale Bilgileri</h4>
                  <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                    <strong>Banka:</strong> Garanti BBVA<br />
                    <strong>Alıcı:</strong> Bosphorus Yacht Turizm A.Ş.<br />
                    <strong>IBAN:</strong> TR45 0006 2000 1234 5678 9012 34<br />
                    <strong>Açıklama:</strong> Rezervasyon ad soyad giriniz.
                  </p>
                </div>
              </div>
            )}

            {/* Form control buttons */}
            <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 rounded-full border border-white/12 text-white text-xs font-bold hover:bg-white/5 cursor-pointer"
                >
                  Geri Dön
                </button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 rounded-full bg-[#2ED3C6] text-[#021C24] text-xs font-bold hover:shadow-[0_0_15px_rgba(46,211,198,0.4)] cursor-pointer"
                >
                  Devam Et
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[#2ED3C6] text-[#021C24] text-xs font-bold hover:shadow-[0_0_15px_rgba(46,211,198,0.4)] cursor-pointer"
                >
                  Rezervasyonu Tamamla
                </button>
              )}
            </div>

          </form>
        </div>

        {/* Right sticky sidebar details */}
        <div className="lg:col-span-4 lg:sticky lg:top-[110px] flex flex-col gap-6">
          <div className="bg-[#063B45]/40 border border-white/12 rounded-[32px] p-6 flex flex-col gap-6 backdrop-blur-2xl">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#063B45]">
              <Image
                src={currentYacht.images[0]}
                alt={currentYacht.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-white font-semibold">{currentYacht.name}</h3>
              <span className="text-xs text-white/50">{currentYacht.length} • {currentYacht.capacity} Kişi Kapasite</span>
            </div>
            <div className="flex flex-col gap-3.5 border-t border-b border-white/10 py-5 text-sm text-white/70">
              <div className="flex justify-between">
                <span>Süre:</span>
                <strong>{bookingDetails.duration} Saat</strong>
              </div>
              <div className="flex justify-between">
                <span>Misafir:</span>
                <strong>{bookingDetails.guests} Kişi</strong>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-xs text-white/50">Toplam Tutar</span>
                <strong className="text-[#2ED3C6] text-2xl font-bold">{formatPrice(total)}</strong>
              </div>
              <div className="flex justify-between items-end pt-2 border-t border-white/5">
                <span className="text-xs text-white/50">%50 Ön Ödeme</span>
                <strong className="text-[#C6A15B] text-xl font-bold">{formatPrice(prepayment)}</strong>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
