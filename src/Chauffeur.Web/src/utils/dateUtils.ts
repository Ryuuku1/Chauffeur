import type { Season } from '../types/domain';

export const getSeasonByDate = (value: string): Season => {
  const month = new Date(value).getMonth() + 1;

  if ([3, 4, 5].includes(month)) return 'Spring';
  if ([6, 7, 8].includes(month)) return 'Summer';
  if ([9, 10, 11].includes(month)) return 'Autumn';
  return 'Winter';
};

export const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
