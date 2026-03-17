# Release-Candidate Hardening Report

## Executive summary

This pass moved the frontend from a single-brand premium demo toward a white-label product foundation.

The highest-value work completed in code:

- Introduced a tenant-driven configuration model for branding, theme, template, SEO, locale, navigation, footer, homepage content, and publication state.
- Rewired public layouts and homepage presentation to read tenant data instead of hardcoded branding.
- Added manager-side white-label controls for brand, template/theme, homepage/navigation content, and SEO metadata.
- Added a tenant presentation bridge that applies theme tokens, template identity, document title, theme color, and locale safety at runtime.
- Hardened shared primitives with better empty-state support, modal behavior, button loading/disabled states, and more design-system-oriented CSS hooks.
- Expanded the i18n layer with additional tenant/admin terminology and cleaner `pt-PT` wording for the new productization surfaces.

## Release hardening audit

### Missing for release hardening

- Template preview before save or publish so managers can sanity-check a palette before committing it.
- FAQ and testimonial CRUD instead of relying on read-only seeded trust content.
- Footer, social, and contact editing coverage that fully matches the public footer/contact surfaces.
- Compare dismiss and clear controls in every compare entrypoint, not just the sticky tray.
- Stronger semantic theme-token coverage across the full admin chrome and supporting utility surfaces.
- Responsive overflow handling verified for every data-heavy component, including future dashboard panels.

### High-value next additions

- Live website preview mode launched directly from manager settings.
- Dedicated testimonial and FAQ editors with localized content support.
- Homepage section ordering controls.
- Asset upload and image-picker flows instead of raw URL-only inputs.
- A compare drawer with mini summaries before entering the full compare page.
- A customer-facing recently viewed entrypoint outside the dashboard.
- Draft-versus-published preview or a lightweight visual diff banner.
- Richer admin demand and utilization charts.

## 1. UI/UX audit report

### Priority 0

1. Hardcoded brand identity in layouts
   - Severity: Critical
   - Type: Design, productization, implementation debt
   - Problem: Brand name, brand mark, footer identity, and manager header identity were previously hardcoded in layouts.
   - Why it was bad: This blocked white-label delivery and made the frontend effectively single-tenant.
   - Fix: Replaced with `tenant.branding`, `tenant.content`, and `tenant.navigation` driven rendering.
   - Status: Addressed

2. No real white-label model
   - Severity: Critical
   - Type: Architecture
   - Problem: The app only had a narrow `settings` object for a few text fields.
   - Why it was bad: There was no scalable place for themes, templates, SEO, locale strategy, footer config, publication state, or brand assets.
   - Fix: Added `TenantConfig`, `TenantBranding`, `TenantTheme`, `TenantContent`, `TenantSeo`, `TenantLocalizationSettings`, and `TenantPublicationState`.
   - Status: Addressed

3. Admin settings too shallow for client delivery
   - Severity: Critical
   - Type: Product, UX
   - Problem: The manager area could not actually control brand, template, white-label content, or metadata in a structured way.
   - Why it was bad: The product could not credibly be sold to multiple customers.
   - Fix: Added dedicated manager pages for brand, theme/template, content/navigation, and SEO.
   - Status: Addressed

### Priority 1

4. Shared design system drift
   - Severity: High
   - Type: Design system
   - Problem: Styling relied on a single large stylesheet with limited token abstraction and inconsistent semantic naming.
   - Why it was bad: This invites spacing drift, button inconsistency, weak theming, and hard-to-control visual evolution.
   - Fix: Introduced tenant theme application via runtime CSS variables and expanded semantic token usage around buttons, surfaces, radii, and template skins.
   - Status: Partially addressed

5. Shared components underpowered for production
   - Severity: High
   - Type: UX, accessibility
   - Problem: Button, modal, table, and toast components lacked stronger state handling and reusable product-grade behavior.
   - Why it was bad: These are the building blocks of the whole app, so weaknesses amplify across all screens.
   - Fix:
     - `Button` now supports loading and disabled states more cleanly.
     - `Modal` now supports Escape close and better accessible labeling.
     - `DataTable` supports captions, row keys, and empty states.
     - `ToastViewport` now uses translated dismiss labeling.
   - Status: Addressed

