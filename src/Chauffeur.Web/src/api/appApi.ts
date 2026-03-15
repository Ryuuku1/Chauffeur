import type { Car, OfferRequest, Reservation, Season } from '../types/domain';
import type { AppStateDto, CreateCarDto, CreateOfferRequestDto } from '../types/api';

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Mock API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
};

export const appApi = {
  getState: () => request<AppStateDto>('/api/state'),
  getAvailability: (date: string) => request<Car[]>(`/api/availability?date=${encodeURIComponent(date)}`),
  createOffer: (payload: CreateOfferRequestDto) =>
    request<OfferRequest>('/api/offers', { method: 'POST', body: JSON.stringify(payload) }),
  createCar: (payload: CreateCarDto) =>
    request<Car>('/api/cars', { method: 'POST', body: JSON.stringify(payload) }),
  updateBasePrice: (carId: string, basePrice: number) =>
    request<{ success: boolean }>(`/api/cars/${carId}/base-price`, {
      method: 'PATCH',
      body: JSON.stringify({ basePrice }),
    }),
  updateSeasonalMultiplier: (carId: string, season: Season, multiplier: number) =>
    request<{ success: boolean }>(`/api/cars/${carId}/seasonal-multiplier`, {
      method: 'PATCH',
      body: JSON.stringify({ season, multiplier }),
    }),
  updateReservationStatus: (reservationId: string, status: Reservation['status']) =>
    request<{ success: boolean }>(`/api/reservations/${reservationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  reset: () => request<AppStateDto>('/api/reset', { method: 'POST' }),
};
