import type { Car, OfferRequest, Reservation } from '../types/domain';

export const seedCars: Car[] = [
  {
    id: 'car-1',
    name: '1964 Rolls-Royce Silver Cloud III',
    category: 'Vintage',
    year: 1964,
    seats: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80',
    description: 'Classic British luxury with timeless elegance for weddings.',
    price: {
      basePrice: 600,
      seasonalMultipliers: { Spring: 0.9, Summer: 1.25, Autumn: 1, Winter: 0.95 },
    },
  },
  {
    id: 'car-2',
    name: 'Ferrari 488 Spider',
    category: 'Exotic',
    year: 2021,
    seats: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    description: 'Open-top supercar for unforgettable grand entrances.',
    price: {
      basePrice: 950,
      seasonalMultipliers: { Spring: 1, Summer: 1.35, Autumn: 1.1, Winter: 0.9 },
    },
  },
  {
    id: 'car-3',
    name: '1968 Ford Mustang Fastback',
    category: 'Vintage',
    year: 1968,
    seats: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    description: 'Muscle-era icon with cinematic charm for events and shoots.',
    price: {
      basePrice: 520,
      seasonalMultipliers: { Spring: 0.95, Summer: 1.2, Autumn: 1.05, Winter: 0.9 },
    },
  },
];

export const seedReservations: Reservation[] = [
  {
    id: 'res-1',
    carId: 'car-1',
    customerName: 'Emma Brooks',
    eventType: 'Wedding',
    date: '2026-06-14',
    status: 'Approved',
  },
  {
    id: 'res-2',
    carId: 'car-2',
    customerName: 'Ryan Lee',
    eventType: 'Photoshoot',
    date: '2026-06-14',
    status: 'Pending',
  },
  {
    id: 'res-3',
    carId: 'car-3',
    customerName: 'Mia Turner',
    eventType: 'Corporate',
    date: '2026-04-10',
    status: 'Approved',
  },
];

export const seedOffers: OfferRequest[] = [];
