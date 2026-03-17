import type {
  Car,
  EventType,
  PreferredContactMethod,
  QuoteStatus,
  ReservationStatus,
  Season,
  TenantBranding,
  TenantContent,
  TenantLocalizationSettings,
  NavigationItemConfig,
  TenantSeo,
  TenantTheme,
} from './models';

export interface InquiryInput {
  customerName: string;
  email: string;
  phone: string;
  eventType: EventType;
  eventDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  pickupLocation: string;
  destination?: string;
  passengerCount: number;
  notes: string;
  extraIds: string[];
  preferredContactMethod: PreferredContactMethod;
  carId: string;
}

export interface UpsertCarInput {
  id?: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: Car['category'];
  style: Car['style'];
  transmission: Car['transmission'];
  seats: number;
  location: string;
  heroImage: string;
  accent: string;
  summary: string;
  story: string;
  tags: string[];
  featured: boolean;
  availabilityBlurb: string;
  imageUrls: string[];
  includedExtraIds: string[];
  suitableEvents: Car['suitableEvents'];
  basePrice: number;
  minimumHours: number;
  eventAdjustments: Car['pricing']['eventAdjustments'];
}

export interface UpsertSeasonInput {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  multiplier: number;
  priority: number;
  tone: string;
}

export interface UpsertBlockedDateInput {
  id?: string;
  carId: string;
  startDate: string;
  endDate: string;
  label: string;
}

export type UpdateTenantBrandingInput = TenantBranding;
export type UpdateTenantThemeInput = TenantTheme;
export type UpdateTenantContentInput = TenantContent;
export type UpdateTenantSeoInput = TenantSeo;
export type UpdateTenantLocalizationInput = TenantLocalizationSettings;
export type UpdateTenantNavigationInput = NavigationItemConfig[];

export interface UpdateQuoteStatusInput {
  quoteId: string;
  status: QuoteStatus;
}

export interface UpdateReservationStatusInput {
  reservationId: string;
  status: ReservationStatus;
}

export interface UpdateCarPricingInput {
  carId: string;
  basePrice: number;
  minimumHours: number;
  eventAdjustments: Car['pricing']['eventAdjustments'];
}

export interface RepositorySession {
  role: 'guest' | 'manager';
}

export type EditableSeason = Omit<Season, 'id'>;
