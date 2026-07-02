# Portfolio Template V2 TS — v49 Parity Baseline

This is the V2 TypeScript/Vite baseline that keeps the v49 corrective UI/interaction behavior as the visual source of truth.

## What this package is

- Vite + TypeScript project shell.
- v49 corrective UI preserved.
- corrected mouse microinteraction preserved.
- Canva prompt frame placeholders preserved.
- safer PDF image placement CSS preserved.
- legacy runtime kept temporarily for parity.

## Why not full TS immediately?

The original v49 app relies on classic global scripts and inline `onclick` handlers. Converting all of that to modules in one step risks breaking the exact UI/interaction feeling again.

This package therefore uses a safe migration model:

1. keep UI parity first;
2. add TS schema and Vite project structure;
3. migrate one feature at a time after visual approval.

## Run

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Typecheck / build

```bash
npm run typecheck
npm run build
```

## Recommended Codex instruction

```text
Use this v49 parity TypeScript baseline.
Do not redesign from scratch.
First preserve visual parity with v49: ambient grid, mouse microinteraction, card depth, theme feeling, Canva frame prompt, and PDF image placement.
Then migrate one feature at a time into typed modules.
Start with Canva prompt generation or cursor interactions only.
Report changed files, preserved behavior, risks, and manual checks needed.
```


## v49 parity corrective patch

- Replaced hinge/book-fold cursor grid with a cursor pressure surface: 3x3 falloff, center-origin tilt, negative Z sinking, and smooth reset.
- Strengthened Canva prompt requirements so PIC_FRAME placeholders are real replaceable Canva Frame elements/layers.
- Added low-spec lazy behavior: grid rendering starts only on pointer movement and throttles on low memory/low CPU devices.


## Scrollytelling restored note

This build intentionally keeps the v49 scrollytelling behavior. The first-run demo now includes three lightweight inline SVG placeholder frames, so the scrollytelling section is visible immediately even before the user uploads project images. Real uploaded project images still replace these through the existing edit flow.


## V49 scrollytelling applied

This build keeps the working v49 Experience / Project scrollytelling behavior as the reference implementation: vertical page scroll drives the horizontal image rail through `--scrolly-x`, with sticky story cards preserved across desktop and touch devices. See `docs/V49_SCROLLYTELLING_APPLIED.md`.
