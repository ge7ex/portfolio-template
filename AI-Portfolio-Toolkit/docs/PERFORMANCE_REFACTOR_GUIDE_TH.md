# คู่มือแยกงาน Performance / Refactor

เอกสารนี้ใช้กำกับการปรับ AI Portfolio Toolkit ให้เบาลง โดยไม่เปลี่ยนแกนระบบหลักและไม่ทำให้หน้าตาดูเป็นงาน AI-generated หรือ vibe code ชัดเกินไป

## เป้าหมาย

ทำให้โปรเจกต์เร็วขึ้น อ่านโค้ดง่ายขึ้น และแก้ต่อได้ปลอดภัยขึ้น โดยยังคงสิ่งเหล่านี้ไว้:

- เปิดใช้งานแบบ static ได้
- ไม่ต้องมี database
- ยังใช้ `index.html`, `css/style.css`, และ Vanilla JS เป็นหลัก
- Export WEB / PDF / PPTX ยังทำงาน
- Dark / Light และ theme ต่าง ๆ ยังอ่านง่าย
- Cursor grid ยังเป็น v55-style: หันตาม cursor, ไม่เด้ง, ไม่ lift

## หลักการสำคัญ

Performance ของโปรเจกต์นี้ไม่ได้ติดที่ “ใช้ JavaScript แทน TypeScript” เป็นหลัก แต่ติดที่ rendering cost มากกว่า เช่น blur, shadow, filter, fixed layer, และการ update transform หลาย element ต่อ pointer move

ดังนั้นให้แก้ตามลำดับนี้ก่อน:

1. ลด visual cost
2. จำกัดจำนวน element ที่ interactive ต่อ cursor
3. จัด CSS layer ให้เป็นระบบ
4. แยก JS function ที่ยาวเกินไป
5. เพิ่ม JSDoc / schema ก่อนคิดเรื่อง TypeScript

## ห้ามทำในรอบ performance refactor

- ห้าม redesign ทั้งเว็บในครั้งเดียว
- ห้ามลบ export logic โดยไม่ได้รับอนุญาต
- ห้ามเปลี่ยน storage schema โดยไม่เขียน migration
- ห้ามย้ายทั้งโปรเจกต์ไป React / Next.js / TypeScript ทันที
- ห้ามเพิ่ม animation ใหม่ก่อนลดของเดิม
- ห้ามเพิ่ม README เวอร์ชันย่อย เช่น `README_V56.md`

## จุดกินทรัพยากรสูง

### 1. CSS visual effects

กลุ่มที่ต้องระวัง:

- `box-shadow` หลายชั้น
- `backdrop-filter: blur(...)`
- `filter: blur(...)`, `drop-shadow(...)`
- fixed overlay หลายตัว
- pseudo-element `::before`, `::after` ขนาดเต็มจอ
- transition ที่ครอบ `all`

แนวทางแก้:

- เปลี่ยน `transition: all` เป็น property เฉพาะ เช่น `transform`, `opacity`, `box-shadow`
- ลด shadow ขนาดใหญ่ซ้อนกัน
- ใช้ blur เฉพาะ modal/panel สำคัญ
- ลด glow ใน theme ที่จัดเกินไป
- ปิด effect บน mobile / print / reduced-motion

### 2. Cursor microinteraction

ตอนนี้มี cursor-facing กับหลาย element:

- background 3x3 grid
- hero
- unified card
- modal
- theme panel
- export panel
- quick edit
- skills
- contact

แนวทางแก้:

- จำกัด target ที่หันตาม cursor ให้เหลือเฉพาะ visible section ใกล้ viewport
- ไม่ควรให้ chip จำนวนมากทุกตัว update หนักเกินไป
- ใช้ `requestAnimationFrame` เสมอ
- ไม่ update layout property เช่น width, height, top, left ใน pointer loop
- ใช้ transform-only interaction

### 3. Images and localStorage

โปรเจกต์เก็บรูปเป็น base64 ใน localStorage ซึ่งสะดวกแต่หนัก

แนวทางแก้:

- จำกัดขนาดรูปก่อนเก็บ
- บีบอัดคุณภาพพอเหมาะ
- เตือนผู้ใช้เมื่อรูปมากเกินไป
- อย่าแปลงรูปซ้ำทุกครั้งที่ render
- แยก thumbnail กับ original ถ้าจะขยายระบบในอนาคต

### 4. Export rendering

`html2canvas` และ PPTX rendering เป็นงานหนักโดยธรรมชาติ

แนวทางแก้:

- ซ่อน nav / modal / grid ก่อน render
- ใช้ static theme background แทนการจับ screenshot ทั้งหน้าเมื่อเปิดแบบ offline
- ลด image resolution เฉพาะตอน export
- อย่าเรียก export ซ้ำโดยไม่มี loading lock