6. Homepage was still single-brand and partially static
   - Severity: High
   - Type: Design, white-label readiness
   - Problem: Hero copy, CTA labels, and section identity were still effectively owned by translation files and hardcoded layout assumptions.
   - Why it was bad: Different clients need different positioning and emphasis, especially in emotional event businesses.
   - Fix: Homepage now consumes tenant copy, template styling, and section visibility.
   - Status: Addressed

7. Locale and currency configuration were not tenant-aware
   - Severity: High
   - Type: Localization, productization
   - Problem: Locale support existed, but enabled locales and default currency were not controlled as tenant data.
   - Why it was bad: Multi-client deployments often have different locale and currency requirements.
   - Fix: Added tenant localization settings and language switcher filtering by enabled locales; currency formatting now follows tenant currency.
   - Status: Addressed

### Priority 2

8. Tables and admin views still feel utilitarian rather than premium
   - Severity: Medium
   - Type: Design, UX
   - Problem: Data-heavy admin screens still depend on simple table rendering with limited density controls, no sticky headers, and minimal row affordance.
   - Why it is bad: Operational software needs fast scanning and clearer hierarchy.
   - Recommended next step: add sticky table headers, sortable headers, row hover emphasis, and mobile stacked-row treatment.
   - Status: Remaining

9. Filters are functional but still visually basic
   - Severity: Medium
   - Type: UX, design
   - Problem: Fleet filters still use simple range/select/input treatments and lack stronger visual grouping.
   - Why it is bad: Discovery is a primary conversion flow.
   - Recommended next step: convert filter groups into richer fieldsets with stronger labels, chip summaries, and an active-filter bar.
   - Status: Remaining

10. FAQ/testimonial editing is not yet a full CMS
    - Severity: Medium
    - Type: Productization
    - Problem: The tenant content foundation exists, but testimonial and FAQ item CRUD are still separate seeded entities.
    - Why it is bad: A sellable white-label product should let managers control trust content directly.
    - Recommended next step: add dedicated FAQ/testimonial collection editors with reorder, localized fields, and publish history.
    - Status: Remaining

11. No true preview/publish workflow history
    - Severity: Medium
    - Type: Product, implementation debt
    - Problem: Publication is modeled, but draft/published diffing, audit history, and revert are not implemented.
    - Why it is bad: Client-facing CMS controls usually need safer release tooling.
    - Recommended next step: add published snapshot persistence, preview URL/session mode, and audit log surfaces.
    - Status: Remaining

12. Some public copy entities are still seeded in English only
    - Severity: Medium
    - Type: Localization
    - Problem: FAQs, testimonials, and car stories remain data-driven strings rather than fully localized tenant-managed content.
    - Why it is bad: The infrastructure is more mature than the current content source.
    - Recommended next step: move those entities to localized content blocks or backend-managed localized records.
    - Status: Remaining

## 2. Component review

### Shared primitives

- `Button`
  - Improved with clearer state handling, but a future icon API and stronger variant tokens would help.
- `Modal`
  - Improved for keyboard dismissal and translation-safe close labeling.
- `DataTable`
  - Better foundation now, but still needs sorting, empty table states across all admin pages, and mobile collapse behavior.
- `ToastViewport`
  - Now translation-safe, but still visually simple and without severity-specific variants.
- `SectionHeading`
  - Good abstraction; could later support size variants for denser admin sections.
- `LanguageSwitcher`
  - Now tenant-aware for enabled locales, which is necessary for real deployments.

### Feature components

- `CarCard`
  - Stronger after localization helpers, but card action density is still slightly high on smaller screens.
- `AvailabilityCalendar`
  - Solid baseline, but a fuller legend/tooltip system and keyboard navigation would improve it.
- `InquiryForm`
  - Good structure and summary pairing; still needs real datepicker strategy and per-field help text from tenant content.
- `CompareBar`
  - Works well as a premium utility, but could use a clearer collapse behavior on very small screens.

## 3. Refactor strategy

