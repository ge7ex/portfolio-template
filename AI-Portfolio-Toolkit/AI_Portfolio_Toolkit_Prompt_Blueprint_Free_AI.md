# AI Portfolio Toolkit — Compact Prompt Blueprint สำหรับใช้ฟรี AI

> เอกสารนี้ออกแบบมาเพื่อให้ผู้ใช้ฟรี AI สามารถค่อย ๆ สั่งงานสร้าง/แก้โปรเจกต์แนว **AI Portfolio Toolkit** ได้ในไม่เกิน 10 ขั้นตอน โดยไม่ต้องยัดคำสั่งยาวเกินไปในครั้งเดียว
>
> แนวคิดหลัก: **แบ่งงานใหญ่เป็น Prompt สั้น ๆ ตามเลเยอร์** เพื่อให้ AI ไม่ลืม requirement และลดโอกาสแก้แล้วพังส่วนอื่น

---

## 0) Framework ที่ใช้ในเอกสารนี้

เอกสารนี้ใช้ Framework หลัก 2 แบบ

### A) CREATE Framework — ใช้สำหรับเริ่ม/เพิ่มฟีเจอร์ใหญ่

| ตัวย่อ | ความหมาย | ใช้ใส่อะไรใน Prompt |
|---|---|---|
| **C — Context** | บริบท | โปรเจกต์คืออะไร มีข้อจำกัดอะไร |
| **R — Request** | คำขอหลัก | ต้องการให้ AI ทำอะไร |
| **E — Explanation** | คำอธิบาย | อธิบาย logic, UX, behavior ที่ต้องการ |
| **A — Action** | ขั้นตอน | ให้ AI ทำตามลำดับ |
| **T — Task** | งานย่อย | รายการไฟล์/ฟังก์ชัน/จุดที่ต้องแก้ |
| **E — Extras** | Guardrails | ข้อห้าม ความปลอดภัย performance และ test |

### B) PAR Framework — ใช้สำหรับ Debug/Fix เฉพาะจุด

| ตัวย่อ | ความหมาย | ใช้ใส่อะไรใน Prompt |
|---|---|---|
| **P — Problem** | ปัญหา | อาการที่เห็นจริง |
| **A — Action** | ให้ทำอะไร | ให้ AI วิเคราะห์และแก้ตรงไหน |
| **R — Result** | ผลลัพธ์ | สิ่งที่ต้องเกิดหลังแก้ |

---

## วิธีใช้กับ AI ฟรี

1. ใช้ทีละ Prompt เท่านั้น อย่าส่งทั้งหมดพร้อมกัน
2. ถ้า AI ตอบยาวเกิน ให้สั่งว่า “ตอบเฉพาะไฟล์ที่ต้องแก้ พร้อม patch/diff”
3. หลังทำแต่ละขั้น ให้ทดสอบก่อนค่อยไปขั้นถัดไป
4. ถ้ามีบั๊ก ให้ใช้ **Prompt 8: Debug & Regression** ก่อนทำฟีเจอร์ใหม่
5. ห้ามให้ AI ลบฟีเจอร์เดิมโดยไม่จำเป็น

---

# Prompt 1 — Project Base, Folder Structure, Data Model

## ใช้ Framework: CREATE

### Copy Prompt

```text
[C — Context]
I am building a static AI Portfolio Toolkit using HTML, CSS, and vanilla JavaScript only. It must run without a backend, without paid APIs, and without a database. Data must be stored locally in localStorage.

[R — Request]
Create the initial project structure and data model for a bilingual portfolio/resume generator.

[E — Explanation]
The app must support TH/EN content, Portfolio mode, Resume mode, dark/light mode, theme selection, project versioning, and user-editable profile/project data.

[A — Action]
1. Create this folder structure:
   AI-Portfolio-Toolkit/
   - index.html
   - css/style.css
   - js/storage.js
   - js/exporter.js
   - js/components/Header.js
   - js/components/Bio.js
   - js/components/Experience.js
   - js/components/Skill.js
   - js/components/Contact.js
   - README.md
2. In storage.js, create a default data object with TH/EN fields.
3. Add projectVersion, layout, lang, colorMode, portfolioStyle, and resumeVisibility fields.
4. Use localStorage save/load with safe fallback default data.

[T — Task]
Return the full code for index.html, css/style.css, and js/storage.js first. Do not generate all components yet.

[E — Extras]
Security and quality requirements:
- No backend.
- No API key.
- No eval/new Function.
- Escape or safely render user-provided text.
- Keep the code readable and modular.
- Root folder must be named AI-Portfolio-Toolkit.
```

