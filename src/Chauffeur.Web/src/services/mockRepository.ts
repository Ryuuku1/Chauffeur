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
import { initialSnapshot } from '@/domain/mockData';
import type { AppSnapshot, Car, Customer, QuoteRequest, Reservation, Season, TenantConfig } from '@/domain/models';
import { getPriceEstimate } from '@/utils/pricing';
import type { ChauffeurRepository } from './repository';

const storageKey = 'chauffeur-premium-db';

const createReference = (prefix: string): string => `${prefix}-${Math.floor(10000 + Math.random() * 89999)}`;

const cloneSnapshot = (): AppSnapshot => JSON.parse(JSON.stringify(initialSnapshot)) as AppSnapshot;

const normalizeLocalizedTextMap = <T extends object>(value: T): T => {
  const source = value as T & { 'pt-PT'?: unknown; pt?: unknown };

  if (source['pt-PT'] !== undefined && source.pt === undefined) {
    return {
      ...source,
      pt: source['pt-PT'],
    } as T;
  }

  return value;
};

const hydrateSnapshot = (persisted: unknown): AppSnapshot => {
  const fallback = cloneSnapshot();

  if (!persisted || typeof persisted !== 'object') {
    return fallback;
  }

  const raw = persisted as Record<string, unknown>;
  const next: AppSnapshot = {
    ...fallback,
    cars: Array.isArray(raw.cars) ? (raw.cars as AppSnapshot['cars']) : fallback.cars,
    extras: Array.isArray(raw.extras) ? (raw.extras as AppSnapshot['extras']) : fallback.extras,
    seasons: Array.isArray(raw.seasons) ? (raw.seasons as AppSnapshot['seasons']) : fallback.seasons,
    customers: Array.isArray(raw.customers) ? (raw.customers as AppSnapshot['customers']) : fallback.customers,
    reservations: Array.isArray(raw.reservations) ? (raw.reservations as AppSnapshot['reservations']) : fallback.reservations,
    quotes: Array.isArray(raw.quotes) ? (raw.quotes as AppSnapshot['quotes']) : fallback.quotes,
    blockedDates: Array.isArray(raw.blockedDates) ? (raw.blockedDates as AppSnapshot['blockedDates']) : fallback.blockedDates,
    testimonials: Array.isArray(raw.testimonials) ? (raw.testimonials as AppSnapshot['testimonials']) : fallback.testimonials,
    faqs: Array.isArray(raw.faqs) ? (raw.faqs as AppSnapshot['faqs']) : fallback.faqs,
    steps: Array.isArray(raw.steps) ? (raw.steps as AppSnapshot['steps']) : fallback.steps,
    tenant: fallback.tenant,
  };

  const tenant = raw.tenant && typeof raw.tenant === 'object' ? (raw.tenant as Record<string, unknown>) : null;
  const legacySettings = raw.settings && typeof raw.settings === 'object' ? (raw.settings as Record<string, unknown>) : null;

  if (tenant) {
    const branding = tenant.branding && typeof tenant.branding === 'object' ? (tenant.branding as Record<string, unknown>) : {};
    const theme = tenant.theme && typeof tenant.theme === 'object' ? (tenant.theme as Record<string, unknown>) : {};
    const content = tenant.content && typeof tenant.content === 'object' ? (tenant.content as Record<string, unknown>) : {};
    const localization =
      tenant.localization && typeof tenant.localization === 'object'
        ? (tenant.localization as Record<string, unknown>)
        : {};

    next.tenant = {
      ...fallback.tenant,
      ...tenant,
      branding: { ...fallback.tenant.branding, ...branding },
      theme: { ...fallback.tenant.theme, ...theme },
      content: {
        ...fallback.tenant.content,
        ...content,
        heroEyebrow: normalizeLocalizedTextMap({
          ...fallback.tenant.content.heroEyebrow,
          ...(content.heroEyebrow as Record<string, unknown> | undefined),
        }),
        heroTitle: normalizeLocalizedTextMap({
          ...fallback.tenant.content.heroTitle,
          ...(content.heroTitle as Record<string, unknown> | undefined),
        }),
        heroSubtitle: normalizeLocalizedTextMap({
          ...fallback.tenant.content.heroSubtitle,
          ...(content.heroSubtitle as Record<string, unknown> | undefined),
        }),
        heroPrimaryCtaLabel: normalizeLocalizedTextMap({
          ...fallback.tenant.content.heroPrimaryCtaLabel,
          ...(content.heroPrimaryCtaLabel as Record<string, unknown> | undefined),
        }),
        heroSecondaryCtaLabel: normalizeLocalizedTextMap({
          ...fallback.tenant.content.heroSecondaryCtaLabel,
          ...(content.heroSecondaryCtaLabel as Record<string, unknown> | undefined),
        }),
        availabilityPanelTitle: normalizeLocalizedTextMap({
          ...fallback.tenant.content.availabilityPanelTitle,
          ...(content.availabilityPanelTitle as Record<string, unknown> | undefined),
        }),
        availabilityPanelHint: normalizeLocalizedTextMap({
          ...fallback.tenant.content.availabilityPanelHint,
          ...(content.availabilityPanelHint as Record<string, unknown> | undefined),
        }),
        trustSectionTitle: normalizeLocalizedTextMap({
          ...fallback.tenant.content.trustSectionTitle,
          ...(content.trustSectionTitle as Record<string, unknown> | undefined),
        }),
        trustSectionDescription: normalizeLocalizedTextMap({
          ...fallback.tenant.content.trustSectionDescription,
          ...(content.trustSectionDescription as Record<string, unknown> | undefined),
        }),
        footerTagline: normalizeLocalizedTextMap({
          ...fallback.tenant.content.footerTagline,
          ...(content.footerTagline as Record<string, unknown> | undefined),
        }),
        legalNotice: normalizeLocalizedTextMap({
          ...fallback.tenant.content.legalNotice,
          ...(content.legalNotice as Record<string, unknown> | undefined),
        }),
        quoteAssistanceLabel: normalizeLocalizedTextMap({
          ...fallback.tenant.content.quoteAssistanceLabel,
          ...(content.quoteAssistanceLabel as Record<string, unknown> | undefined),
        }),
        footerColumns: Array.isArray(content.footerColumns)
          ? (content.footerColumns as AppSnapshot['tenant']['content']['footerColumns']).map((column) => ({
              ...column,
              heading: normalizeLocalizedTextMap(column.heading),
              body: normalizeLocalizedTextMap(column.body),
            }))
          : fallback.tenant.content.footerColumns,
        homepageSections: Array.isArray(content.homepageSections)
          ? (content.homepageSections as AppSnapshot['tenant']['content']['homepageSections'])
          : fallback.tenant.content.homepageSections,
      },
      localization: {
        ...fallback.tenant.localization,
        ...localization,
        defaultLocale:
          localization.defaultLocale === 'pt-PT'
            ? 'pt'
            : (localization.defaultLocale as AppSnapshot['tenant']['localization']['defaultLocale']) ??
              fallback.tenant.localization.defaultLocale,
        enabledLocales: Array.isArray(localization.enabledLocales)
          ? (localization.enabledLocales as string[]).map((locale) => (locale === 'pt-PT' ? 'pt' : locale)) as AppSnapshot['tenant']['localization']['enabledLocales']
          : fallback.tenant.localization.enabledLocales,
      },
    };
  } else if (legacySettings) {
    next.tenant = {
      ...fallback.tenant,
      branding: {
        ...fallback.tenant.branding,
        brandTagline:
          (legacySettings.brandTagline as string | undefined) ?? fallback.tenant.branding.brandTagline,
        contactEmail:
          (legacySettings.contactEmail as string | undefined) ?? fallback.tenant.branding.contactEmail,
        contactPhone:
          (legacySettings.contactPhone as string | undefined) ?? fallback.tenant.branding.contactPhone,
        whatsapp: (legacySettings.whatsapp as string | undefined) ?? fallback.tenant.branding.whatsapp,
        serviceArea:
          (legacySettings.studioLocation as string | undefined) ?? fallback.tenant.branding.serviceArea,
        conciergeHours:
          (legacySettings.conciergeHours as string | undefined) ?? fallback.tenant.branding.conciergeHours,
      },
      content: {
        ...fallback.tenant.content,
        heroTitle: {
          ...fallback.tenant.content.heroTitle,
          en: (legacySettings.heroTitle as string | undefined) ?? fallback.tenant.content.heroTitle.en,
        },
        heroSubtitle: {
          ...fallback.tenant.content.heroSubtitle,
          en:
            (legacySettings.heroSubtitle as string | undefined) ??
            fallback.tenant.content.heroSubtitle.en,
        },
      },
    };
  }

  return next;
};

