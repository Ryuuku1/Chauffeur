import { describe, expect, it } from 'vitest';
import { initialSnapshot } from '@/domain/mockData';
import { getCarAvailabilityStatus, getPriceEstimate } from '@/utils/pricing';

describe('premium booking calculations', () => {
  it('applies seasonal and event pricing rules to quote previews', () => {
    const car = initialSnapshot.cars[0];
    const extras = initialSnapshot.extras.filter((extra) => ['extra-champagne', 'extra-florals'].includes(extra.id));

    const estimate = getPriceEstimate(initialSnapshot, {
      car,
      eventType: 'wedding',
      date: '2026-06-18',
      selectedExtras: extras,
    });

    expect(estimate.appliedSeason?.name).toBe('Summer peak');
    expect(estimate.total).toBe(1394);
  });

  it('marks booked and blocked ranges correctly', () => {
    expect(
      getCarAvailabilityStatus(initialSnapshot, 'car-rolls-cloud', '2026-06-18', '2026-06-18'),
    ).toBe('booked');

    expect(
      getCarAvailabilityStatus(initialSnapshot, 'car-ferrari-spider', '2026-06-23', '2026-06-23'),
    ).toBe('blocked');
  });
});
