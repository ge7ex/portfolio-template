# V21 Theme Wheel Clean Picker

Changed files:
- `index.html` — removed the visible center alignment ring and upgraded theme wheel click/drag/wheel snap logic.
- `css/style.css` — added production theme picker styling: active swatch highlight, no background ring, smoother picker feel.

Behavior:
- No visual center ring behind the color button.
- The swatch nearest the center becomes the selected theme.
- Click, mouse-wheel, and drag all work.
- Drag uses a small inertia push then snaps to the nearest swatch.
