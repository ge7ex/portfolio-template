# V49 Scrollytelling Applied

This build uses `AI-Portfolio-Toolkit-v49-progressive-folding-grid.zip` as the reference for the Experience / Project scrollytelling behavior.

## Preserved behavior

- Experience cards use `.scrollytelling-wrapper` with a sticky story card.
- Project images move horizontally by vertical page scroll through `--scrolly-x`.
- The image rail remains vertical-scroll driven on desktop, tablet, and mobile.
- Touch devices do not fall back to a plain horizontal gallery.
- Demo project data includes lightweight placeholder images so scrollytelling appears on first open.

## Added on top of v49 behavior

- Cursor microinteraction is changed from book/page flip to cursor-pressure surface.
- Canva brief includes replaceable picture-frame requirements.
- Low-spec devices throttle cursor grid rendering while preserving scrollytelling.
- Print/PDF uses static image grid overrides only inside `@media print`.

## Reference source

The original v49 `Experience.js` is included at:

```text
references/v49-scrollytelling/Experience.js
```

This is reference-only. The active runtime still uses:

```text
public/js/components/Experience.js
public/legacy/v49-app.js
public/css/style.css
```
