# สถานะโปรเจกต์และ Roadmap: Portfolio + CV/Resume พร้อมพิมพ์

เอกสารนี้สรุปจากการตรวจโครงสร้างโปรเจกต์ปัจจุบัน เพื่อใช้เป็นแนวทางพัฒนาต่อให้เป็นเว็บสำหรับเก็บ Portfolio และ CV/Resume ที่พร้อม Export/Print และยังสามารถนำข้อมูลไป Prompt ใน Canvas/AI design tool เพื่อให้ผู้ใช้สร้างดีไซน์เองได้

## ตอนนี้โปรเจกต์ถึงจุดไหน

### 1. Core web app พร้อมใช้งานเป็น static app แล้ว
- มีไฟล์หลัก `index.html` และ assets แยกเป็น `css/`, `js/`, `js/components/` ทำให้เปิดใช้งานตรง ๆ หรือ deploy โฟลเดอร์ทั้งชุดได้
- ใช้ Tailwind CDN, Lucide icons, PptxGenJS และ html2canvas จาก CDN จึงยังเป็น static HTML/JS app ที่ไม่ต้องมี build step
- มีระบบสลับภาษา ไทย/อังกฤษ, โหมด Portfolio/Resume, Dark/Light และ theme หลายสาย เช่น tech, education, government, creative, minimal, eco, bold, luxury, health, esports

### 2. Portfolio และ Resume/CV มีโครงหลักครบ
- Layout portfolio มี hero, bio, skills, contact, experience/projects, extra sections และ interaction/visual theme
- Layout resume มีโครง CV แบบ sidebar + main content เหมาะสำหรับพิมพ์มากกว่า portfolio mode
- มี component แยกสำหรับหัวข้อเสริม เช่น Education, Certification, Awards, Case Study, Services, Testimonials, Clients, CTA และ Articles

### 3. ระบบแก้ข้อมูลและเก็บข้อมูลฝั่ง browser มีแล้ว
- มีฟอร์ม Edit สำหรับชื่อ, role, bio, skills, contact, education, certifications, awards, services, testimonials, clients, articles และ experience
- ใช้ `StorageHandler`/localStorage เป็นแหล่งข้อมูลหลัก จึงเหมาะกับ prototype, personal template หรือ static deployment
- มี logic กัน demo placeholder ไม่ให้ไปปนกับข้อมูลจริงใน print designer/export flow

### 4. Export/Print มีฐานที่ดีมาก
- มีปุ่ม Export/Print ทั้ง public quick action และ panel หลัก
- รองรับ PDF portrait/landscape ผ่าน `window.print()` และ print stylesheet
- รองรับ PPTX ผ่าน PptxGenJS และมีการจับ background snapshot ด้วย html2canvas เมื่อเปิดผ่าน origin ที่รองรับ
- มี DOCX exporter ใน `exporter.js` แต่ปุ่มใน UI ยังถูกตั้ง `disabled` และซ่อนไม่ให้ focus ซึ่งแปลว่า feature ยังไม่ควรนับเป็นพร้อมใช้สำหรับผู้ใช้ปลายทาง
- มี Print Designer/PDF Layout Studio สำหรับจัดวาง object ก่อนพิมพ์ พร้อม profile/layout transform แยกตาม mode

### 5. Prompt/AI design asset มีอยู่แล้ว แต่ยังแยกจาก product flow
- มีไฟล์ prompt/framework แยกอยู่ใน repo เช่น blueprint และ prompt PAR
- ยังไม่เห็น flow ที่ชัดเจนในหน้าเว็บสำหรับ “Export เป็น prompt สำหรับ Canvas/AI design tool” หรือ “นำข้อมูล resume ไปสร้าง design prompt” แบบ copy ได้ทันที

## Gap สำคัญก่อนเรียกว่า Portfolio + Resume product พร้อมใช้จริง

### ต้องทำก่อน (MVP readiness)
1. **แยก data model ให้ชัดเจน**
   - กำหนด schema กลางสำหรับ profile, work experience, projects, education, awards, certifications, links, media, print settings และ design prompt metadata
   - เพิ่ม import/export JSON เพื่อให้ผู้ใช้ backup/ย้ายเครื่องได้ เพราะตอนนี้ localStorage อย่างเดียวเสี่ยงข้อมูลหาย

