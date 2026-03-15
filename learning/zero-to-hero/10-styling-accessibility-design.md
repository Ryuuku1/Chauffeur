# 10 - Styling, Accessibility, and Design Systems

## Objective
Build modern UIs that are also usable and maintainable.

## Concepts

- Design tokens (colors, spacing, radius)
- Reusable classes for common patterns
- Accessibility states (focus, contrast, labels)

## In this project

- Main style file: `src/Chauffeur.Web/src/styles.css`

## Exercises

1. Add visible `:focus-visible` styles for inputs/buttons.
2. Add status chips for reservation states.
3. Split styles into multiple files for maintainability.

## Solutions

- Add outline/box-shadow on focus.
- Add `.chip-pending/.chip-approved/.chip-declined`.
- Create `layout.css`, `components.css`, `utilities.css`, import from `main.tsx`.

## Accessibility checklist

- Labels connected to controls
- Keyboard navigable
- Sufficient text/background contrast
