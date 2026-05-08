# AI Portfolio Toolkit v45

## What changed in v45

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


## v45 hotfix
- Rebuilt the cursor grid as a visible overlay above portfolio content but below the navbar.
- Removed legacy grid injection from render so the center tile cannot get stuck.
- The grid appears only after mouse movement in Portfolio mode and hides in Resume, print, mobile, and edit modal states.
- Cell #5 is the cursor anchor; the surrounding 8 cells tilt toward the cursor.


## v45 Mobile Scrollytelling Collapse Hotfix
- Fixes Experience image cards staying expanded after the horizontal scrollytelling motion finishes on mobile/tablet.
- Uses an explicit active window: expand only during the motion phase, then collapse before the next project/card.
- Keeps vertical scroll as the only interaction on mobile/tablet.
