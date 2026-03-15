# 02 - React Basics and JSX

## Objective
Understand what React renders and how JSX maps to component output.

## Key concepts

- Components are functions returning JSX.
- JSX compiles to JavaScript function calls.
- React updates only changed UI parts efficiently.

## Example

```tsx
export const Welcome = () => <h1>Hello React</h1>;
```

## In Chauffeur project

- `src/main.tsx` mounts the app.
- `App.tsx` decides which page component renders.

## Exercises

1. Create a `LearnerBanner` component with title + subtitle.
2. Render it on HomePage.

## Solution

```tsx
export const LearnerBanner = () => (
  <div>
    <h2>Learning React</h2>
    <p>Building confidence step by step.</p>
  </div>
);
```

## Important note

A component must return a single root element (or fragment).
