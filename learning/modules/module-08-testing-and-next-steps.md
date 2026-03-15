# Module 8 - Quality, Testing, and Next Steps

## Goal
Build confidence in testing strategy and planning production-ready evolution.

## Outcomes
You can choose what to test and write starter tests for core logic/UI.

## Core concepts (deeper)

- **Unit tests**: verify deterministic utility logic quickly.
- **Component tests**: verify render behavior and interactions.
- **Integration tests**: verify flow across component boundaries.
- **Test pyramid**: many unit tests, fewer component tests, few but critical integration/e2e tests.

## In this project

- Existing test: `src/Chauffeur.Web/src/App.test.ts`
- Setup: `src/Chauffeur.Web/src/setupTests.ts`
- Vitest config: `src/Chauffeur.Web/vitest.config.ts`

## Exercises

1. Add tests for `getSeasonByDate`.
2. Add component test for API Lab render.
3. Add manager reservation filter test.

## Solutions

1. Create `dateUtils.test.ts` with date cases for spring/summer/autumn/winter and assert expected season strings.
2. Render `ApiLabPage` with required providers/router; assert endpoints list and smoke-test button are visible.
3. Render manager page with seeded reservations, change filter select to `Pending`, assert only pending rows remain.

## Capstone (recommended)
Build a **Booking Timeline** feature:

- New endpoint in mock API for timeline view.
- API client method + context integration.
- Customer timeline panel and manager grouped timeline panel.
- Tests: utility grouping + UI rendering behavior.

## Production-readiness checklist

- [ ] Lint and tests pass consistently.
- [ ] Key business flows tested (offer request, reservation update).
- [ ] API contracts documented.
- [ ] Error and loading states visible to users.
- [ ] Accessibility basics covered (labels, focus, contrast).
