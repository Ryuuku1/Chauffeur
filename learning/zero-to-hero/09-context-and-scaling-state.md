# 09 - Context, Scaling State, and App Structure

## Objective
Scale beyond simple page state using context and clear layers.

## Concepts

- Context prevents deep prop drilling.
- State updates should be exposed via clean action methods.
- Keep data layer separate from rendering layer.

## In this project

- `AppContext` provides cars/reservations/offers + actions.
- Pages consume context via `useAppContext()`.

## Exercises

1. Add action `refreshState` button to customer page.
2. Add context error boundary message in page UI.

## Solutions

1. Call `refreshState()` from context on button click.
2. Render `error` from context in visible panel message.

## Scale tip

If context becomes too large, split into domain contexts (e.g., CarsContext, OffersContext).
