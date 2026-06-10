export interface YachtPackage {
  title: string;
  price: number;
  duration: string;
  description: string;
}

export interface YachtTransferPoint {
  name: string;
  price: number;
}

export interface Yacht {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  images: string[];
  capacity: number;
  length: string;
  hourlyPrice: number;
  minHours: number;
  fullDayPrice?: number;
  features: string[];
  amenities: string[];
  packages: YachtPackage[];
  showAmenities?: boolean;
  showPackages?: boolean;
  showFeatures?: boolean;
  yachtType?: string;
  cabinCount?: number;
  hasPool?: boolean;
  hasFlybridge?: boolean;
  extraGuestPricing?: { min_guests: number; max_guests: number; price: number; }[];
  pickupPoints?: YachtTransferPoint[];
  dropoffPoints?: YachtTransferPoint[];
  experienceSlugs?: string[];
  visibleSpecs?: {
    length: boolean;
    capacity: boolean;
    hourlyPrice: boolean;
  };
  seo?: {
    title: string;
    description: string;
    display_options?: {
      show_amenities?: boolean;
      show_packages?: boolean;
      show_features?: boolean;
      visible_specs?: {
        length?: boolean;
        capacity?: boolean;
        hourly_price?: boolean;
      };
    };
  };
  // Deprecated fields - kept for backward compatibility
  diningCapacity?: number;
  speed?: string;
  cabins?: number;
  bathrooms?: number;
  crew?: number;
}
