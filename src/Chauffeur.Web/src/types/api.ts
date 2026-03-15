import type { Car, OfferRequest, Reservation, Season } from './domain';

export interface AppStateDto {
  cars: Car[];
  reservations: Reservation[];
  offers: OfferRequest[];
}

export interface CreateOfferRequestDto {
  customerName: string;
  email: string;
  date: string;
  carId: string;
  guests: number;
  eventType: Reservation['eventType'];
  message: string;
}

export interface CreateCarDto {
  name: string;
  category: Car['category'];
  year: number;
  seats: number;
  imageUrl: string;
  description: string;
  basePrice: number;
}

export interface UpdateSeasonalMultiplierDto {
  season: Season;
  multiplier: number;
}

export interface UpdateBasePriceDto {
  basePrice: number;
}

export interface UpdateReservationStatusDto {
  status: Reservation['status'];
}
