import React from "react";
import { Accordion } from "../../components/ui/Accordion";
import { FinalCTA } from "../../components/home/FinalCTA";

export default function FAQPage() {
  const faqs = [
    {
      question: "Rezervasyon nasıl iptal edilir veya ertelenir?",
      answer: "Tur tarihinden en geç 7 gün öncesine kadar yapılan iptallerde ön ödemenizin tamamı kesintisiz iade edilir. Son 7 gün içerisindeki ertelemelerde hava muhalefeti yoksa ek ücret yansıtılabilir."
    },
    {
      question: "Hava koşulları olumsuz olursa tur iptal edilir mi?",
      answer: "Boğaz'daki sis, fırtına veya yoğun kar yağışı gibi güvenliği tehlikeye atacak durumlarda turunuz ücretsiz olarak başka bir tarihe ertelenir. Hafif yağmur durumunda yatlarımızın kapalı ısıtmalı salonları sayesinde turlar sorunsuz gerçekleşir."
    },
    {
      question: "Yata dışarıdan yiyecek ve içecek getirebilir miyiz?",
      answer: "Evet, dilerseniz yata dışarıdan kendi yiyecek ve içeceklerinizi getirebilirsiniz. Bu durumda servis ve bardak/tabak temizlik hizmeti için cüzi bir servis bedeli talep edilir."
    },
    {
      question: "Minimum kiralama süresi nedir?",
      answer: "İstanbul Boğazı'nda özel yat kiralama için minimum kiralama süresi genellikle 2 saattir. Adalar turları için ise tam gün (8 saat) kiralama tercih edilmektedir."
    }
  ];

  return (
    <main className="bg-[#021C24] min-h-screen text-white pt-32 pb-12">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 mb-16">
        <div className="text-center max-w-[720px] mx-auto mb-16 flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest text-[#2ED3C6] font-bold">Merak Edilenler</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white leading-tight">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            Boğaz'da yat kiralama süreci, iptal politikaları, yeme-içme seçenekleri ve ödeme koşulları hakkında en çok sorulan soruların yanıtları.
          </p>
        </div>

        <div className="max-w-[800px] mx-auto">
          <Accordion items={faqs} />
        </div>
      </div>

      <FinalCTA />
    </main>
  );
}
