# Module 3 - Routing and Page Architecture

## Goal
Understand how route-driven navigation structures a React app.

## Outcomes
You can add pages, nested routes, and navigation links correctly.

## Core concepts (deeper)

- **Route table** defines app information architecture.
- **Nested layout** separates shared shell from page content.
- **Client-side navigation** avoids full page reloads for faster UX.
- **Fallback routes** handle unknown URLs safely.

## In this project

- Router config: `src/Chauffeur.Web/src/App.tsx`
- Navigation shell: `src/Chauffeur.Web/src/components/Layout.tsx`
- Page components in `src/Chauffeur.Web/src/pages/`

## Exercises

1. Add `/about` route and page component.
2. Add nav link to `/about`.
3. Add fallback explanation text in that page.

## Solutions

1. Create `AboutPage.tsx`, import in `App.tsx`, add `{ path: 'about', element: <AboutPage /> }`.
2. Add `<NavLink to="/about">About</NavLink>` in `Layout.tsx`.
3. In `AboutPage`, include a short paragraph: what the app does and that backend integration is pending.

## Common mistake
Putting route-only logic inside `Layout` instead of router config. Keep route definitions centralized in `App.tsx`.

## Challenge
Add a simple manager guard with boolean `isManager`; if false, redirect `/manager` to `/`.
