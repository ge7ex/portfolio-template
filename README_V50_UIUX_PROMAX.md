# AI Portfolio Toolkit v50 — UI/UX ProMax Design Refactor

## What changed
- Added a premium UI/UX design-system override layer at the end of `css/style.css`.
- Improved hero section, navigation, export action branch, card hierarchy, skill chips, experience cards, CTA, modal focus states, mobile spacing, and resume readability.
- Kept the existing data layer, export logic, theme engine, quick edit, scrollytelling, and print logic intact.
- Replaced the empty `CTAComponent.js` with a working CTA renderer.
- Added basic CTA text escaping and URL validation for `http/https` links.

## Files changed
- `css/style.css`
- `js/components/CTAComponent.js`

## Important notes
- This is a CSS-first visual refactor to reduce risk of breaking the existing JavaScript logic.
- Existing HTML, storage, export, PPTX, PDF, quick edit, theme carousel, and scrollytelling scripts are preserved.
- DOCX behavior was not changed in this package.

## Recommended next hardening step
Before using this as a client-facing public template, add global HTML escaping and URL validation to all user-input renderers, not only the CTA component.
