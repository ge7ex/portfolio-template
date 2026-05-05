# v28 Print + Export Fix

- Fixed public printer/export button hitbox and added a fallback event listener.
- Raised nav/export branch z-index and pointer events.
- Removed profile-frame glow, pseudo-elements, shadow, filter, and blend effects during print/PDF.
- Keeps on-screen profile glow, but flattens it only for print so the avatar does not receive colored shading.
