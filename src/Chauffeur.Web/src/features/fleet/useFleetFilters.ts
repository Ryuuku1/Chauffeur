import { useDeferredValue, useMemo } from 'react';
import type { AppSnapshot, Car, EventType } from '@/domain/models';
import { getCarAvailabilityStatus } from '@/utils/pricing';

export interface FleetFilters {
  query: string;
  categories: string[];
  eventType: EventType | '';
  seats: number;
  transmission: string;
  maxPrice: number;
  startDate: string;
  endDate: string;
  availableOnly: boolean;
}

export const useFleetFilters = (snapshot: AppSnapshot, filters: FleetFilters): Car[] => {
  const deferredFilters = useDeferredValue(filters);

  return useMemo(() => {
    return snapshot.cars.filter((car) => {
      if (
        deferredFilters.query &&
        !`${car.name} ${car.brand} ${car.model} ${car.summary}`.toLowerCase().includes(deferredFilters.query.toLowerCase())
      ) {
        return false;
      }

      if (deferredFilters.categories.length && !deferredFilters.categories.includes(car.category)) {
        return false;
      }

      if (deferredFilters.eventType && !car.suitableEvents.includes(deferredFilters.eventType)) {
        return false;
      }

      if (deferredFilters.seats > 0 && car.seats < deferredFilters.seats) {
        return false;
      }

      if (deferredFilters.transmission && car.transmission !== deferredFilters.transmission) {
        return false;
      }

      if (car.pricing.basePrice > deferredFilters.maxPrice) {
        return false;
      }

      if (deferredFilters.startDate) {
        const status = getCarAvailabilityStatus(
          snapshot,
          car.id,
          deferredFilters.startDate,
          deferredFilters.endDate || deferredFilters.startDate,
        );

        if (deferredFilters.availableOnly && status !== 'available') {
          return false;
        }
      }

      return true;
    });
  }, [deferredFilters, snapshot]);
};
