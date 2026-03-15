# 11 - Testing, Debugging, and Code Quality

## Objective
Write enough tests to move safely and debug issues faster.

## Layers of testing

- Unit test utilities (`pricing`, `date` helpers)
- Component tests for critical UI behavior
- Flow tests for important user journeys

## In this project

- Vitest configured in `vitest.config.ts`
- Existing example in `src/App.test.ts`

## Exercises

1. Add tests for `getSeasonByDate`.
2. Add API Lab render test.
3. Add manager reservation filter behavior test.

## Solutions

- Create `dateUtils.test.ts` with month-based cases.
- Render components with required providers.
- Simulate changing filter and assert expected rows.

## Debugging playbook

1. Reproduce issue reliably.
2. Check state values in React DevTools.
3. Verify API response shape.
4. Add temporary logs with intent, then remove.
