export interface BookingDetails {
  yachtSlug: string;
  experienceSlug?: string;
  date: string;
  time: string;
  duration: number;
  guests: number;
  pickupPoint: string;
  dropoffPoint: string;
  extras: {
    catering: boolean;
    music: boolean;
    decor: boolean;
    laser: boolean;
  };
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

export interface AdminBooking {
  id: string;
  customer_name: string;
  email?: string;
  phone?: string;
  yacht_slug?: string;
  experience_slug?: string;
  booking_date?: string;
  start_time?: string;
  duration?: number;
  guests?: number;
  total_amount?: number;
  status: string;
  notes?: string;
  pickup_point?: string;
  dropoff_point?: string;
  pickup_fee?: number;
  dropoff_fee?: number;
  extras?: Array<{
    id: string;
    name: string;
    price: number;
    price_type: "fixed" | "per_person";
    quantity: number;
  }>;
  created_at?: string;
}
