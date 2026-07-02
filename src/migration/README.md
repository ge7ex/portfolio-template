# Migration Notes

This project is a TypeScript/Vite parity shell based on the v49 corrective baseline.

Why the runtime is still legacy JavaScript:

- v49's UI parity and mouse interaction are the source of truth.
- The original app depends on classic global-script behavior and inline onclick handlers.
- Moving everything to modules in one pass would risk breaking the UI again.

Migration order:

1. Validate UI parity.
2. Move Canva prompt generation to typed module.
3. Move cursor grid/mouse interactions to typed module.
4. Move export helpers to typed module.
5. Replace inline onclick flow with event delegation.