const loadSnapshot = (): AppSnapshot => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    const snapshot = cloneSnapshot();
    localStorage.setItem(storageKey, JSON.stringify(snapshot));
    return snapshot;
  }

  try {
    const snapshot = hydrateSnapshot(JSON.parse(raw));
    saveSnapshot(snapshot);
    return snapshot;
  } catch {
    const snapshot = cloneSnapshot();
    localStorage.setItem(storageKey, JSON.stringify(snapshot));
    return snapshot;
  }
};

const saveSnapshot = (snapshot: AppSnapshot): void => {
  localStorage.setItem(storageKey, JSON.stringify(snapshot));
};

const withLatency = async <T>(value: T): Promise<T> => {
  await new Promise((resolve) => setTimeout(resolve, 180));
  return value;
};

const ensureCustomer = (snapshot: AppSnapshot, input: InquiryInput): Customer => {
  const existing = snapshot.customers.find((customer) => customer.email === input.email);
  if (existing) {
    return existing;
  }

  const nextCustomer: Customer = {
    id: `customer-${crypto.randomUUID()}`,
    name: input.customerName,
    email: input.email,
    phone: input.phone,
    city: input.pickupLocation,
  };

  snapshot.customers = [nextCustomer, ...snapshot.customers];
  return nextCustomer;
};

