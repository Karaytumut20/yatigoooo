"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { formatPrice, formatDate } from "../../lib/utils";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/Input";
import { Yacht } from "../../types/yacht";
import { Experience } from "../../types/experience";
import { createBooking } from "../../lib/api";
import { getYachtImage } from "../../lib/yacht-images";
import { Service } from "../../types/service";
import { supabase } from "../../lib/supabase";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

export default function BookingClient({ 
  yachts, 
  experiences, 
  services,
  initialYachtSlug,
  initialExperienceSlug,
  initialDate,
  initialGuests
}: { 
  yachts: Yacht[], 
  experiences: Experience[], 
  services: Service[],
  initialYachtSlug?: string,
  initialExperienceSlug?: string,
  initialDate?: string,
  initialGuests?: string
}) {
  const hasInitialYacht = Boolean(initialYachtSlug && yachts.some(yacht => yacht.slug === initialYachtSlug));
  const [step, setStep] = useState(hasInitialYacht ? 2 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState<number>(-1);
  const [step2Error, setStep2Error] = useState("");
  const [step1Error, setStep1Error] = useState("");
  const [showDurationWarning, setShowDurationWarning] = useState(false);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "capacity-asc" | "capacity-desc" | "default">("default");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const initialMonth = new Date();
    initialMonth.setDate(1);
    initialMonth.setHours(0, 0, 0, 0);
    return initialMonth;
  });
  const datePickerRef = useRef<HTMLDivElement>(null);
  const maxCapacityLimit = yachts.length > 0 ? Math.max(...yachts.map(y => y.capacity || 0)) : 50;
  const maxPriceLimit = yachts.length > 0 ? Math.max(...yachts.map(y => y.hourlyPrice || 0)) : 100000;

  const [yachtFilter, setYachtFilter] = useState(() => ({
    minPrice: 0,
    maxPrice: yachts.length > 0 ? Math.max(...yachts.map(y => y.hourlyPrice || 0)) : 100000,
    minCapacity: 1
  }));
  
  // Hours for selection including 15-minute intervals
  const HOURS = Array.from({ length: (24 - 8) * 4 }, (_, i) => {
    const h = Math.floor(i / 4) + 8;
    const m = (i % 4) * 15;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  });
  const [startTime, setStartTime] = useState("10:00");

  const timeToNumber = (t: string) => {
    if (!t) return 0;
    const cleanT = t.replace(/\s*\(\+1\)/g, "");
    const [h, m] = cleanT.split(":").map(Number);
    const isTomorrow = t.includes("(+1)");
    return (h + m / 60) + (isTomorrow ? 24 : 0);
  };

  const numberToTime = (n: number) => {
    const h = Math.floor(n) % 24;
    const m = Math.round((n - Math.floor(n)) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const toDateInputValue = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const normalizeDate = (date: Date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const isPastDate = (date: Date) => {
    const today = normalizeDate(new Date());
    return normalizeDate(date).getTime() < today.getTime();
  };

  const isTodaySelected = () => {
    if (!bookingDetails.date) return false;
    const todayStr = toDateInputValue(new Date());
    return bookingDetails.date === todayStr;
  };

  const isHourPast = (hour: string) => {
    if (!isTodaySelected()) return false;
    const now = new Date();
    const currentHourDecimal = now.getHours() + now.getMinutes() / 60;
    return timeToNumber(hour) < currentHourDecimal;
  };

  const formatSelectedDate = (dateValue: string) => {
    if (!dateValue) return "Tarih seçin";
    const parsedDate = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) return "Tarih seçin";

    return new Intl.DateTimeFormat("tr-TR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(parsedDate);
  };

  const getCalendarCells = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<Date | null> = [];

    for (let index = 0; index < startOffset; index += 1) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(year, month, day));
    }

    return cells;
  };

  const getMonthLabel = (date: Date) =>
    new Intl.DateTimeFormat("tr-TR", {
      month: "long",
      year: "numeric",
    }).format(date);

  const handleDateSelect = (date: Date) => {
    if (isPastDate(date)) return;
    setBookingDetails(prev => ({ ...prev, date: toDateInputValue(date) }));
    setIsDatePickerOpen(false);
  };

  const resolvedInitialYachtSlug = hasInitialYacht && initialYachtSlug
    ? initialYachtSlug
    : "";
  const initialYacht = yachts.find(yacht => yacht.slug === resolvedInitialYachtSlug);

  const [bookingDetails, setBookingDetails] = useState({
    yachtSlug: resolvedInitialYachtSlug,
    experienceSlug: initialExperienceSlug || (experiences.some(e => e.slug === "saatlik-yat-turu") ? "saatlik-yat-turu" : (experiences[0]?.slug || "")),
    date: initialDate || toDateInputValue(new Date()),
    duration: 2,
    guests: initialGuests ? (parseInt(initialGuests, 10) || 4) : 4,
    pickupPoint: initialYacht?.pickupPoints?.[0]?.name || "",
    dropoffPoint: initialYacht?.dropoffPoints?.[0]?.name || "",
    selectedServiceIds: [] as string[],
    extraGuestPackageIndex: undefined as number | undefined
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // Load user session and register auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const fullName = session.user.user_metadata?.full_name || "";
        const parts = fullName.split(" ");
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ") || "";
        
        setValue("firstName", firstName);
        setValue("lastName", lastName);
        setValue("email", session.user.email || "");
        setValue("phone", session.user.user_metadata?.phone || "");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setValue]);

  useEffect(() => {
    if (bookingDetails.date) {
      const selectedDate = new Date(`${bookingDetails.date}T00:00:00`);
      if (!Number.isNaN(selectedDate.getTime())) {
        selectedDate.setDate(1);
        selectedDate.setHours(0, 0, 0, 0);
        setCalendarMonth(selectedDate);
      }
    }
  }, [bookingDetails.date]);

  // Fetch bookings for selected yacht and date to prevent overlaps
  useEffect(() => {
    if (!bookingDetails.yachtSlug || !bookingDetails.date) {
      setExistingBookings([]);
      return;
    }

    const fetchBookings = async () => {
      try {
        const getRelativeDateStr = (dateStr: string, offsetDays: number) => {
          const d = new Date(`${dateStr}T00:00:00`);
          d.setDate(d.getDate() + offsetDays);
          return toDateInputValue(d);
        };

        const yesterdayStr = getRelativeDateStr(bookingDetails.date, -1);
        const tomorrowStr = getRelativeDateStr(bookingDetails.date, 1);

        // Fetch yesterday, today, and tomorrow bookings in parallel
        const [yesterdayRes, todayRes, tomorrowRes] = await Promise.all([
          supabase.rpc("get_occupied_slots", {
            p_yacht_slug: bookingDetails.yachtSlug,
            p_booking_date: yesterdayStr
          }),
          supabase.rpc("get_occupied_slots", {
            p_yacht_slug: bookingDetails.yachtSlug,
            p_booking_date: bookingDetails.date
          }),
          supabase.rpc("get_occupied_slots", {
            p_yacht_slug: bookingDetails.yachtSlug,
            p_booking_date: tomorrowStr
          })
        ]);

        if (yesterdayRes.error) console.error("Yesterday fetch error:", yesterdayRes.error);
        if (todayRes.error) console.error("Today fetch error:", todayRes.error);
        if (tomorrowRes.error) console.error("Tomorrow fetch error:", tomorrowRes.error);

        const yesterdayBookings = (yesterdayRes.data || []).map((b: any) => ({
          ...b,
          dayOffset: -1
        }));
        const todayBookings = (todayRes.data || []).map((b: any) => ({
          ...b,
          dayOffset: 0
        }));
        const tomorrowBookings = (tomorrowRes.data || []).map((b: any) => ({
          ...b,
          dayOffset: 1
        }));

        setExistingBookings([...yesterdayBookings, ...todayBookings, ...tomorrowBookings]);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [bookingDetails.yachtSlug, bookingDetails.date]);

  const isSlotBooked = (hour: string) => {
    const hourVal = timeToNumber(hour);
    return existingBookings.some((booking) => {
      if (!booking.start_time || !booking.duration) return false;
      const bStart = timeToNumber(booking.start_time) + (booking.dayOffset || 0) * 24;
      const bEnd = bStart + booking.duration;
      return hourVal >= bStart && hourVal <= bEnd;
    });
  };

  const isSlotCleaning = (hour: string) => {
    const hourVal = timeToNumber(hour);
    return existingBookings.some((booking) => {
      if (!booking.start_time || !booking.duration) return false;
      const bStart = timeToNumber(booking.start_time) + (booking.dayOffset || 0) * 24;
      const bEnd = bStart + booking.duration;
      // Rezervasyonun 15 dakika öncesi ve 15 dakika sonrası temizlik saatidir
      return Math.abs(hourVal - (bStart - 0.25)) < 0.01 || Math.abs(hourVal - (bEnd + 0.25)) < 0.01;
    });
  };

  const isSlotSelectable = (hour: string) => {
    if (isHourPast(hour)) return false;
    if (isSlotBooked(hour)) return false;
    if (isSlotCleaning(hour)) return false;

    const slotVal = timeToNumber(hour);
    let nextBookingStart = 48; // 2 gün boyunca
    existingBookings.forEach((b) => {
      if (!b.start_time || !b.duration) return;
      const bStart = timeToNumber(b.start_time) + (b.dayOffset || 0) * 24;
      if (bStart >= slotVal && bStart < nextBookingStart) {
        nextBookingStart = bStart;
      }
    });

    const requiredGap = nextBookingStart === 48 ? bookingDetails.duration : bookingDetails.duration + 0.5;
    return (nextBookingStart - slotVal) >= requiredGap;
  };

  const hasOverlap = (start: string, duration: number) => {
    const startVal = timeToNumber(start);
    const endVal = startVal + duration;

    return existingBookings.some((booking) => {
      if (!booking.start_time || !booking.duration) return false;
      const bStart = timeToNumber(booking.start_time) + (booking.dayOffset || 0) * 24;
      const bEnd = bStart + booking.duration;
      // İki rezervasyon arasında en az 30 dk (0.5 saat) boşluk olmalı (giriş-çıkış temizlik payları)
      return startVal < bEnd + 0.5 && endVal + 0.5 > bStart;
    });
  };

  // Seçilen zaman geçersiz veya dolu ise otomatik olarak ilk uygun slota yerleştir
  useEffect(() => {
    if (!isSlotSelectable(startTime)) {
      const firstAvailable = HOURS.find(h => isSlotSelectable(h));
      if (firstAvailable) {
        setStartTime(firstAvailable);
      }
    }
  }, [bookingDetails.date, existingBookings, startTime, bookingDetails.duration]);

  // Seçilen başlangıç saatinden sonraki ilk rezervasyonu bularak maksimum süreyi hesapla
  const getMaxDuration = () => {
    const startVal = timeToNumber(startTime);
    let minNextStartVal = 48; // 2 gün boyunca

    existingBookings.forEach((booking) => {
      if (!booking.start_time || !booking.duration) return;
      const bStart = timeToNumber(booking.start_time) + (booking.dayOffset || 0) * 24;
      if (bStart >= startVal) {
        if (bStart < minNextStartVal) {
          minNextStartVal = bStart;
        }
      }
    });

    const gap = minNextStartVal === 48 ? 0 : 0.5;
    const maxAllowed = Math.floor(minNextStartVal - startVal - gap);
    return Math.min(12, Math.max(2, maxAllowed));
  };

  const maxAllowedDuration = getMaxDuration();

  // Süre seçimi maksimum limiti aşarsa otomatik olarak maksimuma çek ve uyarı popup'ı göster
  useEffect(() => {
    if (bookingDetails.duration > maxAllowedDuration) {
      setShowDurationWarning(true);
      setBookingDetails(prev => ({ ...prev, duration: maxAllowedDuration }));
    }
  }, [maxAllowedDuration, bookingDetails.duration]);

  const getDisplayHours = () => {
    const list = [...HOURS];
    const startVal = timeToNumber(startTime);
    const endVal = startVal + bookingDetails.duration;
    if (endVal > 24) {
      const extraSlotsCount = Math.ceil((endVal - 24) * 4);
      for (let i = 0; i <= extraSlotsCount; i++) {
        const val = 24 + i * 0.25;
        if (val > endVal) break;
        const h = Math.floor(val) % 24;
        const m = Math.round((val - Math.floor(val)) * 60);
        const hourStr = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
        const displayStr = `${hourStr} (+1)`;
        if (!list.includes(displayStr)) {
          list.push(displayStr);
        }
      }
    }
    return list;
  };

  useEffect(() => {
    if (!isDatePickerOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isDatePickerOpen]);

  const handleYachtChange = (val: string) => {
    const yacht = yachts.find(item => item.slug === val);
    setBookingDetails(prev => ({ 
      ...prev, 
      yachtSlug: val,
      pickupPoint: yacht?.pickupPoints?.[0]?.name || "",
      dropoffPoint: yacht?.dropoffPoints?.[0]?.name || "",
      extraGuestPackageIndex: undefined // Yat değişince ekstra paket seçimini sıfırla
    }));
    setSelectedPackageIndex(-1); // Reset package when yacht changes
    setStep1Error(""); // Yat seçildiğinde hatayı temizle
  };

  const handleServiceToggle = (id: string) => {
    setBookingDetails(prev => ({
      ...prev,
      selectedServiceIds: prev.selectedServiceIds.includes(id)
        ? prev.selectedServiceIds.filter((serviceId) => serviceId !== id)
        : [...prev.selectedServiceIds, id]
    }));
  };

  const filteredYachts = yachts.filter(y => {
    const matchesFilters = y.hourlyPrice >= yachtFilter.minPrice &&
      y.hourlyPrice <= yachtFilter.maxPrice &&
      y.capacity >= yachtFilter.minCapacity;
      
    const matchesExperience = !bookingDetails.experienceSlug || 
      bookingDetails.experienceSlug === "saatlik-yat-turu" ||
      !y.experienceSlugs || 
      y.experienceSlugs.length === 0 || 
      y.experienceSlugs.includes(bookingDetails.experienceSlug);
      
    return matchesFilters && matchesExperience;
  });

  const sortedYachts = [...filteredYachts].sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.hourlyPrice - b.hourlyPrice;
    }
    if (sortBy === "price-desc") {
      return b.hourlyPrice - a.hourlyPrice;
    }
    if (sortBy === "capacity-asc") {
      return a.capacity - b.capacity;
    }
    if (sortBy === "capacity-desc") {
      return b.capacity - a.capacity;
    }
    return 0;
  });

  // Filtreler değişince seçili yatın listede kalıp kalmadığını kontrol et, kalmadıysa seçimi temizle
  useEffect(() => {
    if (bookingDetails.yachtSlug && !filteredYachts.some(y => y.slug === bookingDetails.yachtSlug)) {
      setBookingDetails(prev => ({ ...prev, yachtSlug: "" }));
    }
  }, [yachtFilter, filteredYachts, bookingDetails.yachtSlug]);

  const selectedYacht = yachts.find(y => y.slug === bookingDetails.yachtSlug);
  const selectedExp = experiences.find(e => e.slug === bookingDetails.experienceSlug) || experiences[0];
  const extraGuestPricing = selectedYacht?.extraGuestPricing || [];
  const pickupPoints = selectedYacht?.pickupPoints || [];
  const dropoffPoints = selectedYacht?.dropoffPoints || [];
  const selectedPickupPoint = pickupPoints.find(point => point.name === bookingDetails.pickupPoint);
  const selectedDropoffPoint = dropoffPoints.find(point => point.name === bookingDetails.dropoffPoint);
  const transferPointCost = (selectedPickupPoint?.price || 0) + (selectedDropoffPoint?.price || 0);
  const extraGuests = Math.max(bookingDetails.guests - (selectedYacht?.capacity || 0), 0);
  const isOverCapacity = extraGuests > 0;

  const getExtraGuestValidationError = () => {
    if (!selectedYacht || !isOverCapacity) return "";

    if (extraGuestPricing.length === 0) {
      return "Bu yat için kapasite aşıldı, ancak ekstra misafir paketi tanımlı değil.";
    }

    if (bookingDetails.extraGuestPackageIndex === undefined || bookingDetails.extraGuestPackageIndex < 0) {
      return "Kapasite aşıldı! Lütfen ekstra misafir paketi seçiniz.";
    }

    const selectedRule = extraGuestPricing[bookingDetails.extraGuestPackageIndex];
    if (!selectedRule) {
      return "Seçtiğiniz paket geçersiz. Lütfen uygun paket seçiniz.";
    }

    if (extraGuests < selectedRule.min_guests || extraGuests > selectedRule.max_guests) {
      return "Seçtiğiniz paket misafir sayınız için uygun değil. Lütfen uygun paket seçiniz.";
    }

    return "";
  };

  const getExtraGuestCost = () => {
    if (!selectedYacht) return 0;
    const extraGuests = bookingDetails.guests - selectedYacht.capacity;
    if (extraGuests <= 0) return 0;
    
    // Eğer kullanıcı paket seçtiyse, o paketi kullan
    if (bookingDetails.extraGuestPackageIndex !== undefined && bookingDetails.extraGuestPackageIndex >= 0) {
      const selectedRule = selectedYacht.extraGuestPricing?.[bookingDetails.extraGuestPackageIndex];
      return selectedRule ? selectedRule.price : 0;
    }
    
    // Yoksa otomatik eşleşen kuralı bul (backward compatibility)
    const rules = selectedYacht.extraGuestPricing || [];
    const rule = rules.find((r: any) => extraGuests >= r.min_guests && extraGuests <= r.max_guests);
    return rule ? rule.price : 0;
  };

  const calculateTotal = () => {
    if (!selectedYacht) return 0;
    let cost = 0;
    if (selectedPackageIndex !== -1 && selectedYacht.packages?.[selectedPackageIndex]) {
      cost = Number(selectedYacht.packages[selectedPackageIndex].price) || 0;
    } else {
      cost = selectedYacht.hourlyPrice * bookingDetails.duration;
    }
    services
      .filter((service) => bookingDetails.selectedServiceIds.includes(service.id))
      .forEach((service) => {
        cost += service.priceType === "per_person"
          ? service.price * bookingDetails.guests
          : service.price;
      });
    cost += getExtraGuestCost();
    cost += transferPointCost;
    return cost;
  };

  const nextStep = () => {
    if (step === 1) {
      if (!bookingDetails.yachtSlug) {
        setStep1Error("Lütfen kiralayacağınız yatı seçiniz.");
        return;
      }
      const isSelectedYachtVisible = filteredYachts.some(y => y.slug === bookingDetails.yachtSlug);
      if (!isSelectedYachtVisible) {
        setStep1Error("Seçili yatınız filtreleme kriterlerinize uymuyor. Lütfen listeden uygun bir yat seçiniz.");
        return;
      }
      setStep1Error("");
    }
    if (step === 2) {
      if (!bookingDetails.date) {
        setStep2Error("Lütfen tur tarihini giriniz.");
        return;
      }
      if (!bookingDetails.guests || bookingDetails.guests < 1) {
        setStep2Error("Lütfen geçerli bir misafir sayısı giriniz.");
        return;
      }
      if (!bookingDetails.duration || bookingDetails.duration < 2) {
        setStep2Error("Lütfen kiralama süresini minimum 2 saat olarak ayarlayınız.");
        return;
      }
      if (pickupPoints.length > 0 && !selectedPickupPoint) {
        setStep2Error("Lütfen biniş noktasını seçiniz.");
        return;
      }
      if (dropoffPoints.length > 0 && !selectedDropoffPoint) {
        setStep2Error("Lütfen iniş noktasını seçiniz.");
        return;
      }
      const extraGuestError = getExtraGuestValidationError();
      if (extraGuestError) {
        setStep2Error(extraGuestError);
        return;
      }

      if (hasOverlap(startTime, bookingDetails.duration)) {
        setStep2Error("Seçtiğiniz saat aralığı başka bir rezervasyon ile çakışmaktadır. Lütfen kırmızı ile işaretlenmemiş saatleri seçiniz.");
        return;
      }
      
      setStep2Error("");
    }
    setStep(prev => Math.min(prev + 1, 6));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmissionError("");

    const extraGuestError = getExtraGuestValidationError();
    if (extraGuestError) {
      setIsSubmitting(false);
      setSubmissionError(extraGuestError);
      return;
    }

    if (hasOverlap(startTime, bookingDetails.duration)) {
      setIsSubmitting(false);
      setSubmissionError("Seçtiğiniz saat aralığı başka bir rezervasyon ile çakışmaktadır. Lütfen kırmızı ile işaretlenmemiş saatleri seçiniz.");
      return;
    }
    
    // Save to Supabase
    const bookingRecord = {
      customer_name: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      email: data.email,
      yacht_slug: bookingDetails.yachtSlug,
      experience_slug: bookingDetails.experienceSlug,
      booking_date: bookingDetails.date || new Date().toISOString().split('T')[0],
      start_time: startTime,
      user_id: user?.id || null,
      duration: bookingDetails.duration,
      guests: bookingDetails.guests,
      pickup_point: bookingDetails.pickupPoint || null,
      dropoff_point: bookingDetails.dropoffPoint || null,
      pickup_fee: selectedPickupPoint?.price || 0,
      dropoff_fee: selectedDropoffPoint?.price || 0,
      total_amount: calculateTotal(),
      status: "Bekliyor",
      notes: (data.notes || "") + (selectedPackageIndex !== -1 ? ` (Paket Seçimi: ${selectedYacht?.packages?.[selectedPackageIndex]?.title})` : ""),
      extras: services
        .filter((service) => bookingDetails.selectedServiceIds.includes(service.id))
        .map((service) => ({
          id: service.id,
          name: service.name,
          price: service.price,
          price_type: service.priceType,
          quantity: service.priceType === "per_person" ? bookingDetails.guests : 1,
        })),
    };

    const result = await createBooking(bookingRecord);
    setIsSubmitting(false);
    if (result.success) setIsSuccess(true);
    else setSubmissionError("Rezervasyon kaydedilemedi. Lütfen tekrar deneyin.");
  };

  if (isSuccess) {
    return (
      <main className="bg-slate-50 min-h-screen pt-32 pb-12 flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md text-center border border-slate-200">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Talebiniz Alındı!</h2>
          <p className="text-slate-600 mb-8">Rezervasyon talebiniz başarıyla oluşturuldu. Müşteri temsilcimiz en kısa sürede sizinle iletişime geçecektir.</p>
          <button onClick={() => window.location.href = "/"} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Ana Sayfaya Dön</button>
        </div>
      </main>
    );
  }

  const currentYacht = selectedYacht || yachts[0];
  const total = calculateTotal();
  const prepayment = Math.round(total * 0.5);
  const selectedServices = services.filter(service => bookingDetails.selectedServiceIds.includes(service.id));

  const bookingSummary = (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col gap-5 shadow-sm">
      <div className="grid grid-cols-[96px_1fr] sm:grid-cols-[150px_1fr] gap-4 items-center">
        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100">
          <Image src={getYachtImage(currentYacht.images)} alt={currentYacht.name} fill className="object-cover" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">Seçtiğiniz yat</p>
          <h3 className="font-sans text-xl sm:text-2xl text-slate-900 font-bold">{currentYacht.name}</h3>
          <span className="text-xs text-slate-500">{currentYacht.length} • {currentYacht.capacity} Kişi Kapasite</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3"><span className="block text-xs text-slate-500">Tarih</span><strong>{bookingDetails.date ? formatDate(bookingDetails.date) : "Seçilmedi"}</strong></div>
        <div className="rounded-xl bg-slate-50 p-3"><span className="block text-xs text-slate-500">Saat</span><strong>{startTime} - {numberToTime(timeToNumber(startTime) + bookingDetails.duration)}</strong></div>
        <div className="rounded-xl bg-slate-50 p-3"><span className="block text-xs text-slate-500">Süre</span><strong>{bookingDetails.duration} Saat</strong></div>
        <div className="rounded-xl bg-slate-50 p-3"><span className="block text-xs text-slate-500">Misafir</span><strong>{bookingDetails.guests} Kişi</strong></div>
      </div>
      {(bookingDetails.pickupPoint || bookingDetails.dropoffPoint) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {bookingDetails.pickupPoint && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
              <span className="block text-xs text-blue-600">Biniş Noktası</span>
              <strong className="text-slate-800">{bookingDetails.pickupPoint}</strong>
              {!!selectedPickupPoint?.price && <span className="block text-xs text-slate-500">+{formatPrice(selectedPickupPoint.price)}</span>}
            </div>
          )}
          {bookingDetails.dropoffPoint && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
              <span className="block text-xs text-blue-600">İniş Noktası</span>
              <strong className="text-slate-800">{bookingDetails.dropoffPoint}</strong>
              {!!selectedDropoffPoint?.price && <span className="block text-xs text-slate-500">+{formatPrice(selectedDropoffPoint.price)}</span>}
            </div>
          )}
        </div>
      )}
      {selectedServices.length > 0 && (
        <div className="border-t border-slate-100 pt-4">
          <span className="text-xs font-bold text-slate-500">Ek hizmetler</span>
          <p className="mt-1 text-sm text-slate-700">{selectedServices.map(service => service.name).join(", ")}</p>
        </div>
      )}
      <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <span className="text-sm font-semibold text-slate-600">Toplam Tutar</span>
          <strong className="text-blue-600 text-2xl font-bold">{formatPrice(total)}</strong>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-xs font-medium text-slate-400">%50 Ön Ödeme</span>
          <strong className="text-slate-800 text-lg font-bold">{formatPrice(prepayment)}</strong>
        </div>
      </div>
    </div>
  );

  return (
    <main className="bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-3 sm:px-8 lg:px-12">
        
        {/* Left main form wrapper */}
        <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-4 sm:p-10">
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
            <h1 className="font-sans text-2xl sm:text-3xl text-slate-900 font-bold">Yat Kiralama Rezervasyonu</h1>
            <span className="shrink-0 whitespace-nowrap text-xs font-bold text-blue-600 uppercase tracking-wider">Adım {step} / 6</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Step 1: Yacht Selection */}
            {step === 1 && (
              <div className="flex flex-col gap-6">
                {step1Error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3.5 rounded-2xl text-xs font-bold font-sans">
                    {step1Error}
                  </div>
                )}
                {/* Compact Filtreleme Bölümü */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:py-3 sm:px-4">
                  <div className="flex flex-col gap-3 w-full sm:flex-row sm:items-center sm:w-auto">
                    {/* Header: Filtrele ve Sıfırla */}
                    <div className="flex items-center justify-between sm:justify-start">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Yatları Filtrele
                      </span>
                      {/* Mobilde sıfırla butonu en üst sağda */}
                      <button
                        type="button"
                        onClick={() => {
                          setYachtFilter({ minPrice: 0, maxPrice: maxPriceLimit, minCapacity: 1 });
                          setSortBy("default");
                          setBookingDetails(prev => ({ ...prev, experienceSlug: initialExperienceSlug || experiences[0]?.slug || "" }));
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer sm:hidden"
                      >
                        Sıfırla
                      </button>
                    </div>

                    {/* Kapasite, Fiyat ve Deneyim - Mobilde alt alta veya yan yana */}
                    <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-3 sm:w-auto">
                      {/* Deneyim Dropdown */}
                      <div className="relative w-full sm:w-48">
                        <select
                          value={bookingDetails.experienceSlug}
                          onChange={(e) => setBookingDetails(prev => ({ ...prev, experienceSlug: e.target.value }))}
                          className="appearance-none w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 sm:py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="">Tüm Deneyimler</option>
                          {experiences.map((exp) => (
                            <option key={exp.slug} value={exp.slug}>
                              {exp.title}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {/* Kapasite Dropdown */}
                      <div className="relative w-full sm:w-36">
                        <select
                          value={yachtFilter.minCapacity}
                          onChange={(e) => setYachtFilter(prev => ({ ...prev, minCapacity: parseInt(e.target.value) || 1 }))}
                          className="appearance-none w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 sm:py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="1">Kapasite: Tümü</option>
                          <option value="5">Min. 5 Kişi</option>
                          <option value="10">Min. 10 Kişi</option>
                          <option value="15">Min. 15 Kişi</option>
                          <option value="20">Min. 20 Kişi</option>
                          <option value="30">Min. 30 Kişi</option>
                          <option value="40">Min. 40 Kişi</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {/* Fiyat Dropdown */}
                      <div className="relative w-full sm:w-40">
                        <select
                          value={yachtFilter.maxPrice}
                          onChange={(e) => setYachtFilter(prev => ({ ...prev, maxPrice: parseInt(e.target.value) || 0 }))}
                          className="appearance-none w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 sm:py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value={maxPriceLimit}>Fiyat: Tümü</option>
                          <option value="3000">Maks. 3.000 TL</option>
                          <option value="5000">Maks. 5.000 TL</option>
                          <option value="7500">Maks. 7.500 TL</option>
                          <option value="10000">Maks. 10.000 TL</option>
                          <option value="15000">Maks. 15.000 TL</option>
                          <option value="20000">Maks. 20.000 TL</option>
                          <option value="30000">Maks. 30.000 TL</option>
                          <option value="50000">Maks. 50.000 TL</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Sıralama Dropdown */}
                    <div className="relative w-full sm:w-auto">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="appearance-none w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 sm:py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="default">Sırala: Varsayılan</option>
                        <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                        <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                        <option value="capacity-asc">Kapasite: Düşükten Yükseğe</option>
                        <option value="capacity-desc">Kapasite: Yüksekten Düşüğe</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Masaüstünde sıfırla butonu en sağda */}
                  <button
                    type="button"
                    onClick={() => {
                      setYachtFilter({ minPrice: 0, maxPrice: maxPriceLimit, minCapacity: 1 });
                      setSortBy("default");
                      setBookingDetails(prev => ({ ...prev, experienceSlug: initialExperienceSlug || experiences[0]?.slug || "" }));
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer hidden sm:block"
                  >
                    Filtreleri Sıfırla
                  </button>
                </div>

                {/* Yatlar Grid - Mobilde Horizontal Scroll */}
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {sortedYachts.map((y) => {
                    const isSelected = bookingDetails.yachtSlug === y.slug;
                    return (
                      <div
                        key={y.slug}
                        onClick={() => handleYachtChange(y.slug)}
                        className={`group cursor-pointer rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/30 shadow-md ring-2 ring-blue-600/20"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg"
                        }`}
                      >
                        {/* Yacht Image */}
                        <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                          <Image
                            src={getYachtImage(y.images)}
                            alt={y.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          
                          {/* Selection Check Circle Overlay */}
                          <div className="absolute top-3 right-3 z-10">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                              isSelected
                                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                : "bg-white/80 border-slate-300 text-transparent"
                            }`}>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>

                          {/* Hourly Price Tag */}
                          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-white font-bold text-xs">
                            {formatPrice(y.hourlyPrice)} <span className="font-normal text-[10px] text-slate-300">/ Saat</span>
                          </div>
                        </div>

                        {/* Yacht Details */}
                        <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                          <div>
                            <h3 className="text-slate-900 font-bold text-base group-hover:text-blue-600 transition-colors">
                              {y.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                            <span className="bg-slate-100 px-2 py-1 rounded">
                              {y.length}
                            </span>
                            <span className="bg-slate-100 px-2 py-1 rounded">
                              Max {y.capacity} Kişi
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredYachts.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <p className="text-slate-500 text-sm">Seçtiğiniz filtrelere uygun yat bulunamadı.</p>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Date & duration */}
            {step === 2 && (
              <div className="flex flex-col gap-6">
                {step2Error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3.5 rounded-2xl text-xs font-bold font-sans">
                    {step2Error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 relative" ref={datePickerRef}>
                    <label className="text-xs font-semibold text-slate-700">Tur Tarihi</label>
                    <button
                      type="button"
                      onClick={() => {
                        const baseDate = bookingDetails.date
                          ? new Date(`${bookingDetails.date}T00:00:00`)
                          : new Date();
                        if (!Number.isNaN(baseDate.getTime())) {
                          baseDate.setDate(1);
                          baseDate.setHours(0, 0, 0, 0);
                          setCalendarMonth(baseDate);
                        }
                        setIsDatePickerOpen(prev => !prev);
                      }}
                      className={`w-full h-[56px] rounded-[18px] border px-4 text-left transition-all duration-300 shadow-sm flex items-center justify-between gap-4 ${
                        isDatePickerOpen
                          ? "border-blue-500 bg-white shadow-[0_14px_40px_rgba(37,99,235,0.14)]"
                          : bookingDetails.date
                            ? "border-slate-300 bg-slate-50 hover:border-blue-300 hover:bg-white"
                            : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-white"
                      }`}
                      aria-expanded={isDatePickerOpen}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          bookingDetails.date ? "bg-blue-600 text-white" : "bg-slate-900 text-white"
                        }`}>
                          <CalendarDays className="w-4.5 h-4.5" />
                        </div>
                        <div className="min-w-0">
                          <div className={`text-sm font-semibold truncate leading-none ${bookingDetails.date ? "text-slate-900" : "text-slate-400"}`}>
                            {formatSelectedDate(bookingDetails.date)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 shrink-0">
                        <span className="text-[10px] font-medium hidden sm:inline">Takvimi aç</span>
                        <svg className={`w-4 h-4 transition-transform duration-300 ${isDatePickerOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {isDatePickerOpen && (
                      <div className="absolute left-0 top-full z-40 mt-3 w-full sm:w-[420px]">
                        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_35px_90px_rgba(15,23,42,0.18)]">
                          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-200/80 font-semibold">Takvim</p>
                                <h3 className="mt-1 text-2xl font-bold tracking-tight">{getMonthLabel(calendarMonth)}</h3>
                                <p className="mt-2 text-xs text-cyan-100/80 leading-relaxed">Rezervasyonunuz için uygun günü seçin.</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const today = new Date();
                                  today.setDate(1);
                                  today.setHours(0, 0, 0, 0);
                                  setCalendarMonth(today);
                                }}
                                className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-white/20 transition-colors"
                              >
                                Bugün
                              </button>
                            </div>

                            <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100/75">
                              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((label) => (
                                <div key={label} className="py-1">{label}</div>
                              ))}
                            </div>
                          </div>

                          <div className="p-4 sm:p-5">
                            <div className="grid grid-cols-7 gap-2">
                              {getCalendarCells(calendarMonth).map((day, index) => {
                                if (!day) {
                                  return <div key={`empty-${index}`} className="aspect-square rounded-2xl" />;
                                }

                                const isSelected = bookingDetails.date === toDateInputValue(day);
                                const isDisabled = isPastDate(day);

                                return (
                                  <button
                                    key={day.toISOString()}
                                    type="button"
                                    onClick={() => handleDateSelect(day)}
                                    disabled={isDisabled}
                                    className={`aspect-square rounded-2xl border text-sm font-semibold transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                                      isSelected
                                        ? "border-blue-600 bg-blue-600 text-white shadow-[0_10px_25px_rgba(37,99,235,0.3)] scale-[1.03]"
                                        : isDisabled
                                          ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
                                    }`}
                                  >
                                    <span className="text-base leading-none">{day.getDate()}</span>
                                    {isSelected && <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Seçildi</span>}
                                  </button>
                                );
                              })}
                            </div>

                            <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                              <button
                                type="button"
                                onClick={() => {
                                  const previousMonth = new Date(calendarMonth);
                                  previousMonth.setMonth(previousMonth.getMonth() - 1);
                                  previousMonth.setDate(1);
                                  setCalendarMonth(previousMonth);
                                }}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:bg-white hover:text-blue-700 transition-colors"
                              >
                                <ChevronLeft className="w-4 h-4" />
                                Önceki
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const nextMonth = new Date(calendarMonth);
                                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                                  nextMonth.setDate(1);
                                  setCalendarMonth(nextMonth);
                                }}
                                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                              >
                                Sonraki
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700">
                      Misafir Sayısı
                      {selectedYacht?.capacity && (
                        <span className="text-[10px] font-normal text-slate-500 ml-1">
                          (Yat Kapasitesi: {selectedYacht.capacity} kişi)
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="55"
                      required
                      value={bookingDetails.guests}
                      onChange={(e) => {
                        const newGuests = parseInt(e.target.value) || 1;
                        setBookingDetails(prev => ({ 
                          ...prev, 
                          guests: newGuests,
                          // Misafir sayısı değiştiğinde ekstra paket seçimini sıfırla
                          extraGuestPackageIndex: undefined
                        }));
                      }}
                      className="w-full h-[56px] bg-slate-50 border border-slate-200 text-slate-800 px-4 rounded-[18px] text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {(pickupPoints.length > 0 || dropoffPoints.length > 0) && (
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5">
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-slate-900">Biniş ve İniş Noktası</h3>
                      <p className="mt-1 text-xs text-slate-500">Ek ücretli noktalar seçildiğinde ücret toplam tutara eklenir.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {pickupPoints.length > 0 && (
                        <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">
                          Biniş Noktası
                          <select
                            value={bookingDetails.pickupPoint}
                            onChange={(event) => setBookingDetails(prev => ({ ...prev, pickupPoint: event.target.value }))}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500"
                          >
                            {pickupPoints.map(point => (
                              <option key={point.name} value={point.name}>
                                {point.name}{point.price > 0 ? ` (+${formatPrice(point.price)})` : " (Ücretsiz)"}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                      {dropoffPoints.length > 0 && (
                        <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">
                          İniş Noktası
                          <select
                            value={bookingDetails.dropoffPoint}
                            onChange={(event) => setBookingDetails(prev => ({ ...prev, dropoffPoint: event.target.value }))}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500"
                          >
                            {dropoffPoints.map(point => (
                              <option key={point.name} value={point.name}>
                                {point.name}{point.price > 0 ? ` (+${formatPrice(point.price)})` : " (Ücretsiz)"}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {/* Ekstra Misafir Uyarısı ve Seçim Ekranı */}
                <div className={`rounded-2xl p-5 flex flex-col gap-4 border-2 transition-colors ${
                  isOverCapacity
                    ? "bg-amber-50 border-amber-400"
                    : "bg-slate-50 border-slate-200"
                }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isOverCapacity ? "bg-amber-500" : "bg-slate-300"
                      }`}>
                        <svg className={`w-5 h-5 ${isOverCapacity ? "text-white" : "text-slate-700"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOverCapacity ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" : "M13 16h-1v-4h-1m1-4h.01M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"} />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-bold mb-1 ${isOverCapacity ? "text-amber-900" : "text-slate-900"}`}>
                          {isOverCapacity ? "⚠️ Kapasite Limiti Aşıldı" : "Ekstra Misafir Paketi"}
                        </h4>
                        {isOverCapacity ? (
                          <p className="text-xs text-amber-800 leading-relaxed">
                            Bu yatın normal kapasitesi <strong>{selectedYacht?.capacity || 0} kişi</strong>. 
                            Siz <strong>{bookingDetails.guests} kişi</strong> seçtiniz ({extraGuests} kişi fazla).
                            <br />
                            <strong>Ekstra misafir için ek ücretli paket seçmeniz gerekmektedir.</strong>
                          </p>
                        ) : (
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Kapasite aşılmadığı için ekstra misafir paketi zorunlu değildir. Limit aşıldığında bu bölüm aktif hale gelir.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Ekstra Misafir Paket Seçimi */}
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Ekstra Misafir Paketi Seçiniz{isOverCapacity ? <span className="text-red-600"> *</span> : null}
                      </label>
                      <select
                        value={
                          bookingDetails.extraGuestPackageIndex !== undefined 
                            ? bookingDetails.extraGuestPackageIndex 
                            : -1
                        }
                        onChange={(e) => {
                          const idx = parseInt(e.target.value);
                          setBookingDetails(prev => ({ 
                            ...prev, 
                            extraGuestPackageIndex: idx === -1 ? undefined : idx 
                          }));
                        }}
                        disabled={!isOverCapacity}
                        className={`w-full bg-slate-50 border text-slate-800 px-4 py-3 rounded-lg text-sm font-medium outline-none transition-all ${
                          isOverCapacity
                            ? "border-amber-300 focus:border-amber-500 focus:bg-white"
                            : "border-slate-200 opacity-75 cursor-not-allowed"
                        }`}
                      >
                        <option value="-1">
                          {isOverCapacity
                            ? "-- Lütfen ekstra misafir paketi seçiniz --"
                            : "-- Kapasite aşılınca paket seçimi burada görünecek --"}
                        </option>
                        {extraGuestPricing.map((rule: any, idx: number) => {
                          const isApplicable = extraGuests >= rule.min_guests && extraGuests <= rule.max_guests;
                          const guestRange = rule.min_guests === rule.max_guests 
                            ? `+${rule.min_guests} Kişi` 
                            : `+${rule.min_guests}-${rule.max_guests} Kişi`;
                          
                          return (
                            <option 
                              key={idx} 
                              value={idx}
                              disabled={!isApplicable}
                            >
                              {guestRange} - {formatPrice(rule.price)} Ek Ücret
                              {isApplicable ? " ✓ Uygun" : " (Misafir sayınız için uygun değil)"}
                            </option>
                          );
                        })}
                      </select>
                      
                      {bookingDetails.extraGuestPackageIndex !== undefined && 
                       bookingDetails.extraGuestPackageIndex >= 0 && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800">
                          ✓ Paket seçildi: <strong>+{formatPrice(extraGuestPricing[bookingDetails.extraGuestPackageIndex].price)}</strong> ek ücret uygulanacak.
                        </div>
                      )}
                    </div>
                  </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700">Kiralama Türü / Paket Seçeneği</label>
                    <select
                      value={selectedPackageIndex}
                      onChange={(e) => {
                        const idx = parseInt(e.target.value);
                        setSelectedPackageIndex(idx);
                        if (idx !== -1 && selectedYacht?.packages?.[idx]) {
                          const pkg = selectedYacht.packages[idx];
                          const parsedDuration = parseInt(pkg.duration) || 2;
                          setBookingDetails(prev => ({ ...prev, duration: parsedDuration }));
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                    >
                      <option value="-1">Saatlik Kiralama (Kendi Süreni Seç)</option>
                      {selectedYacht?.packages && selectedYacht.packages.map((pkg, idx) => (
                        <option key={idx} value={idx}>
                          {pkg.title} ({pkg.duration} - {formatPrice(pkg.price)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700">
                      Süre (Saat - Min 2 Saat)
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="12"
                      required
                      disabled={selectedPackageIndex !== -1}
                      value={bookingDetails.duration}
                      onChange={(e) => {
                        let val = parseInt(e.target.value) || 2;
                        setBookingDetails(prev => ({ ...prev, duration: val < 2 ? 2 : val }));
                      }}
                      className={`w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all ${
                        selectedPackageIndex !== -1 ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Visual Hour Grid showing occupied / selected blocks */}
                <div className="flex flex-col gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700 block">Günlük Zaman Planı (Rezervasyon Zaman Aralığı)</span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {getDisplayHours().map((hour) => {
                      const slotVal = timeToNumber(hour);
                      
                      // Check if there is at least 2 hours of free time after this slot
                      let nextBookingStart = 48;
                      existingBookings.forEach((b) => {
                        if (!b.start_time || !b.duration) return;
                        const bStart = timeToNumber(b.start_time) + (b.dayOffset || 0) * 24;
                        if (bStart >= slotVal && bStart < nextBookingStart) {
                          nextBookingStart = bStart;
                        }
                      });
                      // İleride başka rezervasyon yoksa seçilen süre kadar boşluk yeterli, araya başka rezervasyon girecekse seçilen süre + 30 dk (0.50 saat) temizlik payı lazım
                      const requiredGap = nextBookingStart === 48 ? bookingDetails.duration : bookingDetails.duration + 0.5;
                      const notEnoughTime = (nextBookingStart - slotVal) < requiredGap;

                      const startVal = timeToNumber(startTime);
                      const isOccupied = slotVal >= startVal && slotVal <= startVal + bookingDetails.duration;
                      const isPast = isHourPast(hour);
                      const isBooked = isSlotBooked(hour);
                      const isCleaning = isSlotCleaning(hour);
                      const isTomorrow = hour.includes("(+1)");
                      
                      return (
                        <button
                          key={hour}
                          type="button"
                          disabled={isPast || isBooked || isCleaning || notEnoughTime || isTomorrow}
                          onClick={() => {
                            setStartTime(hour);
                          }}
                          className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all duration-200 ${
                            isPast
                              ? "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed opacity-50"
                              : isBooked
                                ? "bg-red-600 border-red-600 text-white font-bold cursor-not-allowed opacity-80"
                                : isCleaning
                                  ? "bg-red-50 border-red-200 text-red-500 font-bold cursor-not-allowed opacity-75"
                                  : isOccupied
                                    ? "bg-blue-600 border-blue-600 text-white shadow-sm scale-[1.03] cursor-pointer"
                                    : notEnoughTime
                                      ? "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed opacity-50"
                                      : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 cursor-pointer"
                          }`}
                        >
                          {hour.replace(" (+1)", "")}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200/60 font-sans">
                    <span>Başlangıç için yukarıdan saat seçin:</span>
                    <strong className="text-blue-600 font-bold whitespace-nowrap">
                      {startTime} - {numberToTime(timeToNumber(startTime) + bookingDetails.duration)} ({bookingDetails.duration} Saat)
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Extras checklist */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                {services.length === 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                    Şu anda seçilebilecek ek hizmet bulunmuyor.
                  </div>
                )}
                {services.map((service) => {
                  const selected = bookingDetails.selectedServiceIds.includes(service.id);
                  return (
                    <label key={service.id} className={`bg-white p-5 flex items-center justify-between gap-5 cursor-pointer rounded-2xl border hover:border-blue-300 hover:shadow-md transition-all ${selected ? "border-blue-500 bg-blue-50/40" : "border-slate-200"}`}>
                      <div>
                        <strong className="text-slate-900 block text-sm font-semibold">{service.name}</strong>
                        <span className="text-xs text-slate-500">
                          {service.description}{service.description ? " " : ""}
                          (+{formatPrice(service.price)}{service.priceType === "per_person" ? " / kişi" : ""})
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleServiceToggle(service.id)}
                        className="accent-blue-600 w-5 h-5 shrink-0"
                      />
                    </label>
                  );
                })}
              </div>
            )}

            {/* Step 4: Contact details info */}
            {step === 4 && (
              <div className="flex flex-col gap-4">
                <Input
                  {...register("firstName")}
                  label="Ad"
                  required
                />
                <Input
                  {...register("lastName")}
                  label="Soyad"
                  required
                />
                <Input
                  {...register("phone")}
                  label="Telefon"
                  required
                  type="tel"
                />
                <Input
                  {...register("email")}
                  label="E-posta"
                  required
                  type="email"
                />
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700">Rezervasyon Notu / Özel Talepleriniz</label>
                  <textarea
                    {...register("notes")}
                    placeholder="Varsa özel istekleriniz, yiyecek/içecek tercihlerinizi veya eklemek istediklerinizi yazabilirsiniz..."
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none transition-colors focus:border-blue-500 focus:bg-white resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Booking summary */}
            {step === 5 && (
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Rezervasyon Özeti</h2>
                  <p className="mt-1 text-sm text-slate-500">Bilgilerinizi kontrol edin. Onayladığınızda ödeme adımına geçeceksiniz.</p>
                </div>
                {bookingSummary}
              </div>
            )}

            {/* Step 6: Payment */}
            {step === 6 && (
              <div className="flex flex-col gap-6">
                <p className="text-slate-600 text-sm leading-relaxed">
                  Tebrikler, tüm adımları tamamladınız. Rezervasyon talebinizi onaylamak için lütfen aşağıdaki hesaba %50 oranında ön ödeme transferini gerçekleştiriniz.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <h4 className="text-blue-700 font-bold text-sm uppercase tracking-wider mb-2">Banka EFT/Havale Bilgileri</h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <strong>Banka:</strong> Garanti BBVA<br />
                    <strong>Alıcı:</strong> yatigotr Turizm A.Ş.<br />
                    <strong>IBAN:</strong> TR45 0006 2000 1234 5678 9012 34<br />
                    <strong>Açıklama:</strong> Rezervasyon ad soyad giriniz.
                  </p>
                </div>
              </div>
            )}

            {/* Form control buttons */}
            <div className="flex items-center gap-4 border-t border-slate-100 pt-6 mt-4 w-full">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-4 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer whitespace-nowrap"
                >
                  Geri Dön
                </button>
              ) : (
                <div />
              )}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-4 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 hover:shadow-[0_4px_15px_rgba(37,99,235,0.3)] transition-all cursor-pointer ml-auto"
                >
                  {step === 5 ? "Ödemeye Geç" : "Devam Et"}
                </button>
              ) : (
                <div className="flex-1">
                  {submissionError && <p className="mb-3 text-sm text-red-600">{submissionError}</p>}
                  <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex justify-center items-center gap-2 shadow-[0_8px_30px_rgba(37,99,235,0.25)] transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer">
                    {isSubmitting ? "Gönderiliyor..." : "Talebi Gönder"}
                  </button>
                </div>
              )}
            </div>

          </form>
        </div>

      </div>
      {showDurationWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 sm:p-8 max-w-md w-full text-center flex flex-col gap-5">
            <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto text-amber-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-sans text-xl text-slate-900 font-bold">Yat Müsaitliği</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-semibold">
                Bu kadar saatlik bu yatımız boşta değil, lütfen diğer yatlarımıza bakın.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowDurationWarning(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
              >
                Kapat ({maxAllowedDuration} Saat Yap)
              </button>
              <a
                href="/yatlarimiz"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-600/10 cursor-pointer flex items-center justify-center animate-pulse"
              >
                Diğer Yatlarımızı Gör
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


