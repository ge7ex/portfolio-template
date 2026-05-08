# AI-Portfolio-Toolkit v35

## Changes in v35

- Updated Canva AI prompts in both Thai and English.
- Canva prompt now keeps interactive website controls:
  - Theme selector
  - Dark/Light mode selector
  - Layout/Mode selector
  - Language switcher
- Canva prompt removes only Print / Export / Download controls from the generated Canva website.
- Added stronger Canva editability instructions:
  - Text must remain editable Canva text boxes.
  - Do not flatten or rasterize typography.
  - Keep sections and cards modular and editable.
- Preserved the portfolio micro-interaction: pointer-driven 3D tilt grid on desktop.
- Mobile keeps lightweight behavior and hides heavy grid effects for performance.

## Canva AI Pack

Use the Canva AI Pack button in the app to download a single ZIP package containing:

- canva_prompt_en.txt
- canva_prompt_th.txt
- canva_instruction_en.txt
- canva_instruction_th.txt
- portfolio_data_snapshot.json

The JSON file stores the portfolio data at download time. Project images are included as Base64 strings inside `data.exp[].images` when images exist, but Canva AI may not automatically import them as editable assets. Upload important images into Canva manually when needed.
