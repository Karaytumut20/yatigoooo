"use client";
import { useState } from "react";
import { BlogPost } from "../../../types/blog";
import { createBlogPost, updateBlogPost } from "../../../lib/admin-actions";
import { slugifyYacht } from "../../../lib/yacht-slug";
import { Area, Field, Modal } from "../experiences/ExperienceFormModal";

const STOCK_BLOG_IMAGE = "/yacht_aerial_hero.png";

export function BlogFormModal({ initial, onClose, onSuccess }: { initial?: BlogPost|null; onClose:()=>void; onSuccess:()=>void }) {
  const [saving,setSaving]=useState(false); const [error,setError]=useState("");
  const [f,setF]=useState({title:initial?.title||"",slug:initial?.slug||"",excerpt:initial?.excerpt||"",content:initial?.content||"",image:initial?.image||"",category:initial?.category||"Genel",read_time:initial?.readTime||"5 dk",published_at:initial?.date||new Date().toISOString().slice(0,10),show_image:initial?.showImage??true});
  const set=(k:string,v:string|boolean)=>setF({...f,[k]:v});
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setSaving(true);const{show_image,...values}=f;const p={...values,image:values.image.trim()||STOCK_BLOG_IMAGE,slug:slugifyYacht(values.slug||values.title),published_at:new Date(values.published_at).toISOString(),seo:{display_options:{show_image}}};const r=initial?await updateBlogPost(initial.slug,p):await createBlogPost(p);setSaving(false);if(r.success)onSuccess();else setError((r as {error?:{message?:string}}).error?.message||"İşlem başarısız.");};
  return <Modal title={initial?"Yazıyı Düzenle":"Yeni Yazı Ekle"} onClose={onClose}><form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <Field label="Başlık" value={f.title} onChange={v=>set("title",v)} required/><Field label="Slug" value={f.slug} onChange={v=>set("slug",v)}/>
    <Field label="Kategori" value={f.category} onChange={v=>set("category",v)} required/><Field label="Okuma Süresi" value={f.read_time} onChange={v=>set("read_time",v)} required/>
    <Field label="Yayın Tarihi" type="date" value={f.published_at} onChange={v=>set("published_at",v)} required/><Field label="Görsel URL (boşsa stok görsel)" value={f.image} onChange={v=>set("image",v)}/>
    <label className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 cursor-pointer"><input type="checkbox" checked={f.show_image} onChange={e=>set("show_image",e.target.checked)} className="mt-0.5 h-4 w-4 accent-blue-600"/><span><span className="block text-sm font-semibold">Blog görselini göster</span><span className="block text-xs text-slate-500 mt-0.5">Kapatılırsa blog liste ve detay sayfasında görsel gösterilmez.</span></span></label>
    <Area label="Özet" value={f.excerpt} onChange={v=>set("excerpt",v)} className="sm:col-span-2"/><Area label="İçerik (HTML kullanılabilir)" value={f.content} onChange={v=>set("content",v)} className="sm:col-span-2"/>
    {error&&<p className="text-red-600 text-sm sm:col-span-2">{error}</p>}<button disabled={saving} className="sm:col-span-2 bg-blue-600 text-white rounded-xl py-3 font-bold">{saving?"Kaydediliyor...":"Kaydet"}</button>
  </form></Modal>;
}