2. **ทำ Resume print ให้ deterministic**
   - กำหนด A4/Letter page size, margins, page break rules, font size scale และ overflow handling
   - เพิ่ม print preview/checklist เช่น “ข้อมูลเกิน 1 หน้า”, “รูปใหญ่เกิน”, “ยังมี placeholder”
   - แยก resume one-page กับ multi-page profile

3. **ทำ DOCX exporter ให้พร้อมใช้หรือซ่อนอย่างตั้งใจ**
   - ถ้าจะเปิดใช้ ต้องทดสอบ encoding ภาษาไทย, bullet, section ordering, page margins, link และรูป
   - ถ้ายังไม่พร้อม ควรเขียน label ว่า Coming soon แทน disabled ที่ผู้ใช้อาจสับสน

4. **เพิ่ม Prompt Canvas Exporter**
   - ปุ่ม Copy Prompt / Export Prompt ที่สร้าง prompt จากข้อมูลจริงใน StorageHandler
   - มี mode อย่างน้อย 3 แบบ: `portfolio website`, `print resume`, `visual design system`
   - ให้ output มีทั้ง content summary, design constraints, print constraints และ editable theme tokens

5. **เพิ่ม onboarding สำหรับผู้ใช้ใหม่**
   - Wizard 3 ขั้น: กรอกข้อมูลพื้นฐาน → เพิ่ม project/experience → เลือกเป้าหมาย export
   - เตือนผู้ใช้เมื่อยังใช้ demo placeholder

## Roadmap ที่แนะนำ

### Phase 1: ทำให้เป็นเครื่องมือใช้งานจริงสำหรับ CV/Resume
- เพิ่ม JSON import/export
- เพิ่ม print readiness checklist
- เปิด/ปรับ DOCX exporter หรือทำป้าย Coming soon ให้ชัด
- เพิ่ม preset resume: one-page ATS, creative CV, academic CV
- เพิ่ม fields ที่ recruiter ใช้จริง: location, website, GitHub/Behance/Dribbble, summary bullets, achievements with metrics

### Phase 2: ทำให้ Portfolio เป็น content hub
- แยก project กับ work experience เพราะ portfolio ต้องโชว์ case study แต่ resume ต้องสรุป achievement
- เพิ่ม project detail fields: problem, role, action, result, tools, screenshots, link, impact metrics
- เพิ่ม media library เบื้องต้นสำหรับรูป project/avatar
- เพิ่ม share/deploy guide เช่น GitHub Pages/Netlify/Vercel static deploy

### Phase 3: Prompt-to-Canvas / user-owned design
- เพิ่ม Canvas Prompt panel ใน UI
- Prompt ควรมีโครงแบบ RTF/CARE/PAR เพื่อให้ AI design tool เข้าใจทั้ง role, task, data, visual direction และ print constraints
- เพิ่มปุ่ม copy prompt แยกตาม use case:
  - สร้างเว็บ portfolio design ใหม่
  - สร้าง resume/CV print layout
  - สร้าง visual identity/theme tokens
  - สร้าง component spec สำหรับ designer/developer

### Phase 4: Data portability และ production polish
- เพิ่ม versioned schema + migration
- เพิ่ม validation และ privacy notice ว่าข้อมูลอยู่ใน browser/localStorage
- เพิ่ม accessibility: keyboard navigation, contrast check, reduced motion
- เพิ่ม automated smoke test หรือ lightweight Playwright test สำหรับ render, edit, print mode, export prompt

## Prompt Canvas template ที่ควรเพิ่มในระบบ

```text
Role: You are a senior product designer and resume/portfolio art director.
Task: Create a custom design for a personal portfolio website and printable CV/resume from the structured profile below.
Context:
- The user wants a design that can become both a web portfolio and an A4/Letter printable resume.
- Keep all content editable and avoid locking text into images.
- Prioritize readability, recruiter scanning, responsive layout, and print-safe spacing.
Profile data:
{PROFILE_JSON_OR_SUMMARY}
Design direction:
- Style: {theme/style}
- Tone: {professional/creative/minimal/etc.}
- Color tokens: {primary, secondary, background, text}
- Typography: Thai + English friendly fonts, clear hierarchy.
Output format:
1. Web portfolio layout plan
2. Printable resume layout plan
3. Component list
4. Color/type/spacing tokens
5. Notes for implementation in HTML/CSS
Constraints:
- Must print cleanly on A4 and Letter.
- No critical content in background images.
- Keep contact info and name visible on the first page.
- Avoid excessive animation in resume/print mode.
```

