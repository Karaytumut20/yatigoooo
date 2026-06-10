"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Ship, Users, CalendarCheck, TrendingUp, ArrowUpRight } from "lucide-react";
import { getBookings, getYachts } from "../../lib/api";

export default function AdminDashboardPage() {
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [yachtCount, setYachtCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [bookings, yachts] = await Promise.all([getBookings(), getYachts()]);
      
      // Temporary mock fallback if bookings is empty
      if (!bookings || bookings.length === 0) {
        setRecentBookings([
          { id: "RES-001", name: "Ahmet Yılmaz", yacht: "SU Royal", date: "12 Haz 2026", status: "Bekliyor", amount: "₺1.200" },
          { id: "RES-002", name: "Zeynep Kaya", yacht: "SU Orion", date: "15 Haz 2026", status: "Onaylandı", amount: "₺800" },
          { id: "RES-003", name: "Caner Türker", yacht: "SU Prestige", date: "18 Haz 2026", status: "Tamamlandı", amount: "₺1.500" },
        ]);
      } else {
        setRecentBookings(bookings.slice(0, 4));
      }
      setYachtCount(yachts.length);
      setLoading(false);
    }
    loadData();
  }, []);
  const stats = [
    { label: "Toplam Rezervasyon", value: recentBookings.length > 0 ? "142" : "0", trend: "+12%", icon: CalendarCheck, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Aktif Yatlar", value: yachtCount.toString(), trend: "0%", icon: Ship, color: "text-teal-600", bg: "bg-teal-100" },
    { label: "Aylık Ziyaretçi", value: "4,250", trend: "+24%", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Aylık Gelir (Tahmini)", value: "₺45.200", trend: "+8%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100" },
  ];

  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Dashboard yükleniyor...</div>;

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                stat.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"
              }`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Son Rezervasyon Talepleri</h3>
            <Link href="/admin/bookings" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Tümünü Gör <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Müşteri</th>
                  <th className="px-6 py-4 font-semibold">Yat</th>
                  <th className="px-6 py-4 font-semibold">Tarih</th>
                  <th className="px-6 py-4 font-semibold">Tutar</th>
                  <th className="px-6 py-4 font-semibold">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentBookings.map((booking, i) => (
                  <tr key={booking.id || i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{booking.id}</td>
                    <td className="px-6 py-4 text-slate-600">{booking.name}</td>
                    <td className="px-6 py-4 text-slate-600">{booking.yacht}</td>
                    <td className="px-6 py-4 text-slate-600">{booking.date}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{booking.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === "Bekliyor" ? "bg-amber-100 text-amber-700" :
                        booking.status === "Onaylandı" ? "bg-blue-100 text-blue-700" :
                        booking.status === "Tamamlandı" ? "bg-emerald-100 text-emerald-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">Hızlı İşlemler</h3>
            <p className="text-blue-100 text-sm mb-6">Yeni bir yat ekleyebilir veya blog yazısı oluşturabilirsiniz.</p>
            <div className="flex flex-col gap-3">
              <Link href="/admin/yachts" className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-all flex items-center justify-between">
                <span>+ Yeni Yat Ekle</span>
                <ArrowUpRight size={16} />
              </Link>
              <Link href="/admin/experiences" className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-all flex items-center justify-between">
                <span>+ Yeni Deneyim Ekle</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
