import { useEffect, useState } from 'react';
import { appApi } from '../api/appApi';
import { useAppContext } from '../context/AppContext';
import type { Car } from '../types/domain';

export const useAvailability = (date: string) => {
  const { cars } = useAppContext();
  const [availableCars, setAvailableCars] = useState<Car[]>(cars);

  useEffect(() => {
    if (!date) {
      setAvailableCars(cars);
      return;
    }

    const load = async () => {
      const data = await appApi.getAvailability(date);
      setAvailableCars(data);
    };

    void load();
  }, [cars, date]);

  return availableCars;
};
