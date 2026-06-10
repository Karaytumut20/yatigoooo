"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { getYachts } from "../../lib/api";
import { Yacht } from "../../types/yacht";
import { formatPrice, formatDate } from "../../lib/utils";
import { getYachtImage } from "../../lib/yacht-images";
import { getUserBookings, getUserProfile, updateUserProfile } from "../../lib/user-actions";
import { 
  User, 
  Calendar, 
  Clock, 
  Users, 
  CreditCard, 
  LogOut, 
  Compass, 
  MapPin, 
  Phone, 
  Mail, 
  Edit2, 
  Check, 
  Loader2, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "profile">("upcoming");
  
  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      // Get session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/dashboard");
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);

      // Fetch Profile via Server Action
      const profileData = await getUserProfile(currentUser.id);

      setProfile(profileData);
      setEditName(profileData?.full_name || currentUser.user_metadata?.full_name || "");
      setEditPhone(profileData?.phone || currentUser.user_metadata?.phone || "");

      // Fetch Bookings via Server Action to bypass RLS
      const bookingsData = await getUserBookings(currentUser.id, currentUser.email || "");
      
      setBookings(bookingsData || []);

      // Fetch Yachts for mapping names/images
      const yachtsData = await getYachts();
      setYachts(yachtsData);

      setLoading(false);
    }

    loadData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage("");

    try {
      const result = await updateUserProfile(user.id, editName, editPhone);

      if (!result.success) throw result.error;

      // Update auth user metadata too
      await supabase.auth.updateUser({
        data: {
          full_name: editName,
          phone: editPhone
        }
      });

      setProfile((prev: any) => ({ ...prev, full_name: editName, phone: editPhone }));
      setProfileMessage("Profil başarıyla güncellendi.");
      setIsEditingProfile(false);
    } catch (err: any) {
      setProfileMessage("Profil güncellenirken hata oluştu.");
    } finally {
      setProfileSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-slate-50 min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <span className="text-sm font-semibold text-slate-600">Bilgileriniz yükleniyor...</span>
        </div>
      </main>
    );
  }

  // Filter bookings
  const today = new Date().toISOString().split("T")[0];
  const upcomingBookings = bookings.filter(b => b.booking_date >= today);
  const pastBookings = bookings.filter(b => b.booking_date < today);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Onaylandı":
        return "bg-green-100 text-green-800 border-green-200";
      case "İptal":
      case "İptal Edildi":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20">
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[40%] h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-blue-900 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 bg-blue-600/30 rounded-2xl flex items-center justify-center border border-blue-400/30 shadow-inner">
              <User size={32} className="text-blue-300" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-blue-400 font-bold">Üye Paneli</span>
              <h1 className="text-2xl sm:text-3xl font-bold font-sans mt-0.5">
                Merhaba, {profile?.full_name || user?.user_metadata?.full_name || "Değerli Misafirimiz"}
              </h1>
              <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
            </div>
          </div>

          <div className="flex gap-3 z-10 w-full sm:w-auto">
            <Link href="/rezervasyon" className="grow sm:grow-0">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider transition-all hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] cursor-pointer">
                Yeni Rezervasyon Yap
              </button>
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/15 text-white font-bold p-3.5 rounded-2xl border border-white/10 transition-all cursor-pointer"
              title="Çıkış Yap"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 bg-white border border-slate-200/80 shadow-md rounded-3xl p-6 flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Menü</h3>
            
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "upcoming"
                  ? "bg-blue-50 text-blue-700 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass size={18} />
                <span>Gelecek Turlar</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === "upcoming" ? "bg-blue-200 text-blue-800" : "bg-slate-100 text-slate-600"}`}>
                {upcomingBookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("past")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "past"
                  ? "bg-blue-50 text-blue-700 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar size={18} />
                <span>Geçmiş Turlar</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === "past" ? "bg-blue-200 text-blue-800" : "bg-slate-100 text-slate-600"}`}>
                {pastBookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "profile"
                  ? "bg-blue-50 text-blue-700 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <User size={18} />
              <span>Profil Bilgilerim</span>
            </button>
          </div>

          {/* Main content Area */}
          <div className="lg:col-span-9 bg-white border border-slate-200/80 shadow-md rounded-3xl p-6 sm:p-8 min-h-[400px]">
            {activeTab === "upcoming" && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 font-sans flex items-center gap-2">
                  <Compass size={20} className="text-blue-600" />
                  <span>Gelecek Rezervasyonlarınız</span>
                </h2>
                <div className="flex flex-col gap-6">
                  {upcomingBookings.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                      <Compass size={48} className="text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-semibold">Henüz planlanmış bir turunuz bulunmuyor.</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto">Boğazın keyfini çıkarmak için hemen lüks yatlarımızdan birini ayırtın.</p>
                      <Link href="/rezervasyon" className="inline-block mt-5">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase transition-all shadow cursor-pointer">
                          Yatları İncele & Rezervasyon Yap
                        </button>
                      </Link>
                    </div>
                  ) : (
                    upcomingBookings.map((booking) => {
                      const yacht = yachts.find(y => y.slug === booking.yacht_slug);
                      return (
                        <BookingCard key={booking.id} booking={booking} yacht={yacht} statusBadgeColor={getStatusBadgeColor(booking.status)} />
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === "past" && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 font-sans flex items-center gap-2">
                  <Calendar size={20} className="text-blue-600" />
                  <span>Geçmiş Rezervasyonlarınız</span>
                </h2>
                <div className="flex flex-col gap-6">
                  {pastBookings.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                      <Calendar size={48} className="text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-semibold">Geçmiş turlarınız bulunmuyor.</p>
                    </div>
                  ) : (
                    pastBookings.map((booking) => {
                      const yacht = yachts.find(y => y.slug === booking.yacht_slug);
                      return (
                        <BookingCard key={booking.id} booking={booking} yacht={yacht} statusBadgeColor={getStatusBadgeColor(booking.status)} />
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 font-sans flex items-center gap-2">
                  <User size={20} className="text-blue-600" />
                  <span>Profil Bilgilerim</span>
                </h2>

                {profileMessage && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-2xl text-sm mb-6 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-blue-500" />
                    <span>{profileMessage}</span>
                  </div>
                )}

                <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 sm:p-8">
                  <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Ad Soyad</label>
                        <div className="relative">
                          <User className="absolute left-4 top-3 text-slate-400" size={18} />
                          <input
                            type="text"
                            required
                            disabled={!isEditingProfile}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 text-slate-800 disabled:text-slate-500 disabled:bg-slate-100 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Telefon</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-3 text-slate-400" size={18} />
                          <input
                            type="tel"
                            required
                            disabled={!isEditingProfile}
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 text-slate-800 disabled:text-slate-500 disabled:bg-slate-100 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 max-w-md">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">E-Posta Adresi</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3 text-slate-400" size={18} />
                        <input
                          type="email"
                          disabled
                          value={user?.email || ""}
                          className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 text-slate-500 rounded-2xl text-sm cursor-not-allowed shadow-sm"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400">E-posta adresi güvenliğiniz için değiştirilemez.</span>
                    </div>

                    <div className="flex gap-3 mt-4 pt-6 border-t border-slate-200/80">
                      {isEditingProfile ? (
                        <div className="flex gap-3">
                          <button
                            key="save-btn"
                            type="submit"
                            disabled={profileSaving}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                          >
                            <Check size={16} />
                            <span>{profileSaving ? "Kaydediliyor..." : "Kaydet"}</span>
                          </button>
                          <button
                            key="cancel-btn"
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsEditingProfile(false);
                              setEditName(profile?.full_name || user?.user_metadata?.full_name || "");
                              setEditPhone(profile?.phone || user?.user_metadata?.phone || "");
                            }}
                            className="bg-white border border-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer hover:bg-slate-50"
                          >
                            İptal
                          </button>
                        </div>
                      ) : (
                        <button
                          key="edit-btn"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsEditingProfile(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                        >
                          <Edit2 size={16} />
                          <span>Bilgileri Düzenle</span>
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}

const timeToNumber = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h + m / 60;
};

const numberToTime = (n: number) => {
  const h = Math.floor(n) % 24;
  const m = Math.round((n - Math.floor(n)) * 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

function BookingCard({ booking, yacht, statusBadgeColor }: { booking: any, yacht: Yacht | undefined, statusBadgeColor: string }) {
  const startTime = booking.start_time || "10:00";
  const endTime = numberToTime(timeToNumber(startTime) + booking.duration);

  return (
    <div className="bg-white border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all rounded-3xl overflow-hidden flex flex-col md:flex-row gap-6 p-5 sm:p-6">
      
      {/* Yacht Preview */}
      <div className="relative w-full md:w-[220px] aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-sm border border-slate-100">
        <Image
          src={yacht ? getYachtImage(yacht.images) : "/yacht_aerial_hero.png"}
          alt={yacht?.name || "Lüks Yat"}
          fill
          className="object-cover"
        />
      </div>

      {/* Booking Details */}
      <div className="flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-slate-800 font-sans">{yacht?.name || "Özel Kiralık Yat"}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadgeColor}`}>
              {booking.status || "Bekliyor"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">{yacht?.length || "Boğaz Tipi"} • {yacht?.capacity || "Lüks"} Kişilik Özel Yat</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 text-slate-600 bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
            {/* Column 1, Row 1 */}
            <div className="flex items-start gap-2">
              <Calendar size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Tarih</span>
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">{formatDate(booking.booking_date)}</span>
              </div>
            </div>
            
            {/* Column 2, Row 1 */}
            <div className="flex items-start gap-2">
              <Users size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Kişi Sayısı</span>
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">{booking.guests} Misafir</span>
              </div>
            </div>

            {/* Column 3, Row 1 */}
            <div className="flex items-start gap-2">
              <CreditCard size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Toplam Tutar</span>
                <span className="text-xs font-bold text-blue-600 whitespace-nowrap">{formatPrice(booking.total_amount)}</span>
              </div>
            </div>

            {/* Column 1, Row 2 (Biniş ve İniş Noktaları) */}
            <div className="flex items-start gap-2 border-t border-slate-200/60 pt-3 sm:border-t sm:border-slate-200/50 sm:pt-3">
              <MapPin size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold leading-none">Biniş ve İniş Noktaları</span>
                <span className="text-xs font-bold text-slate-700 mt-1.5 block">
                  {booking.pickup_point || booking.dropoff_point ? `${booking.pickup_point || "-"} → ${booking.dropoff_point || "-"}` : "Belirtilmedi"}
                </span>
              </div>
            </div>

            {/* Column 2, Row 2 (Biniş / İniş Saati) */}
            <div className="flex items-start gap-2 border-t border-slate-200/60 pt-3 sm:border-t sm:border-slate-200/50 sm:pt-3">
              <Clock size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold leading-none">Biniş / İniş Saati</span>
                <span className="text-xs font-bold text-slate-700 mt-1.5 block whitespace-nowrap">
                  {startTime} - {endTime} ({booking.duration} Saat)
                </span>
              </div>
            </div>

            {/* Column 3, Row 2 - Empty cell to balance the grid layout */}
            <div className="hidden sm:block border-t border-slate-200/60 pt-3 sm:border-t sm:border-slate-200/50 sm:pt-3" />
          </div>
        </div>

        {/* Extras / Notes */}
        {((booking.extras && booking.extras.length > 0) || booking.notes) && (
          <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-4 text-xs text-slate-500">
            {booking.extras && booking.extras.length > 0 && (
              <div>
                <span className="font-semibold text-slate-700">Ekstra Seçenekler:</span>{" "}
                {booking.extras.map((e: any) => e.name).join(", ")}
              </div>
            )}
            {booking.notes && (
              <div>
                <span className="font-semibold text-slate-700">Not:</span> {booking.notes}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
