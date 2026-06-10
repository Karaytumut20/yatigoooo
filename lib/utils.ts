import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0
  }).format(price);
}

export function formatDate(dateVal: string | Date | undefined | null): string {
  if (!dateVal) return "";
  try {
    const d = typeof dateVal === "string" ? new Date(dateVal.includes("T") ? dateVal : `${dateVal}T00:00:00`) : dateVal;
    if (isNaN(d.getTime())) return String(dateVal);
    
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(d);
  } catch {
    return String(dateVal);
  }
}
