# Module 2 - Components, Props, and UI Composition

## Goal
Learn to break UI into reusable pieces and pass data/actions via props.

## Outcomes
You can design presentational components and compose them into pages.

## Core concepts (deeper)

- **Presentational vs container logic**: Keep display components focused on rendering.
- **Props are one-way data flow**: Parent passes data down; child does not mutate parent directly.
- **Composition over duplication**: Reuse a generic component with different props/actions.

## In this project

- `src/Chauffeur.Web/src/components/CarCard.tsx`
- `src/Chauffeur.Web/src/components/KpiCards.tsx`
- `src/Chauffeur.Web/src/components/Layout.tsx`

## Exercises

1. Add a `conversionRate` prop in `KpiCards` and render it.
2. Add category badge in `CarCard`.
3. Explain why layout is shared via `<Outlet />`.

## Solutions

1. Extend `KpiCardsProps` with `conversionRate: number` and display `%` in an extra KPI card.
2. In `CarCard`, render something like `<span className="badge">{car.category}</span>` near title.
3. Shared layout avoids repeating headers/nav across pages, keeps navigation consistent, and centralizes shell changes.

## Design tip
If multiple pages need the same small heading style, extract a component like `SectionHeader` rather than copying `<h2>` blocks.

## Challenge
Create `SectionHeader` component with props `{title, subtitle?}` and replace at least two panel headings.
