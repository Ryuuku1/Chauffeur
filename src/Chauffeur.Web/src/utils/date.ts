const ONE_DAY = 24 * 60 * 60 * 1000;

const toDate = (value: string): Date => new Date(`${value}T00:00:00`);

export const todayIso = (): string => new Date().toISOString().slice(0, 10);

export const addDays = (value: string, days: number): string => {
  const next = new Date(toDate(value).getTime() + days * ONE_DAY);
  return next.toISOString().slice(0, 10);
};

export const enumerateDays = (startDate: string, endDate: string): string[] => {
  const start = toDate(startDate).getTime();
  const end = toDate(endDate).getTime();

  if (end < start) {
    return [];
  }

  const result: string[] = [];
  for (let current = start; current <= end; current += ONE_DAY) {
    result.push(new Date(current).toISOString().slice(0, 10));
  }

  return result;
};

export const rangesOverlap = (
  startA: string,
  endA: string,
  startB: string,
  endB: string,
): boolean => !(toDate(endA).getTime() < toDate(startB).getTime() || toDate(endB).getTime() < toDate(startA).getTime());

export const isDateWithinRange = (value: string, startDate: string, endDate: string): boolean => {
  const time = toDate(value).getTime();
  return time >= toDate(startDate).getTime() && time <= toDate(endDate).getTime();
};

export const getMonthGrid = (monthAnchor: string): Array<string | null> => {
  const date = toDate(monthAnchor);
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const grid: Array<string | null> = [];

  for (let day = 0; day < first.getDay(); day += 1) {
    grid.push(null);
  }

  for (let day = 1; day <= last.getDate(); day += 1) {
    grid.push(new Date(date.getFullYear(), date.getMonth(), day).toISOString().slice(0, 10));
  }

  while (grid.length % 7 !== 0) {
    grid.push(null);
  }

  return grid;
};
