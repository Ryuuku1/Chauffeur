import { seedCars, seedOffers, seedReservations } from '../data/seedData';
import type {
  AppStateDto,
  CreateCarDto,
  CreateOfferRequestDto,
  UpdateBasePriceDto,
  UpdateReservationStatusDto,
  UpdateSeasonalMultiplierDto,
} from '../types/api';

const storageKey = 'chauffeur-mock-api-db';

const json = (data: unknown, init?: ResponseInit): Response =>
  new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

const parseRequestBody = async <T>(request: Request): Promise<T> =>
  (await request.json()) as T;

const createInitialState = (): AppStateDto => ({
  cars: seedCars,
  reservations: seedReservations,
  offers: seedOffers,
});

const loadDb = (): AppStateDto => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    const initial = createInitialState();
    localStorage.setItem(storageKey, JSON.stringify(initial));
    return initial;
  }

  try {
    return JSON.parse(raw) as AppStateDto;
  } catch {
    const initial = createInitialState();
    localStorage.setItem(storageKey, JSON.stringify(initial));
    return initial;
  }
};

const saveDb = (state: AppStateDto): void => {
  localStorage.setItem(storageKey, JSON.stringify(state));
};

const withLatency = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 150));
};

const buildUrl = (input: RequestInfo | URL): URL => {
  if (typeof input === 'string') {
    return new URL(input, window.location.origin);
  }

  if (input instanceof URL) {
    return input;
  }

  return new URL(input.url);
};

const notFound = () => json({ message: 'Endpoint not found' }, { status: 404 });

const handleApiRequest = async (request: Request): Promise<Response> => {
  await withLatency();

  const url = buildUrl(request.url);
  const pathname = url.pathname;
  const method = request.method.toUpperCase();
  const db = loadDb();

  if (method === 'GET' && pathname === '/api/state') {
    return json(db);
  }

  if (method === 'GET' && pathname === '/api/cars') {
    return json(db.cars);
  }

  if (method === 'POST' && pathname === '/api/cars') {
    const body = await parseRequestBody<CreateCarDto>(request);
    const nextCar = {
      id: `car-${crypto.randomUUID()}`,
      name: body.name,
      category: body.category,
      year: body.year,
      seats: body.seats,
      imageUrl: body.imageUrl,
      description: body.description,
      price: {
        basePrice: body.basePrice,
        seasonalMultipliers: {
          Spring: 1,
          Summer: 1,
          Autumn: 1,
          Winter: 1,
        },
      },
    };

    const nextState = { ...db, cars: [...db.cars, nextCar] };
    saveDb(nextState);
    return json(nextCar, { status: 201 });
  }

  const basePriceMatch = pathname.match(/^\/api\/cars\/([^/]+)\/base-price$/);
  if (method === 'PATCH' && basePriceMatch) {
    const carId = basePriceMatch[1];
    const body = await parseRequestBody<UpdateBasePriceDto>(request);
    const nextState = {
      ...db,
      cars: db.cars.map((car) =>
        car.id === carId ? { ...car, price: { ...car.price, basePrice: body.basePrice } } : car,
      ),
    };
    saveDb(nextState);
    return json({ success: true });
  }

  const seasonalMatch = pathname.match(/^\/api\/cars\/([^/]+)\/seasonal-multiplier$/);
  if (method === 'PATCH' && seasonalMatch) {
    const carId = seasonalMatch[1];
    const body = await parseRequestBody<UpdateSeasonalMultiplierDto>(request);
    const nextState = {
      ...db,
      cars: db.cars.map((car) =>
        car.id === carId
          ? {
              ...car,
              price: {
                ...car.price,
                seasonalMultipliers: {
                  ...car.price.seasonalMultipliers,
                  [body.season]: body.multiplier,
                },
              },
            }
          : car,
      ),
    };
    saveDb(nextState);
    return json({ success: true });
  }

  if (method === 'GET' && pathname === '/api/reservations') {
    return json(db.reservations);
  }

  const reservationMatch = pathname.match(/^\/api\/reservations\/([^/]+)\/status$/);
  if (method === 'PATCH' && reservationMatch) {
    const reservationId = reservationMatch[1];
    const body = await parseRequestBody<UpdateReservationStatusDto>(request);
    const nextState = {
      ...db,
      reservations: db.reservations.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, status: body.status } : reservation,
      ),
    };
    saveDb(nextState);
    return json({ success: true });
  }

  if (method === 'GET' && pathname === '/api/offers') {
    return json(db.offers);
  }

  if (method === 'POST' && pathname === '/api/offers') {
    const body = await parseRequestBody<CreateOfferRequestDto>(request);
    const offer = {
      ...body,
      id: `offer-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
    };
    const nextState = { ...db, offers: [offer, ...db.offers] };
    saveDb(nextState);
    return json(offer, { status: 201 });
  }

  if (method === 'GET' && pathname === '/api/availability') {
    const date = url.searchParams.get('date') ?? '';

    if (!date) {
      return json(db.cars);
    }

    const availableCars = db.cars.filter((car) => {
      const isBooked = db.reservations.some(
        (reservation) =>
          reservation.carId === car.id &&
          reservation.date === date &&
          reservation.status !== 'Declined',
      );

      return !isBooked;
    });

    return json(availableCars);
  }

  if (method === 'POST' && pathname === '/api/reset') {
    const initial = createInitialState();
    saveDb(initial);
    return json(initial);
  }

  return notFound();
};

export const installMockApi = (): void => {
  if ((window as Window & { __mockApiInstalled?: boolean }).__mockApiInstalled) {
    return;
  }

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = buildUrl(input);

    if (url.pathname.startsWith('/api/')) {
      const request = new Request(url.toString(), init);
      return handleApiRequest(request);
    }

    return originalFetch(input, init);
  };

  (window as Window & { __mockApiInstalled?: boolean }).__mockApiInstalled = true;
};
