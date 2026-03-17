import type { AppSnapshot, AvailabilityStatus, Car, EventType, Extra, QuoteRequest, Reservation, Season } from '@/domain/models';
import { isDateWithinRange, rangesOverlap } from './date';

export interface PriceEstimateInput {
  car: Car;
  eventType: EventType;
  date: string;
  endDate?: string;
  selectedExtras: Extra[];
}

export interface PriceEstimate {
  basePrice: number;
  seasonalMultiplier: number;
  eventMultiplier: number;
  extrasTotal: number;
  total: number;
  appliedSeason?: Season;
}

export const getActiveSeason = (seasons: Season[], date: string): Season | undefined =>
  [...seasons]
    .sort((left, right) => right.priority - left.priority)
    .find((season) => isDateWithinRange(date, season.startDate, season.endDate));

export const getOverrideMultiplier = (car: Car, date: string): number => {
  const override = car.pricing.seasonalOverrides.find((item) =>
    isDateWithinRange(date, item.startDate, item.endDate),
  );

  if (!override) {
    return 1;
  }

  return override.type === 'multiplier' ? override.value : override.value / car.pricing.basePrice;
};

export const getPriceEstimate = (snapshot: AppSnapshot, input: PriceEstimateInput): PriceEstimate => {
  const activeSeason = getActiveSeason(snapshot.seasons, input.date);
  const seasonalMultiplier = activeSeason?.multiplier ?? 1;
  const overrideMultiplier = getOverrideMultiplier(input.car, input.date);
  const eventMultiplier = input.car.pricing.eventAdjustments[input.eventType];
  const extrasTotal = input.selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const basePrice = input.car.pricing.basePrice;
  const total = Math.round(basePrice * seasonalMultiplier * overrideMultiplier * eventMultiplier + extrasTotal);

  return {
    basePrice,
    seasonalMultiplier: seasonalMultiplier * overrideMultiplier,
    eventMultiplier,
    extrasTotal,
    total,
    appliedSeason: activeSeason,
  };
};

const reservationState = (reservation: Reservation): AvailabilityStatus =>
  reservation.status === 'pending' ? 'pending' : reservation.status === 'rejected' ? 'available' : 'booked';

export const getCarAvailabilityStatus = (
  snapshot: AppSnapshot,
  carId: string,
  startDate: string,
  endDate: string,
): AvailabilityStatus => {
  const blocked = snapshot.blockedDates.some((slot) =>
    slot.carId === carId && rangesOverlap(slot.startDate, slot.endDate, startDate, endDate),
  );

  if (blocked) {
    return 'blocked';
  }

  const matchingReservation = snapshot.reservations.find(
    (reservation) =>
      reservation.carId === carId &&
      reservation.status !== 'rejected' &&
      rangesOverlap(reservation.startDate, reservation.endDate, startDate, endDate),
  );

  if (!matchingReservation) {
    return 'available';
  }

  return reservationState(matchingReservation);
};

export const filterCarsByAvailability = (
  snapshot: AppSnapshot,
  startDate?: string,
  endDate?: string,
): Car[] => {
  if (!startDate) {
    return snapshot.cars;
  }

  return snapshot.cars.filter(
    (car) => getCarAvailabilityStatus(snapshot, car.id, startDate, endDate ?? startDate) === 'available',
  );
};

export const countRequestActivity = (snapshot: AppSnapshot, carId: string): number => {
  const reservations = snapshot.reservations.filter((item) => item.carId === carId).length;
  const quotes = snapshot.quotes.filter((item) => item.carId === carId).length;
  return reservations + quotes;
};

export const getMostRequestedCar = (snapshot: AppSnapshot): Car | undefined =>
  [...snapshot.cars].sort(
    (left, right) => countRequestActivity(snapshot, right.id) - countRequestActivity(snapshot, left.id),
  )[0];

export const getRecentRequests = (
  requests: Array<Reservation | QuoteRequest>,
): Array<Reservation | QuoteRequest> =>
  [...requests].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