const createCarEntity = (snapshot: AppSnapshot, input: UpsertCarInput, existing?: Car): Car => ({
  id: existing?.id ?? `car-${crypto.randomUUID()}`,
  slug: input.slug,
  name: input.name,
  brand: input.brand,
  model: input.model,
  year: input.year,
  category: input.category,
  style: input.style,
  transmission: input.transmission,
  seats: input.seats,
  location: input.location,
  heroImage: input.heroImage,
  accent: input.accent,
  summary: input.summary,
  story: input.story,
  tags: input.tags,
  featured: input.featured,
  availabilityBlurb: input.availabilityBlurb,
  images: input.imageUrls.map((url, index) => ({
    id: `${existing?.id ?? input.slug}-image-${index}`,
    url,
    alt: `${input.name} gallery image ${index + 1}`,
  })),
  features:
    existing?.features ?? [
      {
        id: `${input.slug}-feature-1`,
        label: 'Tailored arrival',
        detail: 'Configured around event timing and guest flow.',
      },
      {
        id: `${input.slug}-feature-2`,
        label: 'Premium presentation',
        detail: 'Maintained to photography-ready standards.',
      },
    ],
  suitableEvents: input.suitableEvents,
  includedExtraIds: input.includedExtraIds,
  pricing: {
    currency: snapshot.tenant.localization.currency,
    basePrice: input.basePrice,
    minimumHours: input.minimumHours,
    eventAdjustments: input.eventAdjustments,
    seasonalOverrides: existing?.pricing.seasonalOverrides ?? [],
    quoteDisclosure:
      existing?.pricing.quoteDisclosure ??
      'Final pricing depends on route, event production needs, and requested hold time.',
  },
});

class LocalStorageRepository implements ChauffeurRepository {
  async getSnapshot(): Promise<AppSnapshot> {
    return withLatency(loadSnapshot());
  }

  async submitQuote(input: InquiryInput): Promise<QuoteRequest> {
    const snapshot = loadSnapshot();
    const customer = ensureCustomer(snapshot, input);
    const car = snapshot.cars.find((item) => item.id === input.carId);

    if (!car) {
      throw new Error('Selected car was not found.');
    }

    const selectedExtras = snapshot.extras.filter((extra) => input.extraIds.includes(extra.id));
    const estimate = getPriceEstimate(snapshot, {
      car,
      eventType: input.eventType,
      date: input.eventDate,
      endDate: input.endDate,
      selectedExtras,
    });

    const quote: QuoteRequest = {
      id: `quote-${crypto.randomUUID()}`,
      reference: createReference('QTE'),
      customerId: customer.id,
      carId: input.carId,
      eventType: input.eventType,
      eventDate: input.eventDate,
      endDate: input.endDate,
      startTime: input.startTime,
      endTime: input.endTime,
      pickupLocation: input.pickupLocation,
      destination: input.destination,
      passengerCount: input.passengerCount,
      extraIds: input.extraIds,
      notes: input.notes,
      preferredContactMethod: input.preferredContactMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedPrice: estimate.total,
    };

    snapshot.quotes = [quote, ...snapshot.quotes];
    saveSnapshot(snapshot);

    return withLatency(quote);
  }

