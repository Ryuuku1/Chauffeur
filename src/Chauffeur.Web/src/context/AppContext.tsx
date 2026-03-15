import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { appApi } from '../api/appApi';
import type { CreateCarDto, CreateOfferRequestDto } from '../types/api';
import type { Car, OfferRequest, Reservation, Season } from '../types/domain';

interface AppContextValue {
  cars: Car[];
  reservations: Reservation[];
  offers: OfferRequest[];
  isLoading: boolean;
  error: string | null;
  refreshState: () => Promise<void>;
  resetState: () => Promise<void>;
  addOfferRequest: (input: CreateOfferRequestDto) => Promise<void>;
  addCar: (input: CreateCarDto) => Promise<void>;
  updateSeasonMultiplier: (carId: string, season: Season, multiplier: number) => Promise<void>;
  updateBasePrice: (carId: string, basePrice: number) => Promise<void>;
  setReservationStatus: (reservationId: string, status: Reservation['status']) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [offers, setOffers] = useState<OfferRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshState = useCallback(async () => {
    setError(null);
    const data = await appApi.getState();
    setCars(data.cars);
    setReservations(data.reservations);
    setOffers(data.offers);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        await refreshState();
      } catch {
        setError('Unable to load mock API state.');
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [refreshState]);

  const value = useMemo<AppContextValue>(
    () => ({
      cars,
      reservations,
      offers,
      isLoading,
      error,
      refreshState,
      resetState: async () => {
        await appApi.reset();
        await refreshState();
      },
      addOfferRequest: async (input) => {
        await appApi.createOffer(input);
        await refreshState();
      },
      addCar: async (input) => {
        await appApi.createCar(input);
        await refreshState();
      },
      updateSeasonMultiplier: async (carId, season, multiplier) => {
        await appApi.updateSeasonalMultiplier(carId, season, multiplier);
        await refreshState();
      },
      updateBasePrice: async (carId, basePrice) => {
        await appApi.updateBasePrice(carId, basePrice);
        await refreshState();
      },
      setReservationStatus: async (reservationId, status) => {
        await appApi.updateReservationStatus(reservationId, status);
        await refreshState();
      },
    }),
    [cars, error, isLoading, offers, refreshState, reservations],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }

  return context;
};