### ส่วนไหนคืออะไรใน Framework

- **C:** กำหนดบริบทว่าเป็น static web ไม่ใช้ backend/API
- **R:** ขอสร้างฐานโปรเจกต์และ data model
- **E:** อธิบายระบบที่ต้องรองรับ เช่น bilingual, mode, theme, version
- **A:** บอกลำดับงานชัดเจน
- **T:** จำกัด output ให้ AI ไม่ทำยาวเกิน
- **E:** ใส่ guardrails ด้าน security และโครงสร้างไฟล์

---

# Prompt 2 — Core UI Shell, Navbar, Edit Modal

## ใช้ Framework: CREATE

### Copy Prompt

```text
[C — Context]
I already have the base AI-Portfolio-Toolkit project with index.html, style.css, and storage.js. The app uses localStorage and vanilla JavaScript.

[R — Request]
Build the core UI shell: fixed navbar, mode switcher, language switcher, theme button, dark/light selector, edit button, and profile edit modal.

[E — Explanation]
The navbar must be compact and responsive. It must include:
- Portfolio/Resume pill toggle
- TH/EN language switcher
- Theme selector
- Dark/Light mode selector
- Edit profile button
Print/export controls must be separate from the hero section.

[A — Action]
1. Add navbar markup in index.html.
2. Add an edit modal with inputs for basic profile, contact, skills, experiences, and optional sections.
3. Add JS functions: render(), toggleLang(), setDirectLayout(), setDirectColorMode(), setDirectTheme(), toggleModal().
4. Ensure UI state is saved into localStorage.

[T — Task]
Return only the changed sections of index.html and css/style.css, plus any required JS functions.

[E — Extras]
- Do not remove existing storage logic.
- Keep touch targets usable on mobile.
- Do not place Print/Export controls inside the hero section.
- Theme, mode, and language controls must stay available.
```

### ส่วนไหนคืออะไรใน Framework

- **C:** บอกว่าเริ่มจากฐานเดิมแล้ว
- **R:** ขอสร้าง UI shell
- **E:** ระบุ control ที่ต้องมี/ไม่ควรมี
- **A:** แยกงาน markup, modal, JS state
- **T:** จำกัดให้ตอบเฉพาะส่วนที่แก้
- **E:** กัน AI ลบ storage หรือเอา print ไปปน hero

---

# Prompt 3 — Portfolio Components & Theme Engine

## ใช้ Framework: CREATE

### Copy Prompt

```text
[C — Context]
The project already has a UI shell and localStorage data. I need reusable components for Portfolio and Resume data display.

[R — Request]
Create modular components for Header, Bio, Skills, Contact, and Experience. Each component must support theme, dark/light mode, language, and layout mode.

[E — Explanation]
Each component must receive:
(data, layout, colorMode, portfolioStyle, lang)
The same data should be reused by Portfolio mode and Resume mode. Components must not hard-code only one language.

[A — Action]
1. Create Header.js for hero/profile header.
2. Create Bio.js for professional summary.
3. Create Skill.js for skills/expertise.
4. Create Contact.js for contact information.
5. Create Experience.js for projects/experience list.
6. Add a themeConfig object for at least these themes: tech, educ, gov, creative, minimal, eco, bold, luxury, health, esports.

[T — Task]
Return the component files and show how render() imports/calls them in index.html.

[E — Extras]
- Do not duplicate business logic across components.
- Escape user text before injecting into HTML.
- Components must gracefully hide empty sections.
- Keep CSS classes consistent with the selected theme.
```

### ส่วนไหนคืออะไรใน Framework

- **C:** ระบบมีฐานแล้ว
- **R:** ขอ component หลัก
- **E:** กำหนด parameter และ reuse data
- **A:** รายการ component ที่ต้องสร้าง
- **T:** ขอไฟล์ component และจุดเรียก render
- **E:** กำหนดความปลอดภัยและการซ่อนข้อมูลว่าง

---

# Prompt 4 — Portfolio Scrollytelling, Mobile Vertical Scroll, Collapse Behavior

## ใช้ Framework: CREATE

### Copy Prompt

