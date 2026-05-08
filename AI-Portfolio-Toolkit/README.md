# AI Portfolio Toolkit v41

## What changed in v41

- Canva AI prompt package now detects the current mode before download.
  - Portfolio mode downloads a Portfolio / Scrollytelling Website prompt.
  - Resume mode downloads a Resume / A4 CV prompt.
- Canva prompt filenames include the mode, for example:
  - `canva_prompt_portfolio_en.txt`
  - `canva_prompt_resume_en.txt`
- The JSON snapshot records `prompt_mode` and can be opened with Notepad, VS Code, or a browser.
- Cursor microinteraction grid has been strengthened for desktop Portfolio mode:
  - 3x3 local grid only
  - cursor is always the center cell
  - surrounding 8 cells tilt toward the cursor
  - hidden automatically on mobile/tablet and Resume mode
- Resume remains a full A4 layout with fixed component positions and user-selectable component visibility.

## How to run

Open `index.html` in a browser. For WEB export, deploy to a web host such as Vercel because browser security blocks full web export from `file://` pages.


## v41 hotfix
- Replaced the legacy static center grid tile with a true cursor-local 3x3 seamless tilt grid.
- The grid is hidden until the mouse moves in Portfolio mode, so no unwanted square appears in the middle of the page.
- Resume mode and print mode keep the grid disabled.
