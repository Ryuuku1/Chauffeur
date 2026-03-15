# 06 - Effects, Async Data, and API Thinking

## Objective
Understand side effects and asynchronous data flow.

## Core concepts

- `useEffect` runs side effects after render.
- Async operations should handle loading and error states.
- Keep API calls in dedicated abstractions.

## In this project

- `useAvailability` uses effect to fetch available cars.
- `AppContext` loads initial data via API and exposes actions.
- `appApi.ts` centralizes fetch calls.

## Exercises

1. Add `GET /api/health` endpoint.
2. Show health output in API Lab.

## Solutions

- Mock API: add handler for `/api/health` returning `{status:'ok'}`.
- API client: add `getHealth()`.
- API Lab: button + result rendering.

## Advanced note

Race conditions can happen if multiple async calls return out-of-order; consider cancellation patterns when needed.