## แผน refactor แบบปลอดภัย

### Phase 1: CSS cleanup โดยไม่เปลี่ยนหน้าตาหลัก

ทำได้ก่อน:

- รวม token ซ้ำ เช่น accent, surface, border, shadow
- จัดหมวด CSS เป็น:
  - Base
  - Layout
  - Components
  - Theme tokens
  - Cursor grid
  - Modal / quick edit
  - Print
  - Export
- ลบ rule ซ้ำที่ถูก override ทิ้งแล้ว แต่ต้องเทียบ visual ก่อน
- ลด `!important` เฉพาะจุดที่ไม่จำเป็น

ห้ามทำ:

- เปลี่ยน class name ที่ component JS ใช้อยู่
- เปลี่ยน DOM structure ของ export

### Phase 2: Cursor interaction budget

เป้าหมายคือ interaction ยังรู้สึก premium แต่เบาลง

แนวทาง:

- ให้ grid ใช้ 9 cells เหมือนเดิม
- ให้ card ใหญ่หันตาม cursor ได้
- จำกัด skill chip ให้เป็น optional หรือใช้ hover-only บางจุด
- เพิ่ม guard: ถ้ามี element interactive เกินจำนวนที่กำหนด ให้ skip chip รายตัว

ตัวอย่าง budget:

```js
const MAX_CURSOR_TARGETS = 24;
```

### Phase 3: JS organization

แยก function ยาวใน `index.html` ออกเป็นไฟล์เมื่อพร้อม เช่น:

```text
js/interactions/cursorGrid.js
js/interactions/floatingSurface.js
js/ui/themePanel.js
js/ui/quickEdit.js
js/export/print.js
```

แต่ให้ทำทีละไฟล์และ test ทุกครั้ง

### Phase 4: Type hints ก่อน TypeScript

ก่อนย้าย TypeScript ให้เริ่มจาก JSDoc:

```js
/**
 * @typedef {Object} PortfolioData
 * @property {string} name_th
 * @property {string} name_en
 * @property {string} layout
 * @property {string} colorMode
 * @property {string} portfolioStyle
 */
```

ข้อดี:

- ได้ autocomplete ดีขึ้น
- ลด risk กว่าการย้าย build system
- ยังเปิดไฟล์ static ได้เหมือนเดิม

## เกณฑ์ตัดสินว่าควรย้ายเป็น TypeScript เมื่อไร

ควรย้ายเมื่อมีเงื่อนไขเหล่านี้อย่างน้อย 2-3 ข้อ:

- โครงสร้าง data ใหญ่ขึ้นมาก
- มีหลายคนแก้ code พร้อมกัน
- ต้องมี automated test จริงจัง
- ต้องแยก module และ bundle ด้วย Vite หรือเครื่องมือ build
- ต้องทำ schema validation / migration ของ localStorage
- เริ่มมี bug จาก field name ผิดบ่อย

ยังไม่ควรย้ายถ้า:

- เป้าหมายหลักคือ performance
- ยังต้องการเปิด `index.html` แบบง่าย ๆ
- ยังไม่มีแผนใช้ build step
- ปัญหาหลักอยู่ที่ CSS effect มากกว่า logic

## Checklist ก่อน merge งาน refactor

- หน้าเว็บโหลดได้โดยไม่มี console error
- Theme panel เปิด/ปิดได้
- Dark / Light อ่านง่าย
- Portfolio / Resume switch ได้
- Skills / Contact ยัง render
- Cursor grid ไม่เด้ง ไม่กระโดด
- Modal / Quick Edit ยังใช้งานได้
- WEB export ซ่อนปุ่ม edit
- PDF ไม่เห็น nav/modal/grid overlay
- Mobile ไม่หน่วงผิดปกติ
- ไม่มี README เวอร์ชันย่อยเพิ่ม

## Prompt สำหรับ Codex: Performance pass

```text
Task: Reduce rendering cost in AI-Portfolio-Toolkit without changing product behavior.

Scope:
- Work only inside AI-Portfolio-Toolkit.
- Prefer CSS and small JS guard improvements.
- Do not change storage schema.
- Do not remove export functions.
- Do not redesign the UI.

Goals:
1. Reduce excessive glow, blur, shadow, and transition-all usage.
2. Keep v55 cursor-facing grid behavior intact.
3. Keep modal, skills, and contact microinteraction subtle.
4. Keep print/export output stable.

Constraints:
- No React/Next/TypeScript migration in this task.
- No README_Vxx files.
- No broad rewrites.

Report:
- List changed files.
- Explain performance risk reduced.
- Explain what was intentionally not touched.
- Mention manual checks still needed.
```
