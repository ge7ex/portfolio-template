# /skill impeccable-redesign

Use this skill when improving the visual design, interaction quality, layout rhythm, or UI polish of `AI-Portfolio-Toolkit` while avoiding obvious AI-generated / vibe-code patterns.

This skill is intentionally conservative. It should make the product feel crafted, maintainable, and human-designed rather than flashy, over-animated, or generic.

## Mission

Refine the current portfolio toolkit into a polished, credible, production-ready interface without breaking existing behavior.

The output should feel:

- deliberate
- editorial
- legible
- restrained
- premium but not noisy
- theme-aware
- export-safe
- maintainable

It should not feel:

- AI-generated
- template spam
- neon-heavy by default
- over-glassy
- over-animated
- randomly gradient-filled
- inconsistent across sections
- patched by many unrelated CSS overrides

## Project context

Work inside:

```text
AI-Portfolio-Toolkit/
```

Core files:

```text
index.html
css/style.css
js/storage.js
js/exporter.js
js/components/*.js
```

Current confirmed behavior that must be preserved:

- Static HTML/CSS/Vanilla JS architecture.
- No database.
- TH/EN bilingual content.
- Portfolio / Resume mode.
- Dark / Light mode.
- Multiple themes.
- v55 cursor-facing background grid.
- 3x3 active grid seam effect.
- Modal / panel / hero / card cursor microinteraction.
- Skills / Contact cursor-facing extension.
- Quick edit popover.
- PDF portrait / landscape print support.
- PPTX export.
- WEB export.

## Core design principles

### 1. Design system first, effects second

Before adding any new visual effect, check whether the current issue can be solved with:

- spacing
- hierarchy
- type scale
- contrast
- surface tokens
- border consistency
- section rhythm
- state clarity

Effects must support comprehension. They must not be the design.

### 2. Reduce “AI interface smell”

Avoid these common AI/vibe-code signatures:

- Excessive electric blue / purple glow everywhere.
- Large glassmorphism panels with no content hierarchy.
- Random gradients on every card.
- Overuse of `backdrop-filter`.
- Overuse of `box-shadow` stacks.
- Floating orbs that do not explain content.
- `transition: all` everywhere.
- Huge border-radius values applied inconsistently.
- Same bento-card pattern repeated without editorial intent.
- Fake premium look built only from blur + glow.

Instead, prefer:

- quiet surfaces
- deliberate accent use
- readable contrast
- one dominant accent per theme
- subtle texture or depth only where needed
- consistent spacing scale
- restrained motion
- clear visual grouping

### 3. Theme is direction, not recolor

Each theme should have its own visual language:

- Tech: precise, cool, restrained digital surface.
- Education: warm, structured, approachable.
- Government: formal, stable, low-glow, readable.
- Creative: expressive but controlled.
- Minimal: flat, quiet, low shadow.
- Eco: organic spacing and softer surface.
- Bold: stronger contrast, but not chaotic.
- Luxury: refined typography, low noise, warm accent.
- Health: clean, calm, trustworthy.
- Esports: energetic, but still professional.

Do not simply recolor every element with the same intensity.

### 4. Motion must have purpose

Allowed motion:

- Cursor-facing grid within the 3x3 rule.
- Subtle modal/panel facing toward cursor.
- Small hover state that clarifies interactivity.
- Scrollytelling movement for project images.

Avoid:

- bounce for serious content
- exaggerated tilt
- continuous animation with no information value
- motion that triggers layout reflow
- animation in print/export contexts

### 5. Export safety is part of design

Any redesign must respect:

- PDF portrait
- PDF landscape
- Resume print readability
- Portfolio print image fit
- WEB export hiding editor controls
- PPTX export constraints

If a design element cannot export safely, it should degrade gracefully.

## Forbidden changes unless explicitly requested

Do not:

- migrate to React / Next.js / TypeScript in this skill
- rename storage keys
- alter localStorage schema
- remove export functions
- remove quick edit
- remove theme options
- delete v55 grid behavior
- add README_Vxx files
- rewrite the whole project in one pass
- replace all CSS with a new framework
- add new dependencies without approval
- add heavy animation libraries

## Working method

### Step 1: Inspect before editing

Before editing, inspect:

- current HTML structure
- component output classes
- relevant CSS section
- print rules that may override the visual area
- whether the target appears in portfolio mode, resume mode, or both

### Step 2: Define the design problem

State the problem in concrete UI terms:

Bad:

```text
Make it more beautiful.
```

Good:

```text
The skills/contact area does not visually respond like the hero section, causing inconsistent interaction language. Add a subtle cursor-facing surface treatment while keeping text contrast and export safe.
```

### Step 3: Make the smallest useful change

Prefer minimal, targeted edits.

Examples:

- Add one token group.
- Adjust one component section.
- Normalize spacing for one layout mode.
- Reduce one heavy effect group.
- Add a guard to cursor target selection.

### Step 4: Preserve behavior

After editing, verify mentally or with manual checks:

- no console syntax issue
- no missing class dependency
- no broken export button
- no hidden modal layer stuck on page
- no print overlay leak
- no readability regression in dark mode

