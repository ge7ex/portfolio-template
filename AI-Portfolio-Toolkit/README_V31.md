# AI Portfolio Pro V31 - Experience Edit Jump

## Changes
- Based on V30 easy project edit.
- When an Experience edit button is clicked, the app now opens the main edit modal, switches to the Experience tab, scrolls to the full edit form, focuses the project title field, and highlights the form briefly.
- Kept the latest print pagination rules already present in the project, including Experience heading/first-project print fit behavior.

## Verification
- `node --check js/exporter.js`
- `node --check js/storage.js`
- `node --check js/components/Experience.js`
- Inline script parse check for `index.html`
- `git diff --check`
