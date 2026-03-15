# 01 - Mindset, Setup, and JavaScript Prerequisites

## Objective
Start with the right mindset and essential prerequisites so React feels natural, not magical.

## Mindset first

- React is **just JavaScript + UI patterns**.
- You do not need to memorize everything; you need to understand data flow.
- Focus on fundamentals before advanced libraries.

## What you should know in JavaScript

- Variables, functions, objects, arrays
- Array methods: `map`, `filter`, `find`, `reduce`
- Destructuring (`const {a} = obj`)
- Template literals
- Async basics (`Promise`, `async/await`)

## Environment setup

In this repo, frontend lives in `src/Chauffeur.Web`.

Core files:

- `package.json` scripts
- `src/main.tsx` entry
- `src/App.tsx` route root

## Exercise

1. Explain what `map` vs `filter` does.
2. Write a function that returns only cars with seats >= 4.

## Solutions

1. `map` transforms each element; `filter` keeps/removes elements by condition.
2.

```ts
const familyCars = cars.filter((car) => car.seats >= 4);
```

## Beginner trap

Trying to learn React without practicing JavaScript operations will slow you down.
