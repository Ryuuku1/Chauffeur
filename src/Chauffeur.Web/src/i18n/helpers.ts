import type { TFunction } from 'i18next';
import {
  carCategoryOptions,
  carStyleOptions,
  contactMethodOptions,
  eventTypeOptions,
  quoteStatusValues,
  reservationStatusValues,
  transmissionOptions,
} from '@/domain/constants';
import type {
  AvailabilityStatus,
  CarCategory,
  CarStyle,
  EventType,
  PreferredContactMethod,
  QuoteStatus,
  ReservationStatus,
  Transmission,
} from '@/domain/models';

export const availabilityStatusKeyMap: Record<AvailabilityStatus, string> = {
  available: 'statuses.available',
  booked: 'statuses.booked',
  pending: 'statuses.pending',
  blocked: 'statuses.blocked',
  selected: 'statuses.selected',
};

export const quoteStatusKeyMap: Record<QuoteStatus, string> = {
  pending: 'statuses.pending',
  reviewing: 'statuses.reviewing',
  'quote-sent': 'statuses.quoteSent',
  accepted: 'statuses.accepted',
  declined: 'statuses.declined',
};

export const reservationStatusKeyMap: Record<ReservationStatus, string> = {
  pending: 'statuses.pending',
  approved: 'statuses.approved',
  confirmed: 'statuses.confirmed',
  completed: 'statuses.completed',
  rejected: 'statuses.rejected',
};

export const eventTypeKeyMap: Record<EventType, string> = {
  wedding: 'eventTypes.wedding',
  proposal: 'eventTypes.proposal',
  photoshoot: 'eventTypes.photoshoot',
  anniversary: 'eventTypes.anniversary',
  'luxury-transfer': 'eventTypes.luxuryTransfer',
  corporate: 'eventTypes.corporate',
  other: 'eventTypes.other',
};

export const categoryKeyMap: Record<CarCategory, string> = {
  Vintage: 'carCategories.vintage',
  Exotic: 'carCategories.exotic',
};

export const transmissionKeyMap: Record<Transmission, string> = {
  Automatic: 'transmission.automatic',
  Manual: 'transmission.manual',
};

export const carStyleKeyMap: Record<CarStyle, string> = {
  Convertible: 'carStyles.convertible',
  'Grand Tourer': 'carStyles.grandTourer',
  Limousine: 'carStyles.limousine',
  Statement: 'carStyles.statement',
};

export const contactMethodKeyMap: Record<PreferredContactMethod, string> = {
  email: 'contactMethods.email',
  phone: 'contactMethods.phone',
  whatsapp: 'contactMethods.whatsapp',
};

export const getEventTypeOptions = (t: TFunction) =>
  eventTypeOptions.map((value) => ({ value, label: t(eventTypeKeyMap[value]) }));

export const getContactMethodOptions = (t: TFunction) =>
  contactMethodOptions.map((value) => ({ value, label: t(contactMethodKeyMap[value]) }));

export const getCategoryOptions = (t: TFunction) =>
  carCategoryOptions.map((value) => ({ value, label: t(categoryKeyMap[value]) }));

export const getTransmissionOptions = (t: TFunction) =>
  transmissionOptions.map((value) => ({ value, label: t(transmissionKeyMap[value]) }));

export const getCarStyleOptions = (t: TFunction) =>
  carStyleOptions.map((value) => ({ value, label: t(carStyleKeyMap[value]) }));

export const getReservationStatusOptions = (t: TFunction) =>
  reservationStatusValues.map((value) => ({ value, label: t(reservationStatusKeyMap[value]) }));

export const getQuoteStatusOptions = (t: TFunction) =>
  quoteStatusValues.map((value) => ({ value, label: t(quoteStatusKeyMap[value]) }));

export const getLocalizedEventType = (t: TFunction, value: EventType) => t(eventTypeKeyMap[value]);
export const getLocalizedAvailabilityStatus = (t: TFunction, value: AvailabilityStatus) =>
  t(availabilityStatusKeyMap[value]);
export const getLocalizedCategory = (t: TFunction, value: CarCategory) => t(categoryKeyMap[value]);
export const getLocalizedTransmission = (t: TFunction, value: Transmission) =>
  t(transmissionKeyMap[value]);
export const getLocalizedCarStyle = (t: TFunction, value: CarStyle) => t(carStyleKeyMap[value]);
