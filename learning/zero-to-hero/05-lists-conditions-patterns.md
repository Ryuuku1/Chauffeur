# 05 - Lists, Conditions, and Rendering Patterns

## Objective
Render dynamic collections and conditional UI safely.

## Core patterns

- List rendering with `map`
- Conditional rendering with ternary / logical operators
- Empty-state UX when collections are empty

## In this project

- Car lists use `map`
- Empty states in customer flow and offers inbox
- Conditional sections in manager dashboard

## Exercises

1. Render a no-results card when filtered cars = 0.
2. Add “No upcoming reservations” fallback.

## Solutions

1.

```tsx
{cars.length === 0 ? <EmptyState /> : cars.map(...) }
```

2. Same pattern on manager upcoming list.

## Key rule

Always provide `key` on list items using stable unique IDs.