```text
[C — Context]
The project has Portfolio components and an Experience section. I need the Experience section to feel cinematic on desktop and still work with vertical finger scrolling on mobile/tablet.

[R — Request]
Implement responsive scrollytelling for Experience projects.

[E — Explanation]
Desktop behavior:
- Project card stays visually stable.
- Project images move horizontally according to vertical scroll progress.
- Add expanded/collapsed states.

Mobile/tablet behavior:
- User must scroll vertically with finger, not horizontal swipe.
- Images must still move according to vertical scroll progress.
- The image rail must collapse when the project scroll segment ends.
- Avoid excessive gaps between project cards on mobile.

[A — Action]
1. Add scrollytelling structure in Experience.js.
2. Add initScrollEffects() using requestAnimationFrame.
3. Use CSS variable --scrolly-x to move image tracks.
4. Add classes cinematic-expanded and cinematic-collapsed.
5. Recalculate on scroll, resize, orientationchange, visualViewport resize, and image load.

[T — Task]
Return updated Experience.js, related CSS, and JS functions only.

[E — Extras]
- Do not force mobile image track to transform: translate3d(0,0,0) with !important.
- Do not convert mobile to horizontal swipe carousel.
- Use transform: translate3d(var(--scrolly-x),0,0) for GPU-friendly motion.
- Keep mobile performance smooth.
```

### ส่วนไหนคืออะไรใน Framework

- **C:** มี Experience แล้ว
- **R:** ขอ scrollytelling responsive
- **E:** แยก behavior desktop/mobile ชัดเจน
- **A:** กำหนดฟังก์ชันและ class ที่ต้องมี
- **T:** จำกัดเฉพาะไฟล์ที่เกี่ยว
- **E:** กัน regression ที่เคยเกิด เช่น mobile swipe, transform ถูกล็อก

---

# Prompt 5 — Canva AI Pack แบบฟรี ไม่ใช้ API/SDK

## ใช้ Framework: CREATE

### Copy Prompt

```text
[C — Context]
The project must integrate with Canva without using Canva API, SDK, OAuth, or any paid service. Users will manually paste prompts into Canva AI.

[R — Request]
Create a free Canva AI Pack export system.

[E — Explanation]
When the user clicks Download Canva AI Pack:
- If current mode is Portfolio, generate portfolio/scrollytelling website prompts.
- If current mode is Resume, generate A4 resume/CV prompts.
- Export a ZIP folder, not multiple loose files.
- The JSON snapshot must be text-only and must not embed Base64 images because Canva AI has character limits.

[A — Action]
1. Add a Canva icon/button that exports the pack.
2. Generate these files inside canva-pack/:
   - canva_prompt_portfolio_en.txt OR canva_prompt_resume_en.txt depending on current mode
   - canva_prompt_portfolio_th.txt OR canva_prompt_resume_th.txt depending on current mode
   - instruction_en.txt
   - instruction_th.txt
   - portfolio-data.json
3. Add prompt_mode and projectVersion inside JSON.
4. In instructions, tell the user to open Canva AI and choose Code / Website Code / AI Website Creation when making website-like output.
5. Mention that JSON opens with Notepad, VS Code, or browser.

[T — Task]
Return updated exporter.js and the button integration in index.html.

[E — Extras]
- Do not use Canva API or SDK.
- Do not include Base64 image data in JSON.
- Mention that project images should be uploaded manually into Canva.
- Prompts must request editable Canva text boxes, not flattened text images.
```

### ส่วนไหนคืออะไรใน Framework

- **C:** ยืนยันว่าไม่ใช้ API/SDK/เสียเงิน
- **R:** ขอระบบ export Canva Pack
- **E:** อธิบาย mode-aware prompt และ JSON text-only
- **A:** รายการไฟล์ใน ZIP
- **T:** จำกัดไฟล์ที่ต้องแก้
- **E:** ใส่ข้อห้าม Base64 และ editable text

---

# Prompt 6 — Resume Mode: A4, Locked Layout, Component Visibility

## ใช้ Framework: CREATE

### Copy Prompt

```text
[C — Context]
The app has Portfolio mode and Resume mode using the same data. Resume mode must not look like a cropped portfolio card. It must be a true A4 resume layout.

[R — Request]
Build a print-first Resume mode that uses Portfolio data but allows users to choose which components are visible.

[E — Explanation]
Users can toggle component visibility, but cannot drag or rearrange components. Positions are locked for visual consistency and print reliability.

Required Resume layout:
- A4 portrait, 210mm x 297mm.
- Print-safe margins suitable for Thai official-style printing.
- Two-column layout.
- Left column: profile photo, name/role, contact, skills, certifications/interests if enabled.
- Right column: summary, experience/projects, education, awards, references if enabled.

[A — Action]
1. Add resumeVisibility settings in data.
2. Add Resume Settings UI in Edit Modal.
3. Create a renderResumeLayout(data, lang, colorMode, pStyle) function.
4. Ensure hidden components do not leave broken gaps.
5. Add @media print CSS for A4 output.

[T — Task]
Return the updated index.html render logic, CSS print rules, and any new resume rendering function.

[E — Extras]
- Do not reuse portfolio card layout for print resume.
- Do not crop or distort profile images.
- Use object-fit: cover; object-position: center; aspect-ratio: 1/1 for profile images.
- Use page-break-inside: avoid for major resume sections.
```

