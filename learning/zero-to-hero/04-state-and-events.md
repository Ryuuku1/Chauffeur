# 04 - State and User Interaction

## Objective
Use state to create interactive UIs.

## Core idea

UI = function(state)

When state changes, UI re-renders.

## Hooks used often

- `useState` for local state
- `useMemo` for derived data

## In this project

- Customer filters (`category`, `seats`, `budget`) are local state.
- Manager filters and insights are derived from state.

## Exercises

1. Add `isSubmitting` state to offer form.
2. Disable button while submitting.

## Solutions

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);
```

Set true before async submit and false in `finally`.

## Debug tip

If state appears stale, check whether derived values should be wrapped with `useMemo`.
