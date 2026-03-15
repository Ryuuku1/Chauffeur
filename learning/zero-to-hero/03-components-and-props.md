# 03 - Components and Props

## Objective
Learn reusable UI through components + props.

## Why components matter

- Reuse logic and styling
- Make code smaller and easier to maintain
- Improve collaboration across teams

## Props pattern

Parent -> passes data/action -> Child renders/uses it.

## In this project

- `CarCard` gets `car`, `selectedDate`, and optional `actions`.
- `KpiCards` receives dashboard values.

## Exercises

1. Add a prop to show `featured` state in `CarCard`.
2. Add one new KPI metric.

## Solutions

1.

```tsx
interface CarCardProps { featured?: boolean }
```

Then conditionally render badge.

2. Extend props interface and render new block.

## Tip

If two components share repeated markup, extract a third reusable component.
