"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push(redirect);
      }
    });
  }, [router, redirect]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message === "Invalid login credentials" 
          ? "E-posta adresi veya şifre hatalı." 
          : signInError.message
        );
        setLoading(false);
        return;
      }

      router.push(redirect);
      router.refresh();
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

      <div className="bg-white/95 backdrop-blur-md w-full max-w-[460px] rounded-3xl shadow-2xl border border-slate-200/50 p-8 sm:p-10 z-10 transition-all">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="font-sans text-2xl font-bold tracking-tight inline-block mb-3">
            <span className="text-slate-900">Bosphorus </span>
            <span className="text-blue-600 font-light">Yacht</span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-800">Tekrar Hoş Geldiniz</h2>
          <p className="text-sm text-slate-500 mt-2">Yat rezervasyonlarınızı yönetmek ve yeni rezervasyon yapmak için giriş yapın.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm mb-6 animate-pulse">
            <AlertCircle size={18} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 block">E-Posta Adresi</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@bosphorus.com"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">Şifre</label>
              <a href="#" className="text-xs text-blue-600 hover:underline font-semibold">Şifremi Unuttum</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 cursor-pointer"
          >
            <LogIn size={18} />
            <span>{loading ? "Giriş Yapılıyor..." : "Giriş Yap"}</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-8 pt-6 border-t border-slate-100 text-sm text-slate-600">
          Hesabınız yok mu?{" "}
          <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-blue-600 font-bold hover:underline">
            Kayıt Olun
          </Link>
        </div>

      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="bg-slate-900 min-h-screen flex items-center justify-center text-white">
        <p>Yükleniyor...</p>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
