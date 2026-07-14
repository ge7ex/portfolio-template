# Prompt Playbook สำหรับสร้างและแก้ Portfolio Template

เอกสารนี้รวบรวมวิธีเขียน Prompt สำหรับงานเว็บ Portfolio/Resume โดยปรับจาก framework เดิมให้ตรงกับ architecture ปัจจุบัน

## 1. เลือก Framework ให้เหมาะกับงาน

### RTF — Role, Task, Format

เหมาะกับงานสั้นและตรงไปตรงมา

```text
Role: คุณเป็น Senior Frontend Developer
Task: ตรวจ CSS ของ mobile navigation และแก้ให้กลุ่มปุ่มอยู่กลางจอจริง
Format: ส่ง patch เฉพาะไฟล์ที่เกี่ยวข้อง พร้อมสรุป changed/preserved/checks
```

### RACE — Role, Action, Context, Expectation

เหมาะกับงานที่มีบริบทและข้อจำกัดหลายข้อ

```text
Role: คุณเป็น Frontend Performance Engineer
Action: ลด rendering cost ของ cursor interaction
Context: เว็บเป็น static HTML/CSS/Vanilla JS และมี cursor grid 3x3
Expectation: ห้ามเปลี่ยน storage schema, export และ visual direction หลัก
```

### CARE — Context, Action, Result, Example

เหมาะกับงานดีไซน์ที่มีภาพอ้างอิง

```text
Context: ส่วนรูปผลงานปัจจุบันเป็น horizontal rail และเกิด blank rail
Action: เปลี่ยนเป็น responsive coverflow
Result: รูปกลางเด่น รูปข้างซ้อน และใช้ vertical scroll ควบคุม
Example: อ้างอิง interaction จากภาพตัวอย่าง แต่ไม่คัดลอกการ์ดข้อความ
```

### PAR — Problem, Action, Result

เหมาะกับ bug และงานแก้ระบบ

```text
Problem: Mobile coverflow เปิดแล้วไม่ยุบปิดเหมือน Desktop
Action: เพิ่ม open–move–hold–close phase โดยใช้ progress เดียวกัน และทำ responsive CSS
Result: หลังรูปสุดท้ายส่วนรูปยุบปิด การ์ดถัดไปขึ้นทันที และไม่มี blank rail
```

### STAR — Situation, Task, Action, Result

เหมาะกับการวิเคราะห์ root cause และ retrospective

```text
Situation: CSS กำหนด nav ไว้กลาง แต่ปุ่มยังชิดซ้าย
Task: หาสาเหตุและแก้โดยไม่กระทบ Desktop
Action: ตรวจ width, justify-content, overflow และ cascade order
Result: อธิบาย root cause พร้อม patch และ validation steps
```

### CREATE — Context, Request, Explanation, Action, Task, Extras

เหมาะกับ feature ขนาดใหญ่หรือการเริ่มโปรเจกต์

```text
Context: เว็บ Portfolio/Resume แบบ static รองรับ TH/EN, theme, print และ export
Request: เพิ่มระบบ import/export JSON
Explanation: ต้องรักษา schema compatibility และ localStorage เดิม
Action: ตรวจ storage layer, ออก schema version, เขียน validation และ migration
Task: เพิ่มปุ่ม export/import, error handling และ smoke tests
Extras: ห้ามอัปโหลดข้อมูลออกนอก browser และห้าม commit ข้อมูลจริง
```

## 2. Prompt หลักสำหรับให้ AI ตรวจโปรเจกต์ก่อนแก้

```text
You are a senior frontend engineer maintaining ge7ex/portfolio-template.

Before editing:
1. Inspect the current main branch and identify the real runtime source of truth.
2. Check whether the same file exists in both public and dist.
3. Confirm how scripts/prepare-vercel.cjs loads or modifies the asset.
4. Create a backup branch before any risky change.

Project constraints:
- Static HTML/CSS/Vanilla JS architecture.
- Preserve TH/EN, Portfolio/Resume, themes, print, WEB/PDF/PPTX export.
- Do not change storage keys without migration.
- Do not add README_Vxx files.
- Do not add new dependencies unless explicitly approved.
- Do not claim production is fixed without deployment and browser verification.

Task:
[ใส่งานที่ต้องการ]

Acceptance criteria:
[ใส่เงื่อนไขที่ตรวจได้]

Report:
- Root cause
- Files changed
- Preserved behavior
- Risks
- Checks completed
- Checks still needed
```

## 3. Prompt สร้างเว็บใหม่แบบแบ่ง 4 Phase

### Prompt 1 — Data Layer และ Shell

```text
Problem:
ต้องการสร้าง Portfolio/Resume generator แบบ static ที่รองรับ TH/EN โดยไม่ใช้ database

Action:
- สร้าง data schema สำหรับ profile, contact, skills, projects, theme, layout และ language
- เก็บข้อมูลใน localStorage พร้อม schemaVersion
- สร้าง navbar, Portfolio/Resume toggle, language toggle, theme panel และ edit modal
- Escape user-provided text ก่อนนำไปสร้าง HTML

Result:
ได้ shell ที่ render ข้อมูลสองภาษาได้ บันทึกข้อมูลใน browser และมี fallback data ที่ไม่ใช้ข้อมูลส่วนบุคคลจริง
```

### Prompt 2 — Theme และ Components

