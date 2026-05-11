# AI Portfolio Toolkit v49

## What changed in v49

- Reworked the Portfolio micro interaction into an anchored background hinge grid.
- The grid is fixed to the page/background grid, not a cursor-tail object.
- Only 3x3 cells around the cursor's current background grid cell are visible.
- Cell 5 is the center/current cursor grid cell.
- Fixed the hinge direction so surrounding cells face the cursor instead of folding away from it. Cell 4 folds right toward the cursor; cell 6 folds left toward the cursor; top/bottom cells hinge vertically toward the cursor.
- Mobile/tablet still keeps the existing vertical scrollytelling behavior and disables the desktop grid for performance.
- Resume/print mode keeps the grid disabled.
- Project version updated to v49.

## Folder structure

```text
AI-Portfolio-Toolkit/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── storage.js
│   └── exporter.js
└── README.md
```

## Notes

Open `index.html` directly or deploy the whole folder. After updating a live deployment, clear browser cache/hard refresh before testing the grid interaction.


## v49 hotfix
- Refined anchored background grid from simple hinge tilt to progressive folding.
- Center panel now leans gradually toward the cursor.
- Direction panel folds closed as the pointer approaches the next cell.
- Grid remains anchored to the page background and does not behave like a cursor tail.
