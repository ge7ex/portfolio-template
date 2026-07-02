# AI Portfolio Toolkit

AI Portfolio Toolkit is a static, no-database portfolio and resume generator built with HTML, CSS, and Vanilla JavaScript. It is designed for fast profile editing, bilingual TH/EN content, theme switching, portfolio/resume layouts, and export-ready presentation or print workflows.

The project currently lives inside this repository folder:

```text
AI-Portfolio-Toolkit/
```

## Current status

This README describes the current `main` branch after the latest Codex merge. The project is no longer documented by old version-specific README files. Use this file as the single source of project orientation.

Recent confirmed capabilities on `main`:

- Portfolio and resume layout switching.
- Thai / English content support.
- Dark / light mode.
- Multiple visual themes, including Tech, Education, Government, Creative, Minimal, Eco, Bold, Luxury, Health, and Esports.
- Cursor-facing v55-style background grid.
- Active 3x3 grid seam effect around the cursor.
- Modal / panel / hero / unified-card microinteraction that subtly faces the cursor.
- Skills and contact cursor-facing extension.
- Quick edit popover for major content sections.
- Portfolio scrollytelling for project images.
- PDF print support for portrait and landscape.
- PPTX export support.
- WEB export support.
- DOCX export is intentionally hidden/disabled in the current UI because previous offline behavior was unstable.

## Project guides and skills

Use these files when working with Codex or planning refactors:

```text
AI-Portfolio-Toolkit/docs/PERFORMANCE_REFACTOR_GUIDE_TH.md
AI-Portfolio-Toolkit/skills/impeccable-redesign.md
```

Recommended use:

- Use `docs/PERFORMANCE_REFACTOR_GUIDE_TH.md` when reducing resource usage, cleaning CSS, limiting cursor targets, or deciding whether TypeScript is needed.
- Use `skills/impeccable-redesign.md` when asking Codex to redesign or polish UI while avoiding obvious AI-generated / vibe-code patterns.

## Folder structure

```text
AI-Portfolio-Toolkit/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── storage.js
│   ├── exporter.js
│   └── components/
│       ├── Header.js
│       ├── Bio.js
│       ├── Experience.js
│       ├── Skill.js
│       ├── Contact.js
│       ├── EducationComponent.js
│       ├── CertificationComponent.js
│       ├── AwardsComponent.js
│       ├── CaseStudyComponent.js
│       ├── ServicesComponent.js
│       ├── TestimonialsComponent.js
│       ├── ClientsComponent.js
│       ├── CTAComponent.js
│       └── ArticlesComponent.js
├── docs/
│   └── PERFORMANCE_REFACTOR_GUIDE_TH.md
├── skills/
│   └── impeccable-redesign.md
├── PROJECT_STATUS_AND_ROADMAP_TH.md
└── README.md
```

## How to run locally

Open the project folder and launch `index.html`.

For the simplest offline test:

```bash
cd AI-Portfolio-Toolkit
start index.html
```

On macOS:

```bash
cd AI-Portfolio-Toolkit
open index.html
```

For a local static server:

```bash
cd AI-Portfolio-Toolkit
python -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

## Pulling the latest main branch for Codex/local work

If you already cloned the repository:

```bash
cd portfolio-template
git status
git switch main
git fetch origin
git pull --ff-only origin main
```

Then open this folder in Codex or your editor:

```text
portfolio-template/AI-Portfolio-Toolkit
```

If you do not have the repository locally yet:

```bash
git clone https://github.com/ge7ex/portfolio-template.git
cd portfolio-template
git switch main
```

Recommended safety check before asking Codex to edit files:

```bash
git status
git log --oneline -5
git branch --show-current
```

Create a working branch for Codex edits:

```bash
git switch -c codex/<short-task-name>
```

After Codex edits files:

```bash
git status
git diff
```

Commit only after reviewing the diff:

```bash
git add AI-Portfolio-Toolkit
git commit -m "feat: describe the change"
git push -u origin codex/<short-task-name>
```

## Backup branch

Before the latest Codex merge, a backup branch was created from `main`:

```text
backup/main-before-codex-merge-20260702
```

Use it to compare or recover the pre-merge state if needed.

Example compare command:

```bash
git fetch origin
git diff origin/backup/main-before-codex-merge-20260702..origin/main -- AI-Portfolio-Toolkit
```

## Important implementation notes

### Cursor-facing grid

The background grid is intentionally page-anchored. It should not behave like a cursor tail. Only the 3x3 neighborhood around the cursor reacts.

Expected behavior:

- Cursor-facing rotation.
- No bounce.
- No hinged plank movement.
- No vertical lift effect.
- Active grid seams are visual only and should not create real layout gaps.
- Disabled for print and reduced-motion contexts.

### Floating UI microinteraction

The visible floating UI elements are allowed to subtly face the cursor:

- Edit modal.
- Theme panel.
- Export panel.
- Quick edit popover.
- Portfolio hero.
- Unified project cards.
- Skills and contact sections.

Keep the effect subtle. Avoid over-rotating or adding heavy glow because it can make the interface feel synthetic and increase rendering cost.

### Print and export

Print rules are intentionally strict. Before changing print CSS, test:

- Portfolio PDF portrait.
- Portfolio PDF landscape.
- Resume PDF portrait.
- Project image fit.
- Dark and light theme readability.

### Performance caution

The project currently uses multiple large CSS layers and cursor-driven effects. Performance risk is more likely caused by expensive visual rendering than by JavaScript syntax choice.

High-cost areas:

- Large box-shadows.
- Backdrop blur.
- Filters.
- Multiple fixed overlays.
- Many elements receiving per-frame transform updates.
- Large base64 images in localStorage.
- html2canvas / PPTX rendering.

Prefer optimizing these before rewriting the project in TypeScript. See `docs/PERFORMANCE_REFACTOR_GUIDE_TH.md` for the detailed plan.

## JavaScript vs TypeScript guidance

Do not migrate the whole project to TypeScript only to reduce resource usage. TypeScript improves maintainability and catches errors during development, but it does not automatically make runtime rendering lighter in the browser.

Use TypeScript later if the project is being reorganized into a build-based app with modules, bundling, typed data schemas, and testable utilities.

For the current static toolkit, recommended next step is:

1. Keep runtime as JavaScript.
2. Reduce heavy CSS effects.
3. Limit cursor microinteraction target count.
4. Move repeated style patches into clearer component sections.
5. Add JSDoc type hints or a small schema layer before a full TypeScript migration.

## Recommended Codex task style

When asking Codex to edit this project, keep each task narrow.

Good examples:

```text
Use /skill impeccable-redesign. Refactor only the cursor microinteraction target list. Do not change export logic.
```

```text
Improve print readability for resume mode only. Do not touch portfolio scrollytelling.
```

```text
Reduce CSS glow and backdrop blur cost while preserving the current visual direction.
```

Avoid broad prompts like:

```text
Redesign the whole project and improve everything.
```

Broad prompts increase the chance of regressions in export, print, mobile, or theme behavior.

## Maintenance checklist

Before merging a branch into `main`, check:

- `index.html` loads without console errors.
- Theme panel opens and selected theme stays synced.
- Portfolio / Resume switch works.
- Dark and light mode remain readable.
- Skills and contact still render.
- Cursor grid does not jump or bounce.
- Modal and quick edit still open.
- WEB export hides edit controls.
- PDF print does not show nav/modal/grid overlays.
- No version-specific README files were added.

## Project owner notes

Developer / Maintainer: Kasidech Settavanit

This project is intended to stay easy to open, edit, export, and deploy as a static web toolkit.
