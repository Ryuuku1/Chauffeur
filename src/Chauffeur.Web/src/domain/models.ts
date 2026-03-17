export type UserRole = 'guest' | 'manager';

export type LocaleCode = 'en' | 'pt' | 'es' | 'fr' | 'de' | 'it';
export type CurrencyCode = 'EUR' | 'USD' | 'GBP';
export type TenantTemplateId =
  | 'classic-luxury'
  | 'modern-minimal'
  | 'cinematic-exotic'
  | 'romantic-wedding';

export type CarCategory = 'Vintage' | 'Exotic';
export type CarStyle = 'Convertible' | 'Grand Tourer' | 'Limousine' | 'Statement';
export type Transmission = 'Automatic' | 'Manual';
export type EventType =
  | 'wedding'
  | 'proposal'
  | 'photoshoot'
  | 'anniversary'
  | 'luxury-transfer'
  | 'corporate'
  | 'other';

export type PreferredContactMethod = 'email' | 'phone' | 'whatsapp';
export type AvailabilityStatus = 'available' | 'booked' | 'pending' | 'blocked' | 'selected';
export type QuoteStatus = 'pending' | 'reviewing' | 'quote-sent' | 'accepted' | 'declined';
export type ReservationStatus =
  | 'pending'
  | 'approved'
  | 'confirmed'
  | 'completed'
  | 'rejected';

export interface LocalizedText {
  en?: string;
  pt?: string;
  es?: string;
  fr?: string;
  de?: string;
  it?: string;
}

export interface CarImage {
  id: string;
  url: string;
  alt: string;
}

export interface CarFeature {
  id: string;
  label: string;
  detail: string;
}

export interface Extra {
  id: string;
  name: string;
  description: string;
  price: number;
  pricingModel: 'fixed' | 'per-hour' | 'per-trip';
  category: 'comfort' | 'styling' | 'service';
}

export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  multiplier: number;
  priority: number;
  tone: string;
}

export interface PriceOverride {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: 'multiplier' | 'explicit-price';
  value: number;
}

export interface PricingProfile {
  currency: CurrencyCode;
  basePrice: number;
  minimumHours: number;
  eventAdjustments: Record<EventType, number>;
  seasonalOverrides: PriceOverride[];
  quoteDisclosure: string;
}

export interface Car {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  style: CarStyle;
  transmission: Transmission;
  seats: number;
  location: string;
  heroImage: string;
  accent: string;
  summary: string;
  story: string;
  tags: string[];
  featured: boolean;
  availabilityBlurb: string;
  images: CarImage[];
  features: CarFeature[];
  suitableEvents: EventType[];
  includedExtraIds: string[];
  pricing: PricingProfile;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
}

export interface AvailabilitySlot {
  id: string;
  carId: string;
  startDate: string;
  endDate: string;
  status: Exclude<AvailabilityStatus, 'available' | 'selected'>;
  source: 'reservation' | 'manual-block';
  label: string;
}

export interface QuoteRequest {
  id: string;
  reference: string;
  customerId: string;
  carId: string;
  eventType: EventType;
  eventDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  pickupLocation: string;
  destination?: string;
  passengerCount: number;
  extraIds: string[];
  notes: string;
  preferredContactMethod: PreferredContactMethod;
  status: QuoteStatus;
  createdAt: string;
  estimatedPrice: number;
}

export interface Reservation {
  id: string;
  reference: string;
  customerId: string;
  carId: string;
  eventType: EventType;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  pickupLocation: string;
  destination?: string;
  passengerCount: number;
  extraIds: string[];
  notes: string;
  preferredContactMethod: PreferredContactMethod;
  status: ReservationStatus;
  createdAt: string;
  estimatedPrice: number;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  quote: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface HowItWorksStep {
  id: string;
  title: string;
  description: string;
}

export interface TenantBranding {
  brandName: string;
  brandShortName: string;
  brandMark: string;
  brandTagline: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  serviceArea: string;
  conciergeHours: string;
  supportDomain: string;
  legalCompanyName: string;
  socialInstagram: string;
  socialFacebook: string;
}

export interface TenantTheme {
  templateId: TenantTemplateId;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceColor: string;
  surfaceSoftColor: string;
  headingFont: string;
  bodyFont: string;
  radiusScale: 'soft' | 'rounded' | 'dramatic';
  density: 'comfortable' | 'compact';
}

export interface HomepageSectionConfig {
  key: 'featuredFleet' | 'valueProps' | 'process' | 'testimonials' | 'faqPreview';
  enabled: boolean;
}

export interface NavigationItemConfig {
  id: 'fleet' | 'favorites' | 'compare' | 'dashboard' | 'faq' | 'contact';
  path: string;
  translationKey: string;
  visible: boolean;
}

export interface FooterColumn {
  id: string;
  heading: LocalizedText;
  body: LocalizedText;
}

export interface TenantContent {
  heroEyebrow: LocalizedText;
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  heroPrimaryCtaLabel: LocalizedText;
  heroSecondaryCtaLabel: LocalizedText;
  availabilityPanelTitle: LocalizedText;
  availabilityPanelHint: LocalizedText;
  trustSectionTitle: LocalizedText;
  trustSectionDescription: LocalizedText;
  footerTagline: LocalizedText;
  footerColumns: FooterColumn[];
  homepageSections: HomepageSectionConfig[];
  legalNotice: LocalizedText;
  quoteAssistanceLabel: LocalizedText;
}

export interface TenantSeo {
  siteTitle: string;
  siteDescription: string;
  keywords: string[];
  ogImageUrl: string;
  themeColor: string;
}

export interface TenantLocalizationSettings {
  defaultLocale: LocaleCode;
  enabledLocales: LocaleCode[];
  currency: CurrencyCode;
}

export interface TenantPublicationState {
  status: 'draft' | 'published';
  lastPublishedAt?: string;
}

export interface TenantConfig {
  id: string;
  slug: string;
  branding: TenantBranding;
  theme: TenantTheme;
  content: TenantContent;
  navigation: NavigationItemConfig[];
  seo: TenantSeo;
  localization: TenantLocalizationSettings;
  publication: TenantPublicationState;
}

export interface AppSnapshot {
  tenant: TenantConfig;
  cars: Car[];
  extras: Extra[];
  seasons: Season[];
  customers: Customer[];
  reservations: Reservation[];
  quotes: QuoteRequest[];
  blockedDates: AvailabilitySlot[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  steps: HowItWorksStep[];
}
