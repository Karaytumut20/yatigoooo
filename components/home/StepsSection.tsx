import React from "react";

export function StepsSection() {
  const steps = [
    {
      num: "01",
      title: "Yatınızı ve Rotaları Belirleyin",
      desc: "Filomuzdaki özel yatlar arasından kişi sayısı ve bütçenize en uygun olanı anında seçin."
    },
    {
      num: "02",
      title: "Tarih & Ekstra Hizmetleri Seçin",
      desc: "Yemek, canlı müzik, lazer şov gibi deneyiminize seviye atlatacak ek hizmetleri ekleyin."
    },
    {
      num: "03",
      title: "Anında Güvenli Rezervasyon",
      desc: "%50 güvenli ön ödeme yaparak tarih ve saatinizi temsilcilerimizle anında kesinleştirin."
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#021C24]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20">
        <div className="text-center max-w-[720px] mx-auto mb-16 flex flex-col gap-4">
          <h2 className="font-serif text-3xl sm:text-5xl text-white leading-tight">
            3 Adımda Yatınızı Kiralayın
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            İstanbul Boğazı'nın sularında lüks yat turuna çıkmak hiç bu kadar zahmetsiz olmamıştı.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white/5 border border-white/12 rounded-[32px] p-8 backdrop-blur-xl relative">
              <span className="font-serif text-6xl text-[#2ED3C6]/15 font-bold leading-none block mb-6">
                {step.num}
              </span>
              <h3 className="font-serif text-2xl text-white font-medium mb-4">
                {step.title}
              </h3>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
