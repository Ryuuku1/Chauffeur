# Module 4 - State, Hooks, and Context

## Goal
Learn when to use local state vs shared state, and how hooks coordinate data.

## Outcomes
You can model UI state clearly and avoid unnecessary complexity.

## Core concepts (deeper)

- **Local state (`useState`)**: UI-specific controls (input fields, filters, toggles).
- **Derived state (`useMemo`)**: computed values from existing state (filtered lists, metrics).
- **Effects (`useEffect`)**: async work / subscriptions tied to dependencies.
- **Context**: app-level shared state + actions, avoiding deep prop drilling.

## In this project

- Shared context: `src/Chauffeur.Web/src/context/AppContext.tsx`
- Availability hook: `src/Chauffeur.Web/src/hooks/useAvailability.ts`
- Local page state:
  - `src/Chauffeur.Web/src/pages/CustomerPage.tsx`
  - `src/Chauffeur.Web/src/pages/ManagerPage.tsx`

## Exercises

1. Add toggle “Top-rated only” in customer page (mock value).
2. Add collapsible panel state in manager page.
3. Explain context vs page-local state.

## Solutions

1. Add `const [topRatedOnly, setTopRatedOnly] = useState(false)` and include it in filter logic.
2. Add `const [showPricingPanel, setShowPricingPanel] = useState(true)`; conditionally render pricing section.
3. Context state is shared and reusable across pages/components. Local state is temporary and relevant only to one component/page.

## Good practice
Keep business operations (fetch/update/reset) in context/API layer, not in every page component.

## Challenge
Extract manager metrics (`utilization`, `mostCommonEventType`) into `useDashboardInsights` hook.