## Definition of Done ที่แนะนำ

โปรเจกต์ควรถูกนับว่า “พร้อมเป็นเว็บเก็บ portfolio และ CV/resume พร้อมปริ้น” เมื่อ:
- ผู้ใช้สร้าง/แก้/บันทึกข้อมูลได้โดยไม่แตะโค้ด
- ผู้ใช้ export/import ข้อมูลตัวเองเป็น JSON ได้
- Resume print ออกมาอ่านง่ายบน A4/Letter โดยไม่ตัดข้อมูลสำคัญ
- มี PDF/print flow ที่ชัดเจน และ DOCX/PPTX มีสถานะพร้อมใช้หรือระบุข้อจำกัดชัดเจน
- มี prompt exporter ที่ดึงข้อมูลจริงไปสร้าง prompt สำหรับ Canvas/AI design tool ได้ในคลิกเดียว
- มี checklist เตือน placeholder, ข้อมูลติดต่อหาย, project ไม่มี result, และ print overflow

## Design benchmark update: รูปภาพ, งานพิมพ์, ราชการ/มืออาชีพ

จากการเทียบกับแนวทางของ resume/portfolio builders และตัวอย่าง portfolio สมัยใหม่ จุดที่ควรยึดคือ:
- Resume ในไทยมักยอมรับการมีรูป professional headshot ด้านบน โดยเฉพาะงานในประเทศ/องค์กรท้องถิ่น แต่ต้องเป็นรูปสุภาพ ไม่ใช่รูป lifestyle
- Resume สำหรับยื่นสมัครงานควรอ่านเร็วใน 1-2 หน้า ใช้ภาษาเป็นทางการ และ bullet ต้องชี้ impact มากกว่ารายละเอียดทั่วไป
- Portfolio ควรใช้ภาพเป็น evidence ของ case study แต่รูปต้องอยู่ใน grid ที่สม่ำเสมอ ไม่สูง/กว้างไม่เท่ากันจน flow พังเมื่อพิมพ์
- สำหรับราชการ/องค์กร conservative ควรลด gradient, animation, shadow และสีจัดใน print mode ให้เหลือเส้นแบ่ง, spacing, หัวข้อ และรูปติดบัตร/รูป portrait ที่คุมสัดส่วน

### คำตอบตรง: ช่องวางรูปเดิมดีพอไหม
- **สำหรับเว็บ portfolio:** ใช้ได้ในเชิง visual และ scrollytelling แต่ยังเสี่ยงดูเป็นโชว์เอฟเฟกต์มากกว่างานมืออาชีพ ถ้ารูปหลายขนาดปนกัน
- **สำหรับ resume/CV print:** ยังควรปรับ เพราะรูป profile เดิมเป็น square 24x24 tailwind class ใน resume mode ซึ่งดู modern แต่ยังไม่ค่อยเหมือนเอกสารสมัครงานไทย/ราชการที่นิยม portrait headshot
- **สำหรับ portfolio print:** ควรใช้ grid ภาพที่ fixed ratio และ fixed print height เพื่อไม่ให้รูปดันเนื้อหาและทำให้หน้าแตก

### สิ่งที่ปรับแล้วในรอบนี้
- คุม resume shell ให้เป็น 2 column ที่นิ่งขึ้นบนจอ และเป็น 58mm sidebar + main column ใน print
- ปรับรูป profile ใน resume ให้เป็น portrait headshot 112x140px บนจอ และ 32x40mm ตอนพิมพ์
- ปรับ portfolio image slot ให้เป็น 16:10 บนเว็บ และเป็น grid fixed height ตอนพิมพ์
- ลด visual noise ตอน print: ซ่อน orb, mouse grid, hero chip, floating card และปุ่มแก้ไข
- บังคับ print resume ให้ใช้เส้นแบ่ง/spacing/font size แบบเอกสารมืออาชีพแทน card/shadow/gradient
