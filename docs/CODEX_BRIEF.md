# Codex Brief — v49 Parity TypeScript Migration

Goal: migrate the v49 corrective baseline to TypeScript without losing the V1/v49 UI feeling.

Strict rules:

- Do not redesign from scratch.
- Do not flatten the interface into a generic dashboard.
- Do not remove the grid/mouse interaction.
- Do not remove Canva frame placeholders.
- Do not make PPTX the primary export flow again.
- Do not refactor multiple subsystems at once.

Suggested first task:

Move Canva prompt generation from `public/legacy/v49-app.js` to `src/export/canvaPrompt.ts`, preserving exact output.
