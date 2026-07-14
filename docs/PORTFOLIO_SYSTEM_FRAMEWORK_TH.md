# Framework ระบบ Portfolio Template

เอกสารนี้อธิบายโครงสร้างและแนวคิดที่ใช้สร้างเว็บ Portfolio/Resume ปัจจุบัน เพื่อให้สามารถนำไปสาธิต อธิบายต่อผู้ใช้ หรือใช้เป็น blueprint สำหรับสร้างโปรเจกต์ลักษณะเดียวกัน

## 1. เป้าหมายของระบบ

เว็บนี้ถูกออกแบบให้เป็นเครื่องมือสร้าง Portfolio และ Resume แบบไม่ต้องมีฐานข้อมูล โดยผู้ใช้สามารถ:

- แก้ข้อมูลผ่านหน้าเว็บ
- สลับภาษาไทย/อังกฤษ
- สลับ Portfolio/Resume
- เลือก Dark/Light และธีมหลายแบบ
- แสดงผลงานพร้อมรูปภาพแบบ interactive
- Export เป็น WEB, PDF และรูปแบบนำเสนอที่ระบบรองรับ
- Deploy เป็น static site บน Vercel

## 2. Architecture ปัจจุบัน

```text
portfolio-template/
├── public/
│   ├── legacy/v49-app.js          # runtime หลักที่ render UI และควบคุมระบบ
│   ├── css/
│   │   ├── style.css              # style หลัก
│   │   ├── coverflow-scrollytelling.css
│   │   ├── resume-theme-sync.css
│   │   └── mobile-nav.css
│   └── js/
│       ├── coverflow-scrollytelling.js
│       └── mobile-nav-center.js
├── dist/                          # prebuilt output ที่ Vercel ใช้ deploy
│   ├── index.html
│   ├── legacy/v49-app.js
│   ├── css/
│   └── js/
├── scripts/
│   └── prepare-vercel.cjs         # เตรียม dist และ inject assets ก่อน deploy
├── vercel.json
└── docs/
```

## 3. Layer ของระบบ

### 3.1 Data Layer

ข้อมูลผู้ใช้ถูกเก็บฝั่ง browser เป็นหลัก เช่น:

- ชื่อ ตำแหน่ง ประวัติย่อ
- Skills และ Contact
- Experience/Project
- รูปภาพ
- Theme, language และ layout
- Print settings บางส่วน

หลักสำคัญ:

- ข้อมูลต้องแยก TH/EN ชัดเจน
- ห้ามเปลี่ยนชื่อ field โดยไม่มี migration
- รูป base64 ขนาดใหญ่มีผลต่อ localStorage และ performance
- ก่อนเปลี่ยน data model ต้องกำหนด schema และ fallback

### 3.2 Presentation Layer

ระบบมี 2 layout หลัก:

#### Portfolio

- Hero
- Professional summary
- Skills/Contact
- Experience & Projects
- Extra sections
- Scrollytelling/Coverflow
- Cursor microinteraction

#### Resume

- A4-oriented layout
- Sidebar + main content
- Theme-aware accent
- Print-safe spacing
- ลด animation และ visual noise

### 3.3 Theme Layer

แต่ละ theme ไม่ควรเป็นเพียงการเปลี่ยนสีเดียว แต่ควรมี visual direction ของตนเอง เช่น:

- Tech: เย็น เรียบ แม่นยำ
- Education: เป็นมิตร มีโครงสร้าง
- Government: สุภาพ เป็นทางการ อ่านง่าย
- Creative: แสดงออกแต่ไม่รบกวนเนื้อหา
- Minimal: ลดเงา ลด gradient
- Eco: นุ่มและ organic
- Bold: contrast สูงแต่ไม่รก
- Luxury: สุขุม ใช้ accent อย่างประหยัด
- Health: สะอาด น่าเชื่อถือ
- Esports: energetic แต่ยัง professional

Resume ต้องใช้ token จาก theme เดียวกับ Portfolio เช่น:

```css
--resume-accent
--resume-accent-2
--resume-sidebar-1
--resume-sidebar-2
--resume-sidebar-3
```

### 3.4 Interaction Layer

Interaction หลักประกอบด้วย:

- Cursor-facing background grid 3x3
- Hero/card/panel tilt แบบ subtle
- Coverflow ของรูปผลงาน
- Open–Move–Hold–Close timeline
- Mobile top navigation

