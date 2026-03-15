export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export interface PriceConfiguration {
  basePrice: number;
  seasonalMultipliers: Record<Season, number>;
}

export interface Car {
  id: string;
  name: string;
  category: 'Vintage' | 'Exotic';
  year: number;
  seats: number;
  imageUrl: string;
  description: string;
  price: PriceConfiguration;
}

export interface Reservation {
  id: string;
  carId: string;
  customerName: string;
  eventType: 'Wedding' | 'Engagement' | 'Photoshoot' | 'Corporate' | 'Other';
  date: string;
  status: 'Pending' | 'Approved' | 'Declined';
  notes?: string;
}

export interface OfferRequest {
  id: string;
  customerName: string;
  email: string;
  date: string;
  carId: string;
  guests: number;
  eventType: Reservation['eventType'];
  message: string;
  createdAt: string;
}
