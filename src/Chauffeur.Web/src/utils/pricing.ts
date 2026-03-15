import type { Car } from '../types/domain';
import { getSeasonByDate } from './dateUtils';

export const calculatePriceForDate = (car: Car, date: string): number => {
  const season = getSeasonByDate(date);
  return Math.round(car.price.basePrice * car.price.seasonalMultipliers[season]);
};
