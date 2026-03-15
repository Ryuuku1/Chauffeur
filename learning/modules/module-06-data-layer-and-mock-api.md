# Module 6 - Data Layer and Mock API

## Goal
Understand API architecture in frontend projects and why abstraction matters.

## Outcomes
You can add endpoints across mock API + client + UI consistently.

## Core concepts (deeper)

- **API abstraction**: `appApi.ts` isolates fetch details from UI components.
- **Contract-first typing**: DTOs in `types/api.ts` prevent data-shape drift.
- **Mock backend parity**: mock API should resemble real backend behavior and endpoints.
- **Single responsibility**:
  - mock layer handles endpoint behavior,
  - API client handles request calls,
  - context/pages consume client methods.

## In this project

- API client: `src/Chauffeur.Web/src/api/appApi.ts`
- Mock API: `src/Chauffeur.Web/src/mocks/mockApi.ts`
- DTO contracts: `src/Chauffeur.Web/src/types/api.ts`
- Feature usage example: `src/Chauffeur.Web/src/pages/ApiLabPage.tsx`

## Exercises

1. Add `GET /api/health` endpoint.
2. Add `getHealth()` in `appApi.ts`.
3. Add API Lab button to display health response.

## Solutions

1. In mock API request handler, return `{ status: 'ok', source: 'mock-api' }` for `/api/health`.
2. In `appApi.ts`, add `getHealth: () => request<{status: string; source: string}>('/api/health')`.
3. Add button handler in API Lab that awaits `appApi.getHealth()` and displays JSON in result panel.

## Real-backend transition tip
When C# backend is ready, keep UI unchanged and replace only mock interception with real network base URL behavior.

## Challenge
Implement optimistic update for reservation status in manager table before full refresh.