  async submitReservation(input: InquiryInput): Promise<Reservation> {
    const snapshot = loadSnapshot();
    const customer = ensureCustomer(snapshot, input);
    const car = snapshot.cars.find((item) => item.id === input.carId);

    if (!car) {
      throw new Error('Selected car was not found.');
    }

    const selectedExtras = snapshot.extras.filter((extra) => input.extraIds.includes(extra.id));
    const estimate = getPriceEstimate(snapshot, {
      car,
      eventType: input.eventType,
      date: input.eventDate,
      endDate: input.endDate,
      selectedExtras,
    });

    const reservation: Reservation = {
      id: `reservation-${crypto.randomUUID()}`,
      reference: createReference('RES'),
      customerId: customer.id,
      carId: input.carId,
      eventType: input.eventType,
      startDate: input.eventDate,
      endDate: input.endDate ?? input.eventDate,
      startTime: input.startTime,
      endTime: input.endTime,
      pickupLocation: input.pickupLocation,
      destination: input.destination,
      passengerCount: input.passengerCount,
      extraIds: input.extraIds,
      notes: input.notes,
      preferredContactMethod: input.preferredContactMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedPrice: estimate.total,
    };

    snapshot.reservations = [reservation, ...snapshot.reservations];
    saveSnapshot(snapshot);

    return withLatency(reservation);
  }

  async upsertCar(input: UpsertCarInput): Promise<void> {
    const snapshot = loadSnapshot();
    const existing = snapshot.cars.find((car) => car.id === input.id);
    const nextCar = createCarEntity(snapshot, input, existing);

    snapshot.cars = existing
      ? snapshot.cars.map((car) => (car.id === existing.id ? nextCar : car))
      : [nextCar, ...snapshot.cars];

    saveSnapshot(snapshot);
    await withLatency(undefined);
  }

  async deleteCar(carId: string): Promise<void> {
    const snapshot = loadSnapshot();
    snapshot.cars = snapshot.cars.filter((car) => car.id !== carId);
    snapshot.quotes = snapshot.quotes.filter((quote) => quote.carId !== carId);
    snapshot.reservations = snapshot.reservations.filter((reservation) => reservation.carId !== carId);
    snapshot.blockedDates = snapshot.blockedDates.filter((blockedDate) => blockedDate.carId !== carId);
    saveSnapshot(snapshot);
    await withLatency(undefined);
  }

  async updateCarPricing(input: UpdateCarPricingInput): Promise<void> {
    const snapshot = loadSnapshot();
    snapshot.cars = snapshot.cars.map((car) =>
      car.id === input.carId
        ? {
            ...car,
            pricing: {
              ...car.pricing,
              basePrice: input.basePrice,
              minimumHours: input.minimumHours,
              eventAdjustments: input.eventAdjustments,
            },
          }
        : car,
    );
    saveSnapshot(snapshot);
    await withLatency(undefined);
  }

  async upsertSeason(input: UpsertSeasonInput): Promise<Season> {
    const snapshot = loadSnapshot();
    const season: Season = {
      id: input.id ?? `season-${crypto.randomUUID()}`,
      name: input.name,
      startDate: input.startDate,
      endDate: input.endDate,
      multiplier: input.multiplier,
      priority: input.priority,
      tone: input.tone,
    };

    snapshot.seasons = input.id
      ? snapshot.seasons.map((item) => (item.id === input.id ? season : item))
      : [season, ...snapshot.seasons];
    saveSnapshot(snapshot);

    return withLatency(season);
  }

  async deleteSeason(seasonId: string): Promise<void> {
    const snapshot = loadSnapshot();
    snapshot.seasons = snapshot.seasons.filter((season) => season.id !== seasonId);
    saveSnapshot(snapshot);
    await withLatency(undefined);
  }

  async upsertBlockedDate(input: UpsertBlockedDateInput): Promise<void> {
    const snapshot = loadSnapshot();
    const blockedDate = {
      id: input.id ?? `blocked-${crypto.randomUUID()}`,
      carId: input.carId,
      startDate: input.startDate,
      endDate: input.endDate,
      status: 'blocked' as const,
      source: 'manual-block' as const,
      label: input.label,
    };

    snapshot.blockedDates = input.id
      ? snapshot.blockedDates.map((item) => (item.id === input.id ? blockedDate : item))
      : [blockedDate, ...snapshot.blockedDates];

    saveSnapshot(snapshot);
    await withLatency(undefined);
  }

