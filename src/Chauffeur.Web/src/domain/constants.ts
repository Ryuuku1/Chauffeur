import type {
  CarCategory,
  CarStyle,
  EventType,
  PreferredContactMethod,
  QuoteStatus,
  ReservationStatus,
  Transmission,
} from './models';

export const eventTypeOptions: EventType[] = [
  'wedding',
  'proposal',
  'photoshoot',
  'anniversary',
  'luxury-transfer',
  'corporate',
  'other',
];

export const carCategoryOptions: CarCategory[] = ['Vintage', 'Exotic'];
export const transmissionOptions: Transmission[] = ['Automatic', 'Manual'];
export const carStyleOptions: CarStyle[] = ['Convertible', 'Grand Tourer', 'Limousine', 'Statement'];
export const contactMethodOptions: PreferredContactMethod[] = ['email', 'phone', 'whatsapp'];
export const reservationStatusValues: ReservationStatus[] = [
  'pending',
  'approved',
  'confirmed',
  'completed',
  'rejected',
];
export const quoteStatusValues: QuoteStatus[] = [
  'pending',
  'reviewing',
  'quote-sent',
  'accepted',
  'declined',
];
