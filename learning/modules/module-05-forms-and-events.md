# Module 5 - Forms and User Interaction

## Goal
Build reliable forms with validation and async submit behavior.

## Outcomes
You can create controlled forms and user feedback states.

## Core concepts (deeper)

- **Controlled inputs** keep React state as source of truth.
- **Submit lifecycle**: validate -> send -> success/error feedback -> optional reset.
- **UX states**: disabled button, inline error, success message.
- **Event handling**: `event.preventDefault()` avoids browser full refresh.

## In this project

- Customer form: `src/Chauffeur.Web/src/pages/CustomerPage.tsx`
- Manager add-car form: `src/Chauffeur.Web/src/pages/ManagerPage.tsx`

## Exercises

1. Validate guests must not exceed selected car seats.
2. Replace `alert` with inline success banner.
3. Disable submit while async request is running.

## Solutions

1. On submit, check selected car and compare `guests > car.seats`; if true, set form error and stop submit.
2. Add state like `const [successMessage, setSuccessMessage] = useState('')`; render it in panel after successful request.
3. Add `isSubmitting` state; set true before await, false in finally; bind to button `disabled={isSubmitting || !canSubmit}`.

## Accessibility note
Associate labels with inputs and ensure error text is visible and descriptive.

## Challenge
Add per-field errors (`name`, `email`, `date`) and show them below corresponding fields.
