"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

interface BookingDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const toDateValue = (date: Date) =>
  `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`;

const normalizeDate = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const getCalendarCells = (monthDate: Date) => {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const cells: Array<Date | null> = Array((firstDay.getDay() + 6) % 7).fill(null);
  const days = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  for (let day = 1; day <= days; day += 1) cells.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), day));
  return cells;
};

export function BookingDatePicker({ value, onChange, label = "Tarih" }: BookingDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(() => normalizeDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const close = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [isOpen]);

  const selectedLabel = value
    ? new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T00:00:00`))
    : "Tarih seçin";

  return (
    <div ref={wrapperRef} className="relative flex w-full flex-col gap-2">
      <label className="text-[11px] leading-normal uppercase tracking-widest text-slate-500 font-semibold">{label}</label>
      <button
        type="button"
        onClick={() => {
          const selected = value ? new Date(`${value}T00:00:00`) : new Date();
          setMonth(new Date(selected.getFullYear(), selected.getMonth(), 1));
          setIsOpen((current) => !current);
        }}
        className={`w-full h-[56px] rounded-[18px] border px-4 text-left transition-all duration-300 shadow-sm flex items-center justify-between gap-4 ${
          isOpen ? "border-blue-500 bg-white shadow-[0_14px_40px_rgba(37,99,235,0.14)]" : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-white"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white ${value ? "bg-blue-600" : "bg-slate-900"}`}>
            <CalendarDays className="h-4.5 w-4.5" />
          </div>
          <span className={`truncate text-sm font-semibold ${value ? "text-slate-900" : "text-slate-400"}`}>{selectedLabel}</span>
        </div>
        <span className="shrink-0 text-[10px] font-medium text-slate-400">Takvimi aç</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-3 w-full sm:w-[420px]">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_35px_90px_rgba(15,23,42,0.18)]">
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-200/80">Takvim</p>
                  <h3 className="mt-1 text-2xl font-bold capitalize tracking-tight">{new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(month)}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-cyan-100/80">Rezervasyonunuz için uygun günü seçin.</p>
                </div>
                <button type="button" onClick={() => setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))} className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-white/20">
                  Bugün
                </button>
              </div>
              <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100/75">
                {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => <div key={day} className="py-1">{day}</div>)}
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-7 gap-2">
                {getCalendarCells(month).map((day, index) => day ? (
                  <button
                    key={day.toISOString()}
                    type="button"
                    disabled={normalizeDate(day).getTime() < normalizeDate(new Date()).getTime()}
                    onClick={() => { onChange(toDateValue(day)); setIsOpen(false); }}
                    className={`aspect-square rounded-2xl border text-sm font-semibold transition-all flex flex-col items-center justify-center gap-1 ${
                      value === toDateValue(day) ? "border-blue-600 bg-blue-600 text-white shadow-[0_10px_25px_rgba(37,99,235,0.3)] scale-[1.03]" :
                      normalizeDate(day).getTime() < normalizeDate(new Date()).getTime() ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed" :
                      "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <span className="text-base leading-none">{day.getDate()}</span>
                    {value === toDateValue(day) && <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Seçildi</span>}
                  </button>
                ) : <div key={`empty-${index}`} className="aspect-square rounded-2xl" />)}
              </div>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:bg-white hover:text-blue-700">
                  <ChevronLeft className="h-4 w-4" /> Önceki
                </button>
                <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  Sonraki <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
