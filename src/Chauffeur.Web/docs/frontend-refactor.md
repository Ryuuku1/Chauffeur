# Frontend Refactor Blueprint

## Product thinking

### Must-have features
- Premium homepage with trust-building copy, fast availability search, featured fleet, process explanation, testimonials, and FAQ preview.
- Fleet discovery with meaningful filters for event type, category, seat count, transmission, price posture, and date-driven availability.
- Car detail pages with immersive imagery, event fit, extras, indicative pricing, and availability visualization.
- Quote and reservation request flows with inline validation, pricing preview, booking summary, and confirmation states.
- Customer dashboard for request tracking, favorites, and recently viewed vehicles.
- Manager suite for fleet CRUD, reservation handling, quote handling, pricing rules, seasonal configuration, blocked dates, and brand settings.

### High-value nice-to-have features
- Compare tray and comparison page to support higher-consideration decision-making.
- Favorites and recently viewed states to improve conversion over multi-session journeys.
- Sticky compare bar and toast feedback for better perceived responsiveness.
- CMS-like admin settings screen for homepage copy and concierge info.

## Information architecture

### Public routes
- `/`
- `/fleet`
- `/fleet/:slug`
- `/quote-request`
- `/reservation-request`
- `/favorites`
- `/compare`
- `/contact`
- `/faq`
- `/customer/dashboard`
- `/confirmation/:kind/:reference`

### Manager routes
- `/manager/login`
- `/manager/dashboard`
- `/manager/cars`
- `/manager/reservations`
- `/manager/quotes`
- `/manager/pricing`
- `/manager/availability`
- `/manager/settings`

## UX and visual direction
- Visual theme: cinematic luxury with warm metallic accents, dark atelier surfaces, serif display typography, and large photography.
- Public UX: emotional storytelling first, operational clarity second.
- Admin UX: dense enough for speed, but still clean and legible under pressure.
- Motion/perceived performance: skeleton states, sticky compare bar, toast feedback, and elevated hover interactions.

## React architecture

### App layers
- `src/domain`: typed entities, DTO-like contracts, constants, seed data.
- `src/services`: repository interface plus local-storage-backed mock repository.
- `src/state`: centralized app store, UI preferences, auth state, and mutation actions.
- `src/shared`: reusable UI primitives and helpers.
- `src/features`: page-level modules and feature-specific components.
- `src/layouts` and `src/routes`: app shell and route guards.

### State strategy
- Single `AppStoreProvider` for shared snapshot data, manager auth mode, favorites, compare state, recently viewed state, and notifications.
- Repository methods isolate data persistence so the UI can later swap to a .NET-backed implementation without changing page logic.

### API readiness
- `ChauffeurRepository` defines the integration seam for future backend work.
- Domain models avoid coupling components to raw local-storage shapes.
- Inquiry, car, season, settings, and pricing mutations already flow through typed contracts.

## Localization strategy

### Supported locales
- `en`
- `pt-PT`
- `es`
- `fr`
- `de`
- `it`

### Implementation
- `i18next` + `react-i18next` + `i18next-browser-languagedetector`
- locale detection from browser with persistence in local storage
- elegant manual language switcher present in both public and manager layouts
- locale-aware formatting utilities for currency, dates, short dates, numbers, and calendar weekday labels
- translation helpers for enum-like values such as event types, statuses, categories, and contact methods

### Folder structure
- `src/i18n/index.ts`
- `src/i18n/locale.ts`
- `src/i18n/helpers.ts`
- `src/i18n/resources/en.ts`
- `src/i18n/resources/pt-PT.ts`

### Current resource coverage
- English and Portuguese (Portugal) contain the core shared UI, public journey, booking flow, statuses, toast notifications, and manager labels.
- Spanish, French, German, and Italian are registered now and fall back to English until dedicated resources are added.
- Public and manager layouts both expose the same persistent language switcher, and the manager suite pages now consume the same translation + formatting utilities as customer-facing pages.

### Adding more languages later
1. Create a new resource file under `src/i18n/resources/`.
2. Register it in `src/i18n/index.ts`.
3. Add the locale code and native label in `src/i18n/locale.ts`.
4. If needed, expand enum label helpers in `src/i18n/helpers.ts`.
5. Provide backend-localized content for dynamic entities like car stories, testimonials, FAQs, and CMS-managed homepage copy.

## Reusable components delivered
- `CarCard`
- `FilterSidebar`
- `BookingSummary`
- `InquiryForm`
- `AvailabilityCalendar`
- `StatusBadge`
- `MetricCard`
- `DataTable`
- `SeasonEditor`
- `PricingRuleEditor`
- `CarEditorPanel`
- `CompareBar`
- `Modal`
- `ToastViewport`

## Key tradeoffs
- Chose a repository abstraction over a mocked `fetch` layer to keep the frontend simpler while still preserving a clean backend integration seam.
- Kept form handling custom instead of adding a form library so the refactor stays dependency-light and easier to review.
- Used a single shared store instead of multiple nested contexts because this app has cross-cutting concerns like favorites, compare, auth mode, toasts, and shared snapshot data.

## Release hardening audit

### Missing for release hardening
- Template preview before save or publish.
- FAQ and testimonial CRUD instead of seeded read-only content.
- Footer/social/contact editing parity across all public surfaces.
- Compare clear and dismiss controls across every compare entrypoint.
- Wider semantic theme-token coverage for admin chrome and utility surfaces.
- Responsive overflow handling coverage for every data-heavy component.

### High-value next additions
- Live website preview mode from manager settings.
- FAQ and testimonial editors.
- Homepage section ordering controls.
- Asset upload and image-picker flows.
- Compare drawer with mini summaries.
- Customer-side recently viewed shortcut outside the dashboard.
- Draft-versus-published preview or diff banner.
- Richer demand and utilization charts in admin.

## Testing guidance
- Current automated coverage validates pricing and availability logic.
- Next recommended additions:
  - route-level smoke tests
  - inquiry form validation tests
  - manager workflow status transition tests
  - visual regression coverage for public hero and admin tables