  async deleteBlockedDate(blockedDateId: string): Promise<void> {
    const snapshot = loadSnapshot();
    snapshot.blockedDates = snapshot.blockedDates.filter((item) => item.id !== blockedDateId);
    saveSnapshot(snapshot);
    await withLatency(undefined);
  }

  async updateQuoteStatus(input: UpdateQuoteStatusInput): Promise<void> {
    const snapshot = loadSnapshot();
    snapshot.quotes = snapshot.quotes.map((quote) =>
      quote.id === input.quoteId ? { ...quote, status: input.status } : quote,
    );
    saveSnapshot(snapshot);
    await withLatency(undefined);
  }

  async updateReservationStatus(input: UpdateReservationStatusInput): Promise<void> {
    const snapshot = loadSnapshot();
    snapshot.reservations = snapshot.reservations.map((reservation) =>
      reservation.id === input.reservationId ? { ...reservation, status: input.status } : reservation,
    );
    saveSnapshot(snapshot);
    await withLatency(undefined);
  }

  async updateTenantBranding(input: UpdateTenantBrandingInput): Promise<void> {
    const snapshot = loadSnapshot();
    snapshot.tenant = {
      ...snapshot.tenant,
      branding: input,
      publication: { ...snapshot.tenant.publication, status: 'draft' },
    };
    saveSnapshot(snapshot);
    await withLatency(undefined);
  }

  async updateTenantTheme(input: UpdateTenantThemeInput): Promise<void> {
    const snapshot = loadSnapshot();
    snapshot.tenant = {
      ...snapshot.tenant,
      theme: input,
      publication: { ...snapshot.tenant.publication, status: 'draft' },
    };
    snapshot.cars = snapshot.cars.map((car) => ({
      ...car,
      pricing: {
        ...car.pricing,
        currency: snapshot.tenant.localization.currency,
      },
    }));
    saveSnapshot(snapshot);
    await withLatency(undefined);
  }

  async updateTenantContent(input: UpdateTenantContentInput): Promise<void> {
    const snapshot = loadSnapshot();
    snapshot.tenant = {
      ...snapshot.tenant,
      content: input,
      publication: { ...snapshot.tenant.publication, status: 'draft' },
    };
    saveSnapshot(snapshot);
    await withLatency(undefined);
  }

  async updateTenantNavigation(input: UpdateTenantNavigationInput): Promise<void> {
    const snapshot = loadSnapshot();
    snapshot.tenant = {
      ...snapshot.tenant,
      navigation: input,
      publication: { ...snapshot.tenant.publication, status: 'draft' },
    };
    saveSnapshot(snapshot);
    await withLatency(undefined);
  }

  async updateTenantSeo(input: UpdateTenantSeoInput): Promise<void> {
    const snapshot = loadSnapshot();
    snapshot.tenant = {
      ...snapshot.tenant,
      seo: input,
      publication: { ...snapshot.tenant.publication, status: 'draft' },
    };
    saveSnapshot(snapshot);
    await withLatency(undefined);
  }

  async updateTenantLocalization(input: UpdateTenantLocalizationInput): Promise<void> {
    const snapshot = loadSnapshot();
    snapshot.tenant = {
      ...snapshot.tenant,
      localization: input,
      publication: { ...snapshot.tenant.publication, status: 'draft' },
    };
    snapshot.cars = snapshot.cars.map((car) => ({
      ...car,
      pricing: {
        ...car.pricing,
        currency: input.currency,
      },
    }));
    saveSnapshot(snapshot);
    await withLatency(undefined);
  }

  async publishTenantSite(): Promise<TenantConfig> {
    const snapshot = loadSnapshot();
    snapshot.tenant = {
      ...snapshot.tenant,
      publication: {
        status: 'published',
        lastPublishedAt: new Date().toISOString(),
      },
    };
    saveSnapshot(snapshot);
    return withLatency(snapshot.tenant);
  }

  async reset(): Promise<AppSnapshot> {
    const snapshot = cloneSnapshot();
    saveSnapshot(snapshot);
    return withLatency(snapshot);
  }
}

export const mockRepository = new LocalStorageRepository();
