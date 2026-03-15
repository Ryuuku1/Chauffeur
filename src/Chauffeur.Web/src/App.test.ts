import { calculatePriceForDate } from './utils/pricing';
import { seedCars } from './data/seedData';

describe('calculatePriceForDate', () => {
  it('applies summer multiplier', () => {
    const car = seedCars[0];
    expect(calculatePriceForDate(car, '2026-07-10')).toBe(750);
  });
});
