# 07 - Routing and Multi-Page Architecture

## Objective
Build clean route structures for scalable apps.

## Concepts

- Route config as app navigation map
- Shared layout with nested content
- Fallback route handling

## In this project

- Routes in `App.tsx`
- Shared nav in `Layout.tsx`
- Pages in `/pages`

## Exercises

1. Add About page route.
2. Add nav link for it.
3. Redirect unknown paths to home.

## Solutions

- Add route object in router array.
- Use `<NavLink>` in layout.
- Keep wildcard path (`*`) with `<Navigate to='/' />`.

## Architecture tip

Keep route declarations centralized and page components focused on page logic.
