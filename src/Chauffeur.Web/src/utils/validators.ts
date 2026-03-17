import type { InquiryInput, UpsertBlockedDateInput, UpsertCarInput, UpsertSeasonInput } from '@/domain/contracts';

export type ValidationErrors<T extends string> = Partial<Record<T, string>>;

export const validateInquiry = (
  input: InquiryInput,
): ValidationErrors<
  | 'customerName'
  | 'email'
  | 'phone'
  | 'eventDate'
  | 'pickupLocation'
  | 'passengerCount'
  | 'carId'
> => {
  const errors: ValidationErrors<
    | 'customerName'
    | 'email'
    | 'phone'
    | 'eventDate'
    | 'pickupLocation'
    | 'passengerCount'
    | 'carId'
  > = {};

  if (!input.customerName.trim()) {
    errors.customerName = 'errors.customerNameRequired';
  }

  if (!input.email.includes('@')) {
    errors.email = 'errors.invalidEmail';
  }

  if (input.phone.trim().length < 6) {
    errors.phone = 'errors.invalidPhone';
  }

  if (!input.eventDate) {
    errors.eventDate = 'errors.eventDateRequired';
  }

  if (!input.pickupLocation.trim()) {
    errors.pickupLocation = 'errors.pickupRequired';
  }

  if (input.passengerCount < 1) {
    errors.passengerCount = 'errors.passengerCountMin';
  }

  if (!input.carId) {
    errors.carId = 'errors.carRequired';
  }

  return errors;
};

export const validateCarForm = (
  input: UpsertCarInput,
): ValidationErrors<'name' | 'slug' | 'heroImage' | 'basePrice' | 'summary'> => {
  const errors: ValidationErrors<'name' | 'slug' | 'heroImage' | 'basePrice' | 'summary'> = {};

  if (!input.name.trim()) {
    errors.name = 'errors.carNameRequired';
  }

  if (!input.slug.trim()) {
    errors.slug = 'errors.slugRequired';
  }

  if (!input.heroImage.trim()) {
    errors.heroImage = 'errors.heroImageRequired';
  }

  if (input.basePrice <= 0) {
    errors.basePrice = 'errors.basePriceMin';
  }

  if (!input.summary.trim()) {
    errors.summary = 'errors.summaryRequired';
  }

  return errors;
};

export const validateSeasonForm = (
  input: UpsertSeasonInput,
): ValidationErrors<'name' | 'startDate' | 'endDate' | 'multiplier'> => {
  const errors: ValidationErrors<'name' | 'startDate' | 'endDate' | 'multiplier'> = {};

  if (!input.name.trim()) {
    errors.name = 'errors.seasonNameRequired';
  }

  if (!input.startDate) {
    errors.startDate = 'errors.seasonStartRequired';
  }

  if (!input.endDate) {
    errors.endDate = 'errors.seasonEndRequired';
  }

  if (input.multiplier <= 0) {
    errors.multiplier = 'errors.seasonMultiplierMin';
  }

  return errors;
};

export const validateBlockedDateForm = (
  input: UpsertBlockedDateInput,
): ValidationErrors<'carId' | 'startDate' | 'endDate' | 'label'> => {
  const errors: ValidationErrors<'carId' | 'startDate' | 'endDate' | 'label'> = {};

  if (!input.carId) {
    errors.carId = 'errors.blockedCarRequired';
  }

  if (!input.startDate) {
    errors.startDate = 'errors.seasonStartRequired';
  }

  if (!input.endDate) {
    errors.endDate = 'errors.seasonEndRequired';
  }

  if (!input.label.trim()) {
    errors.label = 'errors.blockedLabelRequired';
  }

  return errors;
};
