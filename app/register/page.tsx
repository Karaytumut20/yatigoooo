"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Mail, Lock, User, Phone, CheckCircle, AlertCircle } from "lucide-react";

import { Suspense } from "react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/dashboard";

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push(redirect);
      }
    });
  }, [router, redirect]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phoneNumber,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // Auto login or notify to check email (depending on Supabase setting, but usually we redirect to login / dashboard)
      setTimeout(() => {
        router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      }, 2000);
    } catch (err: any) {
      setError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  };

  return (
    <main className="bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-950 min-h-screen pt-32 pb-24 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white/95 backdrop-blur-md w-full max-w-[480px] rounded-3xl shadow-2xl border border-slate-200/50 p-8 sm:p-10 z-10 transition-all">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="font-sans text-2xl font-bold tracking-tight inline-block mb-3">
            <span className="text-slate-900">Bosphorus </span>
            <span className="text-blue-600 font-light">Yacht</span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-800">Hesap Oluşturun</h2>
          <p className="text-sm text-slate-500 mt-2">Avantajlı yat kiralama teklifleri ve kolay rezervasyon takibi için kaydolun.</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm mb-6">
            <CheckCircle size={18} className="shrink-0 text-green-500" />
            <span>Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm mb-6 animate-pulse">
            <AlertCircle size={18} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 block">Ad Soyad</label>
            <div className="relative">
              <User className="absolute left-4 top-3 text-slate-400" size={18} />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ahmet Yılmaz"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 block">Telefon Numarası</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3 text-slate-400" size={18} />
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="5551234567"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 block">E-Posta Adresi</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmet@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 block">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 Karakter"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 cursor-pointer"
          >
            <span>{loading ? "Hesap Oluşturuluyor..." : "Kayıt Ol"}</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 pt-6 border-t border-slate-100 text-sm text-slate-600">
          Zaten hesabınız var mı?{" "}
          <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-blue-600 font-bold hover:underline">
            Giriş Yapın
          </Link>
        </div>

      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <main className="bg-slate-900 min-h-screen flex items-center justify-center text-white">
        <p>Yükleniyor...</p>
      </main>
    }>
      <RegisterForm />
    </Suspense>
  );
}