### ส่วนไหนคืออะไรใน Framework

- **C:** ชี้ปัญหา resume เหมือน crop card
- **R:** ขอ resume print-first
- **E:** อธิบายว่าเลือกโชว์ได้แต่ตำแหน่งล็อก
- **A:** ระบุ data setting + UI + render + print CSS
- **T:** จำกัดส่วนที่ต้องตอบ
- **E:** กันรูปบิด/ครอปและกันกลับไปใช้ portfolio card

---

# Prompt 7 — Anchored Background Hinge Tilt Grid Microinteraction

## ใช้ Framework: CREATE

### Copy Prompt

```text
[C — Context]
The Portfolio mode needs a subtle futuristic microinteraction in the background. It must not be a cursor-tail object. It must feel like a seamless grid embedded in the page background.

[R — Request]
Create an anchored background hinge-tilt grid interaction.

[E — Explanation]
The page has an invisible fixed-size grid anchored to the viewport/page background. Only the 3x3 cells around the cursor are visible. The center cell is the cell under the cursor. The surrounding cells hinge or fold toward the cursor.

Expected behavior:
- The grid cells stay aligned to the background grid.
- They do not follow the cursor like a tail.
- As the cursor moves inside a cell, the center cell gradually tilts toward cursor direction.
- The cell in the direction the cursor approaches gradually folds/closed.
- The next cell in that direction starts to lift/tilt naturally.
- When crossing into a new cell, old cells close smoothly and the new 3x3 group appears smoothly.

[A — Action]
1. Add a fixed overlay layer below content but above theme background.
2. Render only 9 cells at runtime.
3. Use perspective, transform-style: preserve-3d, rotateX/rotateY, transform-origin, opacity transitions.
4. Calculate cursor position relative to the anchored grid, not relative to a moving overlay.
5. Disable on mobile/tablet, Resume mode, Print mode, and when Edit Modal is open.

[T — Task]
Return only CSS and JS needed for the grid, plus where to call initAnchoredHingeGrid().

[E — Extras]
- Keep opacity subtle.
- Do not block clicks; use pointer-events: none.
- Use requestAnimationFrame for mousemove updates.
- Avoid heavy DOM creation on every mousemove; reuse the 9 cells.
```

### ส่วนไหนคืออะไรใน Framework

- **C:** ระบุว่าเป็น background microinteraction ไม่ใช่ cursor tail
- **R:** ขอ anchored hinge grid
- **E:** อธิบายพฤติกรรมเอน/พับอย่างละเอียด
- **A:** ระบุเทคนิค CSS/JS ที่ต้องใช้
- **T:** จำกัดเฉพาะ CSS/JS grid
- **E:** กันรก กันคลิกไม่ได้ และกันกินเครื่อง

---

# Prompt 8 — Debug & Regression Fix แบบ PAR

## ใช้ Framework: PAR

### Copy Prompt

```text
[P — Problem]
I found a regression in the AI-Portfolio-Toolkit. Current issue:
- Describe the exact issue here.
- Device/browser: [desktop/mobile/tablet + browser name]
- Current mode: [Portfolio/Resume]
- Expected behavior: [what should happen]
- Actual behavior: [what happens now]

[A — Action]
Analyze the likely cause and fix only the affected files. Do not rewrite the whole project. Preserve existing features:
- Portfolio/Resume mode
- Theme selector
- Dark/Light mode
- Language switcher
- Canva AI Pack export
- Mobile vertical scrollytelling
- Resume A4 print layout
- Anchored hinge tilt grid

[R — Result]
Return:
1. Root cause summary
2. List of files changed
3. Patch/diff or replacement code for affected sections
4. Manual test checklist
5. Any risk or side effect to watch
```

### ส่วนไหนคืออะไรใน Framework

- **P:** ให้ใส่อาการจริง อุปกรณ์ และ expected/actual
- **A:** สั่งให้แก้เฉพาะจุดและห้าม rewrite ทั้งโปรเจกต์
- **R:** กำหนด output สำหรับตรวจงานและทดสอบซ้ำ

