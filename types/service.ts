export type ServicePriceType = "fixed" | "per_person";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  priceType: ServicePriceType;
  isActive: boolean;
  sortOrder: number;
}