หลัก performance:

- ใช้ `requestAnimationFrame`
- เน้น `transform` และ `opacity`
- หลีกเลี่ยง update `top`, `left`, `width`, `height` ใน pointer loop
- ลด blur, glow และ fixed overlay บน mobile
- ปิด interaction ใน print และ reduced motion

## 4. Cinematic/Coverflow Framework

รายการที่มีรูป 2 รูปขึ้นไปใช้ Coverflow แทน image rail แบบเดิม

Timeline แนะนำ:

```js
const openAfter = 0.06;
const startMove = 0.12;
const endMove = 0.76;
const collapseAfter = 0.90;
```

Phase:

1. Closed lead-in
2. Open
3. Move through images
4. Final hold
5. Close
6. Continue to next card

ข้อกำหนด:

- 1 รูป: แสดงปกติ ไม่ sticky
- 2+ รูป: ใช้ Coverflow
- Desktop และ Mobile ใช้แนวคิดเดียวกัน แต่ scale/step/angle responsive
- ไม่ใช้ horizontal blank rail
- ไม่สร้าง trailing spacer ที่ยาวเกินจำเป็น
- Print ต้อง flatten เป็น grid/static images

## 5. Build และ Deploy Framework

Vercel ใช้ committed `dist` ผ่าน `vercel.json` และ `scripts/prepare-vercel.cjs`

ดังนั้นเมื่อเพิ่ม asset ใหม่ ต้องตรวจว่า:

1. มีไฟล์ใน `public/`
2. มีสำเนาที่สอดคล้องใน `dist/`
3. `prepare-vercel.cjs` inject/link asset จริง
4. cache version เปลี่ยนเมื่อจำเป็น
5. production deploy แล้วโหลด asset ใหม่จริง

ตัวอย่าง asset version:

```html
<link rel="stylesheet" href="/css/mobile-nav.css?v=3">
<script src="/js/mobile-nav-center.js?v=1"></script>
```

## 6. Print/Export Framework

สิ่งที่ต้อง preserve ทุกครั้ง:

- Portfolio PDF portrait
- Portfolio PDF landscape เมื่อรองรับ
- Resume PDF portrait
- Project images ไม่ถูกซ่อนจากสถานะ collapsed
- Nav, modal, cursor grid และ edit control ไม่ติดไปใน PDF
- Theme มี contrast เพียงพอ
- WEB export ซ่อนเครื่องมือแก้ไข

กฎสำคัญ:

```css
@media print {
  .no-print,
  nav,
  #edit-modal,
  #mouse-grid-field {
    display: none !important;
  }
}
```

## 7. Secure-by-default และ Privacy

แม้เป็น static app ยังต้องระวัง:

- อย่า commit API key หรือ token
- อย่าใส่ข้อมูลส่วนบุคคลจริงใน demo/default data
- Validate file type และขนาดรูป
- Escape user text ก่อนประกอบ HTML
- Export ต้องไม่แอบแนบข้อมูลที่ผู้ใช้ไม่ได้เลือก
- อธิบายให้ผู้ใช้ทราบว่าข้อมูลอยู่ใน browser/localStorage

## 8. Workflow การแก้โค้ด

1. ตรวจ source of truth
2. สร้าง backup branch
3. จำกัด scope ให้ชัด
4. แก้ source และ prebuilt ให้สอดคล้อง
5. ตรวจ syntax/diff
6. Deploy
7. ทดสอบ Desktop/Mobile/Print
8. รายงานสิ่งที่แก้ สิ่งที่ไม่แตะ และสิ่งที่ยังไม่ได้ยืนยัน

## 9. Definition of Done

งานหนึ่งควรนับว่าเสร็จเมื่อ:

- Source ถูกแก้ถูกตำแหน่ง
- Runtime โหลดไฟล์จริง ไม่เป็น orphan
- ไม่มี console error ที่ตรวจพบ
- Desktop และ Mobile ทำงานตาม acceptance criteria
- Print/Export ไม่ regress
- Deployment สำเร็จ
- Production ผ่านการตรวจจริง
- มี backup branch หรือ recovery commit
- ไม่มีเอกสาร README เวอร์ชันย่อยเพิ่มโดยไม่จำเป็น