## Visual quality rubric

Score each redesign from 1-5.

### A. Legibility

5 = Text remains readable in all themes and modes.

Fail if:

- dark mode has low contrast
- accent color competes with body text
- headings are decorative but unclear

### B. Hierarchy

5 = User can immediately distinguish title, role, section title, content, actions.

Fail if:

- everything is a glowing card
- all text sizes feel similar
- chips, buttons, and headings fight for attention

### C. Restraint

5 = Effects are present but not loud.

Fail if:

- every element glows
- gradients appear unrelated
- motion feels like a demo, not a product

### D. Consistency

5 = Spacing, radius, border, and shadow follow an obvious system.

Fail if:

- every section has a different card language
- theme changes break layout rhythm
- print mode looks unrelated to web mode

### E. Performance awareness

5 = Uses transform/opacity carefully and avoids expensive effects where unnecessary.

Fail if:

- adds backdrop blur to large fixed layers
- adds transition all
- updates many elements per pointer move without budget

### F. Export safety

5 = Print/export still works and hides interactive controls.

Fail if:

- nav/modal/grid appears in PDF
- project images crop unexpectedly
- resume print becomes unreadable

## Anti-vibe-code checklist

Before finalizing, confirm:

- [ ] No new random glowing orbs unless they support theme identity.
- [ ] No blanket `transition: all`.
- [ ] No heavy blur on full-screen layers.
- [ ] No unreadable dark theme text.
- [ ] No duplicated CSS block with only small color changes.
- [ ] No new global `!important` rule unless needed to override legacy layers.
- [ ] No fake “premium” effect built only from glow.
- [ ] No excessive animated background.
- [ ] No change that makes portfolio and resume exports worse.
- [ ] No README version files.

## Preferred CSS strategy

Use clear sections:

```css
/* Base tokens */
/* Layout shell */
/* Navigation */
/* Hero */
/* Cards */
/* Skills / Contact */
/* Cursor grid */
/* Modal / Quick edit */
/* Print / Export */
```

Prefer tokens:

```css
:root {
  --surface-1: rgba(255,255,255,.08);
  --surface-2: rgba(255,255,255,.12);
  --border-soft: rgba(255,255,255,.12);
  --shadow-soft: 0 18px 60px rgba(0,0,0,.18);
}
```

Avoid uncontrolled one-off styling:

```css
.some-new-card {
  box-shadow: 0 0 80px blue, 0 0 120px purple, inset 0 0 40px cyan;
  backdrop-filter: blur(40px);
  transition: all .8s;
}
```

## Preferred JS strategy

For interactions:

- Use `requestAnimationFrame`.
- Update CSS variables, not layout properties.
- Update `transform` and `opacity`, not `top/left/width/height`.
- Reuse one pointer listener where possible.
- Guard for `prefers-reduced-motion`.
- Disable or reduce effects on mobile.

Bad:

```js
window.addEventListener('mousemove', () => {
  document.querySelectorAll('*').forEach(el => {
    el.style.left = Math.random() + 'px';
  });
});
```

Good:

```js
const update = () => {
  target.style.setProperty('--cursor-rx', `${rx}deg`);
  target.style.setProperty('--cursor-ry', `${ry}deg`);
};
```

## Prompt template for Codex

Use this when asking Codex to redesign a section:

```text
Use /skill impeccable-redesign.

Task:
Refine [specific section] in AI-Portfolio-Toolkit so it feels more crafted and less AI-generated.

Scope:
- Work only in AI-Portfolio-Toolkit.
- Touch only [specific files].
- Preserve storage, export, theme switching, and v55 cursor grid behavior.

Design intent:
- Improve hierarchy, spacing, contrast, and section rhythm.
- Reduce obvious vibe-code patterns: excessive glow, random gradients, over-glass, transition-all.
- Keep motion subtle and purposeful.

Constraints:
- No React/Next/TypeScript migration.
- No new dependencies.
- No README_Vxx files.
- Do not remove PDF/PPTX/WEB export.
- Do not break dark/light mode.

Acceptance checks:
- Dark and light mode readable.
- Portfolio and resume still switch.
- Modal and quick edit still open.
- Skills/contact still render if relevant.
- Print/export does not show nav/modal/grid overlay.

Report:
- Files changed.
- What was improved.
- What was intentionally not touched.
- Manual checks still needed.
```

## Prompt template for anti-vibe-code cleanup

```text
Use /skill impeccable-redesign.

Task:
Audit AI-Portfolio-Toolkit for obvious AI-generated visual patterns and reduce them without changing core behavior.

Focus on:
- excessive glow
- overuse of gradients
- overuse of backdrop blur
- transition-all
- inconsistent border radius
- repeated card styling
- low contrast dark theme text

Do not:
- redesign the whole app
- remove features
- change storage schema
- migrate frameworks
- alter export behavior

Deliver a targeted patch and a short report.
```

## Final response format after using this skill

Return:

```text
Changed:
- ...

Preserved:
- ...

Risk:
- ...

Checks still needed:
- ...
```

Keep the report specific. Do not claim visual verification unless it was actually tested in browser.
