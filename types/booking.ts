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