---

# Prompt 9 — Final QA, Packaging, Versioning

## ใช้ Framework: CREATE

### Copy Prompt

```text
[C — Context]
The AI-Portfolio-Toolkit is nearly complete. I need final QA, versioning, and ZIP packaging readiness.

[R — Request]
Review the project for final release quality and prepare the next version.

[E — Explanation]
The project must be safe, usable, and easy to deploy as a static website. The root folder inside the ZIP must be AI-Portfolio-Toolkit and index.html must be directly inside that folder.

[A — Action]
1. Update projectVersion everywhere to the next version.
2. Check that no real personal sample data is hard-coded.
3. Check that Canva Pack exports one ZIP folder, not multiple loose files.
4. Check that JSON is text-only and does not contain Base64 images.
5. Check Portfolio mode, Resume mode, Print PDF, mobile scrollytelling, and cursor grid.
6. Add or update README.md with run/deploy/test instructions.

[T — Task]
Return a QA checklist, files to modify, and exact version changes.

[E — Extras]
- Do not introduce paid APIs.
- Do not add backend dependencies.
- Do not break static hosting on Vercel/GitHub Pages.
- Follow OWASP-style basics: no eval, no unsafe third-party code injection, no secrets in client code.
```

### ส่วนไหนคืออะไรใน Framework

- **C:** ชี้ว่าเป็นขั้นเตรียมปล่อย
- **R:** ขอ QA และ versioning
- **E:** กำหนด ZIP/folder requirement
- **A:** รายการตรวจสอบก่อนปล่อย
- **T:** ขอ checklist และไฟล์ที่แก้
- **E:** guardrails ด้าน security และ static hosting

---

## Checklist รวม Feature ที่ควรได้หลังทำครบ

- [ ] Root folder ชื่อ `AI-Portfolio-Toolkit`
- [ ] `index.html` อยู่ตรงใน root folder
- [ ] Portfolio/Resume mode toggle
- [ ] TH/EN language switcher
- [ ] Theme selector
- [ ] Dark/Light mode
- [ ] Edit Modal สำหรับข้อมูล Portfolio
- [ ] Experience scrollytelling บน desktop
- [ ] Mobile/tablet ยังใช้ vertical scroll ไม่ใช่ horizontal swipe
- [ ] Image rail ขยับตามการไถและ collapse ตอนจบ
- [ ] Canva AI Pack ฟรี ไม่ใช้ API/SDK
- [ ] Canva Pack เป็น ZIP folder
- [ ] Prompt Canva แยกตามโหมด Portfolio/Resume
- [ ] JSON snapshot text-only ไม่ฝัง Base64
- [ ] Resume A4 full-page ไม่ใช่ card crop
- [ ] Resume component visibility เปิด/ปิดได้ แต่ตำแหน่งล็อก
- [ ] Anchored background hinge tilt grid ใน Portfolio desktop
- [ ] Grid ปิดใน mobile/resume/print/edit modal
- [ ] Project version แสดงและอัปเดตได้
- [ ] README มีวิธี run/deploy/test

---

## สูตรสั้นสำหรับแก้บั๊กกับ AI ฟรี

ใช้ประโยคนี้ต่อท้ายทุกครั้งที่แก้บั๊ก:

```text
Do not rewrite unrelated files. First explain the root cause, then provide the minimal patch. Preserve all existing features unless I explicitly ask to remove them.
```

## สูตรสั้นสำหรับกัน AI ทำเกิน

```text
Return only the changed code blocks and file names. Do not regenerate the whole project.
```

## สูตรสั้นสำหรับบังคับ QA

```text
Before final answer, self-check for syntax errors, responsive side effects, print side effects, and regression risks. Provide a short manual test checklist.
```

---

## หมายเหตุสำคัญ

- สำหรับงานใหญ่ ให้ใช้ **CREATE** เพราะคุมบริบทและ guardrails ได้ครบ
- สำหรับแก้บั๊ก ให้ใช้ **PAR** เพราะบังคับให้ AI โฟกัสปัญหาเฉพาะจุด
- สำหรับ AI ฟรี อย่าส่งโค้ดทั้งโปรเจกต์พร้อมกันบ่อย ๆ ให้ส่งเฉพาะไฟล์ที่เกี่ยวข้องกับ Prompt นั้น
- ถ้าเริ่มมีอาการ AI ลืม requirement ให้ย้อนกลับมาใช้ Prompt 8 แล้วแนบ checklist feature ที่ห้ามพัง
