# 08 - Forms, Validation, and UX Feedback

## Objective
Create production-like forms with validation and clear feedback.

## Principles

- Validate before submit
- Show inline errors near fields
- Provide success feedback
- Prevent duplicate submission

## In this project

- Offer request form (customer)
- Add-car form (manager)

## Exercises

1. Add per-field validation messages.
2. Replace alert with inline success toast/banner.
3. Add submit loading spinner text.

## Solutions

- Track `errors` object in state.
- Render `<p className='error'>...</p>` below fields.
- Use `isSubmitting` to switch button text to “Submitting...”.

## UX tip

Validation should help users fix problems quickly; be specific and actionable.
