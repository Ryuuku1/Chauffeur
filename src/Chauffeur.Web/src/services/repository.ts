import type {
  InquiryInput,
  UpdateCarPricingInput,
  UpdateQuoteStatusInput,
  UpdateReservationStatusInput,
  UpdateTenantBrandingInput,
  UpdateTenantContentInput,
  UpdateTenantLocalizationInput,
  UpdateTenantNavigationInput,
  UpdateTenantSeoInput,
  UpdateTenantThemeInput,
  UpsertBlockedDateInput,
  UpsertCarInput,
  UpsertSeasonInput,
} from '@/domain/contracts';
import type { AppSnapshot, QuoteRequest, Reservation, Season, TenantConfig } from '@/domain/models';

export interface ChauffeurRepository {
  getSnapshot(): Promise<AppSnapshot>;
  submitQuote(input: InquiryInput): Promise<QuoteRequest>;
  submitReservation(input: InquiryInput): Promise<Reservation>;
  upsertCar(input: UpsertCarInput): Promise<void>;
  deleteCar(carId: string): Promise<void>;
  updateCarPricing(input: UpdateCarPricingInput): Promise<void>;
  upsertSeason(input: UpsertSeasonInput): Promise<Season>;
  deleteSeason(seasonId: string): Promise<void>;
  upsertBlockedDate(input: UpsertBlockedDateInput): Promise<void>;
  deleteBlockedDate(blockedDateId: string): Promise<void>;
  updateQuoteStatus(input: UpdateQuoteStatusInput): Promise<void>;
  updateReservationStatus(input: UpdateReservationStatusInput): Promise<void>;
  updateTenantBranding(input: UpdateTenantBrandingInput): Promise<void>;
  updateTenantTheme(input: UpdateTenantThemeInput): Promise<void>;
  updateTenantContent(input: UpdateTenantContentInput): Promise<void>;
  updateTenantNavigation(input: UpdateTenantNavigationInput): Promise<void>;
  updateTenantSeo(input: UpdateTenantSeoInput): Promise<void>;
  updateTenantLocalization(input: UpdateTenantLocalizationInput): Promise<void>;
  publishTenantSite(): Promise<TenantConfig>;
  reset(): Promise<AppSnapshot>;
}
