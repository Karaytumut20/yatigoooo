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
    <section className="py-24 sm:py-32 bg-slate-50">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20">
        <div className="text-center max-w-[720px] mx-auto mb-16 flex flex-col gap-4">
          <h2 className="font-sans text-3xl sm:text-5xl text-slate-900 leading-tight font-bold">
            3 Adımda Yatınızı Kiralayın
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            İstanbul Boğazı'nın sularında lüks yat turuna çıkmak hiç bu kadar zahmetsiz olmamıştı.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-8 relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200">
              <span className="font-sans text-6xl text-blue-100 font-bold leading-none block mb-6">
                {step.num}
              </span>
              <h3 className="font-sans text-2xl text-slate-900 font-semibold mb-4">
                {step.title}
              </h3>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
