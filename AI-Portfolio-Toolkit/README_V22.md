# V22 Grid Tilt Fix

- Corrected per-cell tilt direction so panels lean toward the cursor.
- Only the 3x3 grid area around the cursor reacts.
- Grid cells stay locked in place; no whole-grid tilt or translation.
- Removed outward-looking behavior by flipping rotateX/rotateY signs and limiting influence to nearby cells.
