# Module 1 - React Fundamentals

## Goal
Understand what React is, how rendering works, and how this app starts.

## Outcomes
After this module, you can explain component rendering, JSX, and app bootstrap flow.

## Core concepts (deeper)

- **Declarative UI**: You describe what UI should look like for current state; React handles DOM updates.
- **Component tree**: UI is built as nested functions returning JSX.
- **Root render**: React mounts once into a single DOM node and controls updates from there.
- **StrictMode**: Helps detect unsafe patterns in development.

## In this project

- Bootstrap: `src/Chauffeur.Web/src/main.tsx`
- Root routing entry: `src/Chauffeur.Web/src/App.tsx`
- Global app wrapper: `src/Chauffeur.Web/src/context/AppContext.tsx`

## Learning walk-through

1. `main.tsx` imports global CSS and installs mock API.
2. React mounts inside `#root` from `index.html`.
3. `AppProvider` wraps `App` so all pages can use shared context.

## Exercises

1. Explain what `ReactDOM.createRoot(...).render(...)` does.
2. Why is `AppProvider` around `App` and not inside each page?
3. Why is `styles.css` imported in one place?

## Solutions

1. It creates a React root attached to a DOM element and tells React what top-level component tree to render and maintain.
2. Wrapping once at the top gives all routed pages access to shared data/state/actions without repeating provider setup.
3. Global CSS should be imported once at app entry so styles load consistently and avoid duplicated imports across components.

## Challenge
Create and render a `HelloLearner` component in `HomePage` with a short welcome message.