### Fix first

- Remove all remaining hardcoded brand assumptions
- Keep white-label settings and rendering paths tenant-driven
- Treat admin website controls as first-class product surfaces, not misc settings

### Standardize next

- Move more component states into shared primitives
- Consolidate form field patterns and validation presentation
- Normalize admin table behavior and page toolbars

### Remove or reduce

- Ad-hoc layout-specific copy decisions inside page components
- Any remaining one-brand assumptions in documentation or seeded UI language
- Generic "settings" thinking in favor of clear product areas: brand, theme, content, SEO

## 4. White-label architecture proposal

### Core model

- `TenantConfig`
  - branding
  - theme
  - content
  - navigation
  - seo
  - localization
  - publication

### Runtime flow

1. Repository loads a tenant-specific snapshot
2. Store exposes tenant config alongside operational data
3. `TenantPresentationBridge` applies theme tokens, template identity, favicon, and metadata
4. Public layouts/pages render tenant branding and localized tenant content
5. Manager pages mutate tenant sub-areas through typed update contracts

### Why this direction

- Future .NET integration can map directly to tenant endpoints
- Tenants can share business flows while diverging in brand and presentation
- Localized tenant content can evolve independently from product UI translations

## 5. Manager-side customization proposal

### Implemented now

- Brand settings
- Localization defaults
- Theme/template settings
- Homepage copy controls
- Homepage section visibility
- Navigation visibility
- SEO settings
- Publish action with publication state

### Recommended next additions

- FAQ manager
- Testimonial manager
- Footer column editor with reorder
- Legal pages editor
- Homepage section reorder
- Template preview snapshots
- Published history and revert

## 6. Template system proposal

### Implemented foundation

- `TenantTheme.templateId`
- `tenantTemplates` registry
- Template-driven CSS hooks via `data-template`
- Shared logic across all templates, with visual differentiation in hero/background/button styling

### Scaling pattern

- Shared business flows remain in feature pages
- Template identity influences tokens, visual treatments, and composition toggles
- If future templates require bigger structural divergence, introduce template-specific composition wrappers rather than duplicating logic pages

## 7. Translation quality pass

### Improvements made

- Added tenant/admin white-label terminology in `en` and `pt-PT`
- Reframed manager language around productization rather than generic settings
- Improved pt-PT phrasing for publication, branding, theme, and content management
- Added safer keys for new actions and publication states

### Remaining translation risks

- Seeded FAQs, testimonials, and vehicle stories are not yet localized collections
- `es`, `fr`, `de`, and `it` still fall back to English resources
- Some seeded business copy should eventually be reviewed by native-language product copywriters

## 8. Design system proposal

### Current enforced standards

- Runtime theme tokens for brand colors, fonts, radii, and template identity
- Shared button variants and loading/disabled behavior
- Shared panel/card/surface language
- Consistent container widths and grid foundations
- Template-aware styling through CSS variables and data attributes

### Next standards to formalize

- Explicit typography scale tokens beyond heading tags
- Form field states and helper/error placements as dedicated classes
- Table density and row state patterns
- Empty state illustration and message system
- Motion tokens for page reveals and overlays

## 9. Honest readiness review

### Now close to release-candidate quality

- Public and manager apps feel more like one product system
- White-label brand/theme/content control is now real instead of aspirational
- Tenant-driven rendering is in place for the main identity surfaces
- Shared component quality is more reliable
- Translation architecture remains compatible with further scale

### Still needs backend support

- True tenant persistence/API boundaries
- File upload endpoints for logos, favicons, hero media, gallery assets
- Published vs draft versioning and audit history
- Localized dynamic content from server records
- Real auth and role enforcement

### Still needs manual QA

- Cross-browser layout and `color-mix` support validation
- Responsive QA across public/admin screens
- Long-content localization QA in all supported locales
- Keyboard and screen-reader pass on modals, tables, and navigation

### Still needs real-world testing

- Booking conversion behavior with real customers
- Manager workflow speed during high-volume periods
- Template desirability across different client segments
- Final copy approval by native speakers, especially `pt-PT`
