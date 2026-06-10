"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Ship, 
  GlassWater, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  ConciergeBell,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If we are on the login page, don't show the sidebar/navbar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Ship, label: "Yatlar", href: "/admin/yachts" },
    { icon: GlassWater, label: "Deneyimler", href: "/admin/experiences" },
    { icon: ConciergeBell, label: "Hizmetler", href: "/admin/services" },
    { icon: BookOpen, label: "Blog Yazıları", href: "/admin/blog" },
    { icon: MessageSquare, label: "Rezervasyonlar", href: "/admin/bookings" },
    { icon: Settings, label: "Site Ayarları", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-50 h-[100dvh] w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin" className="font-sans text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-blue-500">yatigotr</span> Admin
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-blue-600 text-white font-medium" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 pb-8 sm:pb-4 border-t border-slate-800">
          <Link 
            href="/admin/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <LogOut size={20} />
            <span>Çıkış Yap</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-slate-500 hover:text-slate-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800">
              {menuItems.find(i => i.href === pathname)?.label || "Yönetim Paneli"}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-full hidden sm:block">
                Siteye Git ↗
              </button>
            </Link>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-600">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 sm:p-10 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
