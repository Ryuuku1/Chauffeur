# Module 7 - Styling and Modern UI Patterns

## Goal
Learn to build maintainable and modern visual systems in React apps.

## Outcomes
You can organize CSS for readability, reuse, and responsive behavior.

## Core concepts (deeper)

- **Design consistency**: consistent spacing, radius, color strategy, typography scale.
- **Visual hierarchy**: hero -> panel -> card -> control.
- **Responsive layout**: use CSS grid/flex with adaptive breakpoints or `auto-fit` patterns.
- **State styling**: disabled, hover, error, empty-state, selected states.
- **Accessibility in style**: visible focus states and adequate contrast.

## In this project

- Global stylesheet: `src/Chauffeur.Web/src/styles.css`
- UI examples across pages in `src/Chauffeur.Web/src/pages/`
- Screenshots docs: `src/Chauffeur.Web/docs/screenshots/*`

## Exercises

1. Add dark/light theme toggle with persistence.
2. Improve keyboard focus visuals for inputs/buttons/links.
3. Add a `status-chip` style for reservation states.

## Solutions

1. Add `theme` state + body class (`theme-dark`/`theme-light`) and store value in localStorage.
2. Add CSS `:focus-visible` styles with outline/box-shadow for interactive elements.
3. Add classes: `.chip-pending`, `.chip-approved`, `.chip-declined` with distinct colors; apply in reservation rows.

## Architecture tip
As styles grow, split by concern:

- `layout.css`
- `components.css`
- `pages.css`
- `utilities.css`

## Challenge
Refactor the current single stylesheet into modular CSS files while preserving visuals.