```text
Problem:
ต้องการให้ทุก section เปลี่ยนตาม theme และ Dark/Light โดยไม่เกิดสีหลุดหรือ contrast ต่ำ

Action:
- สร้าง theme tokens กลาง
- ให้ Header, Bio, Skills, Contact, Experience และ Resume ดึง token ชุดเดียวกัน
- แยก screen tokens และ print tokens
- ห้าม hard-code สีที่ทำให้ Resume ไม่ตรงกับ theme

Result:
Portfolio และ Resume มี visual identity เดียวกัน และข้อความอ่านได้ทุก theme
```

### Prompt 3 — Coverflow Scrollytelling

```text
Problem:
Horizontal image rail ทำให้เกิด trailing blank space และดูรูปสุดท้ายไม่ทัน

Action:
- 1 รูปใช้ static image
- 2+ รูปใช้ responsive coverflow
- ใช้ vertical scroll progress และ requestAnimationFrame
- Timeline: openAfter 0.06, startMove 0.12, endMove 0.76, collapseAfter 0.90
- Mobile ลด step, angle และ scale แต่ใช้ phase เดียวกับ Desktop
- Print flatten เป็น static grid

Result:
รูปกลางเด่น เลื่อนลื่น มี final hold และยุบปิดโดยไม่มี blank rail
```

### Prompt 4 — Responsive, Print และ Deploy

```text
Problem:
Mobile controls แตะยาก และ print/export อาจถูก animation หรือ collapsed state ซ่อนเนื้อหา

Action:
- ทำ mobile navigation ให้ safe-area aware และ touch target อย่างน้อยประมาณ 42px
- บังคับ print ให้เปิด content และซ่อน interactive controls
- Sync public/dist
- ให้ prepare-vercel.cjs load asset พร้อม cache version
- ทดสอบ production path หลัง deploy

Result:
Mobile ใช้งานได้จริง Print/PDF เห็นข้อมูลครบ และ production โหลด asset รุ่นใหม่
```

## 4. Prompt สำหรับแก้ Coverflow โดยไม่ทำให้ระบบเดิมพัง

```text
Task:
Refine only the portfolio image coverflow behavior.

Current behavior to preserve:
- Text card structure
- Theme and dark/light mode
- One-image static layout
- Print/PDF static image grid
- No arrow controls

Required behavior:
- Responsive coverflow for 2+ images on desktop and mobile
- Vertical scroll control
- Open, move, hold, close phases
- No horizontal rail and no trailing blank spacer
- Section height derived from image count but capped sensibly

Do not:
- Replace the entire Experience renderer
- Add a second competing scrollytelling engine
- Inject an orphan script
- Modify export data

Verification:
- 2, 3, and 4–6 images
- portrait, landscape, and mixed image ratios
- desktop 1920×1080
- representative mobile viewport
- print preview
```

## 5. Prompt สำหรับแก้ Theme Resume

```text
Task:
Audit Resume mode for colors that do not match the selected portfolio theme.

Check:
- sidebar gradient
- section heading and underline
- experience timeline line and dots
- year/company accents
- skill chips
- inline edit controls
- hover states
- print tokens

Requirement:
All theme-sensitive Resume colors must derive from resume/theme variables, not fixed teal, blue, or purple values.

Preserve:
- A4 dimensions
- content order
- sidebar/main layout
- print readability
```

## 6. Prompt สำหรับ Debug ที่ดี

อย่าเขียนเพียง:

```text
แก้ให้หน่อย มันไม่กลาง
```

ควรเขียน:

```text
Problem:
บน mobile viewport กล่อง nav กว้างเต็มจอและกลุ่มปุ่มเริ่มจากฝั่งซ้าย แม้ nav ใช้ left:50% และ translateX(-50%)

Action:
Inspect computed width, justify-content, overflow behavior, Tailwind utility classes, stylesheet order, and runtime inline styles. Identify the winning rule before editing.

Result:
The visible control group is horizontally centered on screens wider than 360px. On narrower screens it may scroll horizontally without clipping the first or last action.
```

## 7. กฎ Prompt ที่ช่วยลด Regression

ทุก Prompt สำหรับแก้โค้ดควรมี:

- Scope: ไฟล์หรือ section ที่อนุญาตให้แตะ
- Preserve: สิ่งที่ห้ามเสีย
- Do not: สิ่งที่ห้ามทำ
- Acceptance criteria: เงื่อนไขตรวจได้
- Test matrix: Desktop/Mobile/Print/Theme
- Report format: changed/preserved/risk/checks

## 8. Template สำหรับส่งงานต่อ AI/Codex

```text
Repository: ge7ex/portfolio-template
Branch: main
Deployment: https://portfolio-template-digitalday.vercel.app/

Goal:
[เป้าหมาย]

Observed issue:
[อาการที่เห็น พร้อม viewport และภาพถ้ามี]

Expected behavior:
[สิ่งที่ควรเกิด]

Allowed scope:
[ไฟล์/ระบบที่แก้ได้]

Must preserve:
- TH/EN
- Portfolio/Resume
- theme and dark/light
- print/export
- storage data

Required workflow:
1. Inspect current source of truth.
2. Create backup branch.
3. Explain root cause.
4. Apply the smallest safe patch.
5. Sync public/dist if required.
6. Update build injection/cache version if required.
7. Verify source, deployment, and production separately.

Final report:
- Root cause
- Backup branch
- Commits
- Files changed
- Verification completed
- Remaining uncertainty
```
