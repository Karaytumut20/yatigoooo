export interface YachtPackage {
  title: string;
  price: number;
  duration: string;
  description: string;
}

export interface Yacht {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  images: string[];
  capacity: number;
  diningCapacity: number;
  length: string;
  cabins?: number;
  bathrooms?: number;
  crew?: number;
  speed: string;
  hourlyPrice: number;
  minHours: number;
  fullDayPrice?: number;
  features: string[];
  amenities: string[];
  packages: YachtPackage[];
  seo: {
    title: string;
    description: string;
  };
}
